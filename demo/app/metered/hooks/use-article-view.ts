import { useState } from "react";
import {
  hasViewedArticle,
  hasReachedLimit,
  recordArticleView,
} from "@/lib/metered-access";

export function useArticleView() {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const handleArticleClick = (articleId: string) => {
    const alreadyViewed = hasViewedArticle(articleId);
    const reachedLimit = hasReachedLimit();

    // Record the view (only increments if new and not at limit)
    if (!alreadyViewed && !reachedLimit) {
      recordArticleView(articleId);
    }

    // Always allow opening articles, even if locked - shows preview + CTA
    setSelectedArticle(articleId);
  };

  const canViewArticle = (articleId: string, isPremium: boolean) => {
    const hasViewed = hasViewedArticle(articleId);
    return isPremium || hasViewed || !hasReachedLimit();
  };

  return {
    selectedArticle,
    setSelectedArticle,
    handleArticleClick,
    canViewArticle,
  };
}
