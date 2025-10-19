import { useState, useEffect } from "react";
import {
  getRemainingArticles,
  hasReachedLimit,
  hasViewedArticle,
  FREE_ARTICLE_LIMIT,
} from "@/lib/metered-access";

export function useArticleList(
  isPremium: boolean,
  selectedArticle: string | null
) {
  const [remaining, setRemaining] = useState(FREE_ARTICLE_LIMIT);
  const [mounted, setMounted] = useState(false);

  // Update counts on mount and when returning to list
  useEffect(() => {
    setMounted(true);
    setRemaining(getRemainingArticles());
  }, [selectedArticle]);

  const getArticleState = (articleId: string) => {
    // Return safe defaults during SSR to prevent hydration mismatch
    if (!mounted) {
      return { viewed: false, locked: false };
    }

    const viewed = hasViewedArticle(articleId);
    const locked = !isPremium && !viewed && hasReachedLimit();

    return { viewed, locked };
  };

  return {
    remaining,
    mounted,
    getArticleState,
  };
}
