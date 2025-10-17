"use client";

import { usePaywall } from "@milkie/react";
import { FREE_ARTICLE_LIMIT } from "@/lib/metered-access";
import { Header } from "@/components/header/header";
import { SAMPLE_ARTICLES } from "./constants";
import { useArticleList } from "./hooks/use-article-list";
import { useArticleView } from "./hooks/use-article-view";
import { ArticleCard } from "./components/article-card";
import { ArticleView } from "./components/article-view";
import { ArticleListHeader } from "./components/article-list-header";
import { useMemo } from "react";

export default function MeteredPage() {
  const { hasAccess: isPremium, loading } = usePaywall();
  const { selectedArticle, setSelectedArticle, handleArticleClick, canViewArticle } = useArticleView();
  const { remaining, mounted, getArticleState } = useArticleList(isPremium, selectedArticle);

  // Wait for both mount (localStorage) and loading (subscription) to complete
  // This prevents jarring state changes - everything appears at once
  const isReady = mounted && !loading;

  // Memoize article states to avoid recalculating on every render
  const articleStates = useMemo(() => {
    return SAMPLE_ARTICLES.map(article => ({
      id: article.id,
      ...getArticleState(article.id)
    }));
  }, [getArticleState]);

  const article = SAMPLE_ARTICLES.find(a => a.id === selectedArticle);

  // Show article view
  if (selectedArticle) {
    // Handle case where article is not found
    if (!article) {
      return (
        <div className="min-h-screen bg-background">
          <Header />
          <div className="container mx-auto px-4 py-8 max-w-3xl">
            <p className="text-center text-muted-foreground">Article not found</p>
          </div>
        </div>
      );
    }

    const canView = canViewArticle(selectedArticle, isPremium);

    return (
      <ArticleView
        article={article}
        canView={canView}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  // Show article list
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ArticleListHeader
          isPremium={isPremium}
          remaining={remaining}
          freeArticleLimit={FREE_ARTICLE_LIMIT}
          loading={loading}
          mounted={mounted}
        />

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_ARTICLES.map((article) => {
            const state = articleStates.find(s => s.id === article.id);
            const { viewed = false, locked = false } = state || {};

            return (
              <ArticleCard
                key={article.id}
                article={article}
                viewed={isReady ? viewed : false}
                locked={isReady ? locked : false}
                isPremium={isReady ? isPremium : false}
                onClick={() => handleArticleClick(article.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
