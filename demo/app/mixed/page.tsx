"use client";

import { Header } from "@/components/header";
import { MixedPageHeader } from "./components/MixedPageHeader";
import { FreePreviewCard } from "./components/FreePreviewCard";
import { PremiumTutorialSection } from "./components/PremiumTutorialSection";
import { MoreFreeContentCard } from "./components/MoreFreeContentCard";
import { AdvancedFeaturesSection } from "./components/AdvancedFeaturesSection";
import { ImplementationExample } from "./components/ImplementationExample";

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
