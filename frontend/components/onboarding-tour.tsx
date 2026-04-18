"use client";

import { useEffect, useRef } from "react";
import { driver } from "driver.js";
import "driver.js/dist/driver.css";
import { useRouter, usePathname } from "next/navigation";
import { useAuthContext } from "@/lib/auth-context";

export function OnboardingTour() {
  const { user, loading, handleCompleteOnboarding } = useAuthContext();
  const router = useRouter();
  const pathname = usePathname();
  const tourInstance = useRef<any>(null);

  useEffect(() => {
    // Only start if user is logged in and hasn't completed onboarding
    if (loading || !user || user.onboarding_completed) return;

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
            onNextClick: () => {
              router.push("/settings");
              setTimeout(() => d.moveNext(), 150);
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
            onNextClick: () => {
              router.push("/profile");
              setTimeout(() => d.moveNext(), 200);
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
          onHighlighted: () => {
            const historyTab = document.getElementById("profile-tab-history");
            if (historyTab) historyTab.click();

            setTimeout(() => d.refresh(), 350);
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
          onHighlighted: () => {
            const goalsTab = document.getElementById("profile-tab-goals");
            if (goalsTab) goalsTab.click();

            setTimeout(() => d.refresh(), 350);
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
          onHighlighted: () => {
            const docsTab = document.getElementById("profile-tab-documents");
            if (docsTab) docsTab.click();

            setTimeout(() => d.refresh(), 350);
          }
        },
        // STEP 10: Final Completion
        {
          popover: {
            title: "You're All Set! 🎉",
            description: "Your profile is optimized. You'll now see real matches on your dashboard. Start exploring scholarships!",
            onNextClick: async () => {
              await handleCompleteOnboarding();
              router.push("/dashboard");
              d.destroy();
            }
          },
        }
      ]
    });

    tourInstance.current = d;

    // Start tour based on current location and logic
    if (!user.onboarding_completed) {
      if (pathname === "/dashboard") {
        d.drive();
      }
    }

  }, [user, loading, pathname, router, handleCompleteOnboarding]);

  return null;
}
