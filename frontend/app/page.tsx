"use client";

import React from "react";
import { SiteShell } from "@/components/site-shell";
import { Footer } from "@/components/footer";
import { useRouter } from "next/navigation";
import { useAuthContext } from "@/lib/auth-context";

// Modular Sections
import HeroSection from "@/components/landing/hero/page";
import ComparisonSection from "@/components/landing/comparison/page";
import FeaturesSection from "@/components/landing/features/page";
import AboutSection from "@/components/landing/about/page";
import ProcessSection from "@/components/landing/process/page";
import FAQSection from "@/components/landing/faq/page";
import CTASection from "@/components/landing/cta/page";

export default function LandingPage() {
  const router = useRouter();
  const { user, loading, handleLogout } = useAuthContext();

  React.useEffect(() => {
    if (!loading && user) {
      router.replace("/dashboard");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white text-zinc-950">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white selection:bg-zinc-900 selection:text-white">
      {/* Global Navigation Header */}
      <SiteShell user={user} onLogout={handleLogout} />

      <main>
        {/* Hero Section */}
        <HeroSection user={user} />

        {/* Features Section */}
        <FeaturesSection />

        {/* Before/After Comparison */}
        <ComparisonSection />

        {/* Process Section */}
        <ProcessSection />

        {/* About Section */}
        <AboutSection />

        {/* FAQ Section */}
        <FAQSection />

        {/* CTA Section */}
        <CTASection user={user} />
      </main>

      {/* Global Footer */}
      <Footer />
    </div>
  );
}
