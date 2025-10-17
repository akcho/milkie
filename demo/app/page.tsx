"use client";

import { Header } from "@/components/header/header";
import { HeroSection } from "./components/hero-section";
import { DemoExamplesGrid } from "./components/demo-examples-grid";
import { HowItWorksSection } from "./components/how-it-works-section";
import { CtaSection } from "./components/cta-section";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-16 max-w-6xl">
        <HeroSection />
        <DemoExamplesGrid />
        <HowItWorksSection />
        <CtaSection />
      </div>
    </div>
  );
}
