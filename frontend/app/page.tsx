"use client";

import React from "react";
import { SiteShell } from "@/components/site-shell";
import { Footer } from "@/components/footer";
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
  const { user, handleLogout } = useAuthContext();

  return (
    <div className="min-h-screen bg-white selection:bg-zinc-900 selection:text-white">
      {/* Global Navigation Header */}
      <SiteShell user={user} onLogout={handleLogout} />

      <main>
        {/* Hero Section */}
        <HeroSection user={user} />

        {/* About Section */}
        <AboutSection />

        {/* Features Section */}
        <FeaturesSection />

        {/* Before/After Comparison */}
        <ComparisonSection />

        {/* Process Section */}
        <ProcessSection />

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
