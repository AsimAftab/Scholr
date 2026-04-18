"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
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
  const driverRef = useRef<any>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    if (loading || !user || user.onboarding_completed) return;
    if (startedRef.current) return;
    if (pathname !== "/dashboard") return;
    if (!document.querySelector("#dashboard-welcome")) return;

    // Initialize driver
    const d = driver({
      showProgress: true,
      animate: true,
      allowClose: false,
      overlayColor: "rgba(0, 0, 0, 0.75)",
      stagePadding: 4,
      steps: [
        // STEP 1: Welcome (on /dashboard)
        {
          element: "#dashboard-welcome",
          popover: {
            title: "Welcome to Scholr! 🎓",
            description: "We're excited to help you find your perfect scholarship. Let's take a quick tour to set up your AI matching engine.",
            side: "bottom",
            align: "start",
          },
        },
        // STEP 2: Stats (on /dashboard)
        {
          element: "#dashboard-stats",
          popover: {
            title: "Your Matching Engine",
            description: "Scholr uses AI to calculate match scores based on your profile. These stats will update as you complete your info.",
            side: "top",
            align: "center",
          },
        },
        // STEP 3: Navigation Hub (on /dashboard)
        {
          element: "aside",
          popover: {
            title: "Navigation Hub",
            description: "This sidebar is your home base. You can quickly jump between your Dashboard, Catalog, and Academic Profile.",
            side: "right",
            align: "start",
          },
        },
        // STEP 4: Settings Link (on /dashboard)
        {
          element: '[data-tour-id="nav-settings"]',
          popover: {
            title: "Profile Readiness",
            description: "To get those 100% matches, we need to know who you are. Let's head to Settings to finish your basic info.",
            side: "right",
            align: "center",
            onNextClick: async () => {
              router.push("/settings");
              await waitForElement("#settings-personal-card");
              d.moveNext();
            }
          },
        },
        // STEP 5: Personal Information Card (on /settings)
        {
          element: "#settings-personal-card",
          popover: {
            title: "Your Personal Identity 👤",
            description: "Please fill in your name and location by editing your profile so our AI can refine your matches.",
            side: "left",
            align: "start",
          }
        },
        // STEP 6: Transition to Profile (via sidebar)
        {
          element: '[data-tour-id="nav-academic-info"]',
          popover: {
            title: "Next: Academic Standing",
            description: "Now let's head over to your Academic Profile to dive into your degree goals and credentials.",
            side: "right",
            align: "center",
            onNextClick: async () => {
              router.push("/profile");
              await waitForElement("#profile-history-card");
              d.moveNext();
            }
          },
        },
        // STEP 7: Academic History (on /profile)
        {
          element: "#profile-history-card",
          popover: {
            title: "Step 1: Academic Credentials 📚",
            description: "Please complete your Academic History by editing your profile. Filling in your GPA and test scores is critical for our AI reasoning engine.",
            side: "left",
            align: "start",
          },
          onHighlighted: async () => {
            const historyTab = document.getElementById("profile-tab-history");
            if (historyTab) historyTab.click();

            await waitForElement("#profile-history-card");
            d.refresh();
          }
        },
        // STEP 8: Goals & Aspirations (on /profile)
        {
          element: "#profile-goals-card",
          popover: {
            title: "Step 2: Future Goals 🎯",
            description: "Please fill in your target degree and location. This allows our AI to find the best possible scholarships for your future.",
            side: "left",
            align: "start",
          },
          onHighlighted: async () => {
            const goalsTab = document.getElementById("profile-tab-goals");
            if (goalsTab) goalsTab.click();

            await waitForElement("#profile-goals-card");
            d.refresh();
          }
        },
        // STEP 9: Documents (on /profile)
        {
          element: "#profile-documents-section",
          popover: {
            title: "Step 3: Document Uploads 📄",
            description: "Finally, upload your resume or add your work experience. These details provide crucial context for competitive awards.",
            side: "left",
            align: "start",
          },
          onHighlighted: async () => {
            const docsTab = document.getElementById("profile-tab-documents");
            if (docsTab) docsTab.click();

            await waitForElement("#profile-documents-section");
            d.refresh();
          }
        },
        // STEP 10: Final Completion
        {
          popover: {
            title: "You're All Set! 🎉",
            description: "Your profile is optimized. You'll now see real matches on your dashboard. Start exploring scholarships!",
            onNextClick: async () => {
              try {
                await handleCompleteOnboarding();
                router.push("/dashboard");
                d.destroy();
                driverRef.current = null;
              } catch {
                d.destroy();
                driverRef.current = null;
                startedRef.current = false;
                showToast("We couldn't finish onboarding. Please check your connection and try again.", "error");
              }
            }
          },
        }
      ]
    });

    driverRef.current = d;
    startedRef.current = true;
    d.drive();
  }, [user, loading, pathname, router, handleCompleteOnboarding, showToast]);

  useEffect(() => {
    return () => {
      driverRef.current?.destroy();
      driverRef.current = null;
    };
  }, []);

  return null;
}

