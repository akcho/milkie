import { useState } from "react";
import {
  hasViewedArticle,
  hasReachedLimit,
  recordArticleView
} from "@/lib/metered-access";

export function useArticleView() {
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);

  const handleArticleClick = (articleId: string) => {
    const alreadyViewed = hasViewedArticle(articleId);
    const reachedLimit = hasReachedLimit();

    // Allow clicking locked articles to show preview + CTA
    // They won't be able to read full content, but can see what they're missing

    // Record the view (only increments if new and not at limit)
    if (!alreadyViewed && !reachedLimit) {
      recordArticleView(articleId);
    }

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
    canViewArticle
  };
}
