"use client";

import { usePaywall } from "@milkie/react";
import { FREE_ARTICLE_LIMIT } from "@/lib/metered-access";
import { Header } from "@/components/header";
import { SAMPLE_ARTICLES } from "./constants";
import { useArticleList } from "./hooks/useArticleList";
import { useArticleView } from "./hooks/useArticleView";
import { ArticleCard } from "./components/ArticleCard";
import { ArticleView } from "./components/ArticleView";
import { ArticleListHeader } from "./components/ArticleListHeader";

export default function MeteredPage() {
  const { hasAccess: isPremium, loading } = usePaywall();
  const { selectedArticle, setSelectedArticle, handleArticleClick, canViewArticle } = useArticleView();
  const { remaining, mounted, getArticleState } = useArticleList(isPremium, selectedArticle);

  const article = SAMPLE_ARTICLES.find(a => a.id === selectedArticle);

  // Show article view
  if (selectedArticle && article) {
    const canView = canViewArticle(selectedArticle, isPremium);

    return (
      <ArticleView
        article={article}
        canView={canView}
        onBack={() => setSelectedArticle(null)}
      />
    );
  }

  // Wait for both mount (localStorage) and loading (subscription) to complete
  // This prevents jarring state changes - everything appears at once
  const isReady = mounted && !loading;

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
        />

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_ARTICLES.map((article) => {
            const { viewed, locked } = getArticleState(article.id);

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
