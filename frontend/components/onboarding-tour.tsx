"use client";

import { useEffect, useRef } from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import { usePathname, useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/auth-context";
import { useToast } from "@/components/toast";

/**
 * Polls the DOM for a selector, resolving once the element is found.
 * Rejects after `timeoutMs` if the element never appears.
 */
function waitForElement(
  selector: string,
  timeoutMs = 5000,
  intervalMs = 50
): Promise<Element> {
  return new Promise((resolve, reject) => {
    const el = document.querySelector(selector);
    if (el) return resolve(el);

    const start = Date.now();
    const poll = setInterval(() => {
      const found = document.querySelector(selector);
      if (found) {
        clearInterval(poll);
        return resolve(found);
      }
      if (Date.now() - start >= timeoutMs) {
        clearInterval(poll);
        reject(new Error(`waitForElement: "${selector}" not found within ${timeoutMs}ms`));
      }
    }, intervalMs);
  });
}

export function OnboardingTour() {
  const { user, loading, handleCompleteOnboarding } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const { showToast } = useToast();
  const tourRef = useRef<any>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    // Expose global method to advance tour from external components (like profile form success)
    (window as any).__advanceScholrTour = () => {
      if (tourRef.current) tourRef.current.next();
    };

    if (loading || !user || user.onboarding_completed || user.role === "admin") return;
    if (startedRef.current) return;
    if (pathname !== "/dashboard") return;
    let isCancelled = false;

    const startTour = async () => {
      try {
        await waitForElement("#dashboard-stats", 5000);
      } catch (err) {
        return;
      }
      if (isCancelled || startedRef.current) return;

      const tour = new Shepherd.Tour({
        defaultStepOptions: {
          cancelIcon: { enabled: true },
          classes: 'shepherd-theme-custom',
          scrollTo: { behavior: 'smooth', block: 'center' }
        },
        useModalOverlay: true
      });

      tour.on('cancel', async () => {
        try {
          await handleCompleteOnboarding();
        } catch (error) {
          console.error("Failed to mark onboarding as complete on skip:", error);
        }
      });

      const skipButton = {
        text: 'Skip',
        action: tour.cancel,
        classes: 'shepherd-button-secondary'
      };
      const backButton = {
        text: 'Back',
        action: tour.back,
        classes: 'shepherd-button-secondary'
      };
      const nextButton = {
        text: 'Next',
        action: tour.next,
        classes: 'shepherd-button-primary'
      };

      tour.addStep({
        id: 'step-1',
        attachTo: { element: '#sidebar-logo', on: 'right' },
        title: "Welcome to Scholr! 🎓",
        text: "Scholr streamlines your search for global educational funding using advanced AI. Let's take a quick tour to set up your AI matching engine.",
        buttons: [skipButton, nextButton]
      });

      tour.addStep({
        id: 'step-2',
        attachTo: { element: '#dashboard-stats', on: 'top' },
        title: "Your Matching Engine ⚡",
        text: "Scholr uses AI to calculate match scores based on your profile. These stats will update as you complete your info.",
        buttons: [skipButton, backButton, nextButton]
      });

      tour.addStep({
        id: 'step-3',
        attachTo: { element: '#sidebar-nav', on: 'right' },
        title: "Navigation Panel 🧭",
        text: "This sidebar is your home base. You can quickly jump between your Dashboard, Catalog, and Academic Profile.",
        buttons: [skipButton, backButton, nextButton]
      });

      tour.addStep({
        id: 'step-4',
        attachTo: { element: '[data-tour-id="nav-settings"]', on: 'right' },
        title: "Profile Readiness 📋",
        text: "To get those 100% matches, we need to know who you are. Let's head to Settings to finish your basic info.",
        buttons: [
          skipButton,
          backButton,
          {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: async () => {
              router.push("/settings");
              await waitForElement("#settings-personal-card");
              tour.next();
            }
          }
        ]
      });

      tour.addStep({
        id: 'step-5',
        attachTo: { element: '#settings-personal-card', on: 'left' },
        title: "Your Personal Identity 👤",
        text: "Click the 'Edit Profile' button to fill in your details like location and GPA. Save your changes, then click Next to continue the tour!",
        buttons: [
          skipButton,
          {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: async () => {
              router.push("/dashboard");
              await waitForElement('[data-tour-id="nav-settings"]');
              tour.back();
            }
          },
          nextButton
        ]
      });

      tour.addStep({
        id: 'step-6',
        attachTo: { element: '[data-tour-id="nav-academic-info"]', on: 'right' },
        title: "Next: Academic Standing 🏫",
        text: "Now let's head over to your Academic Profile to dive into your degree goals and credentials.",
        buttons: [
          skipButton,
          backButton,
          {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: async () => {
              router.push("/profile");
              await waitForElement("#profile-history-card");
              tour.next();
            }
          }
        ]
      });

      tour.addStep({
        id: 'step-7',
        attachTo: { element: '#profile-form-wrapper', on: 'left' },
        scrollTo: false,
        title: "Complete Your Profile 📋",
        text: "Fill out your details across the tabs, then click Next on this tour to save and finish!",
        when: {
          show: async () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            const historyTab = document.getElementById("profile-tab-history");
            if (historyTab) historyTab.click();
            await waitForElement("#profile-history-card");
          }
        },
        buttons: [
          skipButton,
          {
            text: 'Back',
            classes: 'shepherd-button-secondary',
            action: async () => {
              router.push("/settings");
              await waitForElement('[data-tour-id="nav-academic-info"]');
              tour.back();
            }
          },
          {
            text: 'Next',
            classes: 'shepherd-button-primary',
            action: () => {
              const submitBtn = document.querySelector<HTMLButtonElement>('#profile-form-wrapper button[type="submit"]');
              if (submitBtn) {
                // Click the hidden or visible submit button. 
                // We DO NOT call tour.next() here. It will be called by the page.tsx on success!
                submitBtn.click();
              } else {
                tour.next();
              }
            }
          }
        ]
      });

      tour.addStep({
        id: 'step-8',
        title: "You're All Set! 🎉",
        text: "Your profile is optimized. You'll now see real matches on your dashboard. Start exploring scholarships!",
        buttons: [
          backButton,
          {
            text: 'Finish',
            classes: 'shepherd-button-primary',
            action: async () => {
              try {
                await handleCompleteOnboarding();
                router.push("/dashboard");
                tour.complete();
                tourRef.current = null;
              } catch {
                tour.cancel();
                tourRef.current = null;
                startedRef.current = false;
                showToast("We couldn't finish onboarding. Please check your connection and try again.", "error");
              }
            }
          }
        ]
      });

      tourRef.current = tour;
      startedRef.current = true;
      tour.start();
    };

    startTour();

    return () => {
      isCancelled = true;
    };
  }, [user, loading, pathname, router, handleCompleteOnboarding, showToast]);

  useEffect(() => {
    return () => {
      if (tourRef.current) {
        tourRef.current.cancel();
        tourRef.current = null;
      }
      delete (window as any).__advanceScholrTour;
    };
  }, []);

  return null;
}
