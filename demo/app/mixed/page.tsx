"use client";

import { Header } from "@/components/header";
import { MixedPageHeader } from "./components/mixed-page-header";
import { FreePreviewCard } from "./components/free-preview-card";
import { PremiumTutorialSection } from "./components/premium-tutorial-section";
import { MoreFreeContentCard } from "./components/more-free-content-card";
import { AdvancedFeaturesSection } from "./components/advanced-features-section";
import { ImplementationExample } from "./components/implementation-example";

export default function MixedContentPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <MixedPageHeader />

        <div className="space-y-6">
          <FreePreviewCard />
          <PremiumTutorialSection />
          <MoreFreeContentCard />
          <AdvancedFeaturesSection />
          <ImplementationExample />
        </div>
      </div>
    </div>
  );
}
