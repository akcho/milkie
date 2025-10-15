"use client";

import { useState, useEffect } from "react";
import { usePaywall } from "@/lib/milkie";
import { toast } from "sonner";
import {
  getArticleViewCount,
  getRemainingArticles,
  hasReachedLimit,
  recordArticleView,
  FREE_ARTICLE_LIMIT,
  hasViewedArticle
} from "@/lib/metered-access";
import { ArticleCard } from "./components/ArticleCard";
import { ArticleView } from "./components/ArticleView";
import { ArticleListHeader } from "./components/ArticleListHeader";

// Sample articles for demo
const SAMPLE_ARTICLES = [
  {
    id: "article-1",
    title: "Getting Started with Next.js Paywalls",
    excerpt: "Learn how to implement flexible paywall patterns in your Next.js application with minimal setup.",
    author: "Sarah Chen",
    readTime: "5 min read",
    date: "Oct 15, 2025"
  },
  {
    id: "article-2",
    title: "Monetization Strategies for SaaS",
    excerpt: "Explore different pricing models and how metered paywalls can increase conversion rates.",
    author: "Michael Rodriguez",
    readTime: "7 min read",
    date: "Oct 14, 2025"
  },
  {
    id: "article-3",
    title: "Building Trust with Transparent Pricing",
    excerpt: "Why showing users exactly what they get before they pay leads to better retention.",
    author: "Emma Thompson",
    readTime: "4 min read",
    date: "Oct 13, 2025"
  },
  {
    id: "article-4",
    title: "Advanced Stripe Integration Patterns",
    excerpt: "Deep dive into webhook handling, subscription management, and edge cases.",
    author: "David Kim",
    readTime: "10 min read",
    date: "Oct 12, 2025"
  },
  {
    id: "article-5",
    title: "Optimizing Paywall Conversion Rates",
    excerpt: "Data-driven approaches to improving your paywall performance and reducing churn.",
    author: "Lisa Anderson",
    readTime: "6 min read",
    date: "Oct 11, 2025"
  },
  {
    id: "article-6",
    title: "The Future of Content Monetization",
    excerpt: "Emerging trends in digital subscriptions and what they mean for creators.",
    author: "James Wilson",
    readTime: "8 min read",
    date: "Oct 10, 2025"
  }
];

export default function MeteredPage() {
  const { hasAccess: isPremium } = usePaywall();
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [remaining, setRemaining] = useState(FREE_ARTICLE_LIMIT);

  // Update counts on mount and when returning to list
  useEffect(() => {
    setViewCount(getArticleViewCount());
    setRemaining(getRemainingArticles());
  }, [selectedArticle]);

  const handleArticleClick = (articleId: string) => {
    const alreadyViewed = hasViewedArticle(articleId);
    const reachedLimit = hasReachedLimit();

    // Prevent opening locked articles
    if (!isPremium && !alreadyViewed && reachedLimit) {
      toast.error("You've reached your free article limit", {
        description: "Subscribe to continue reading unlimited articles"
      });
      return;
    }

    // Record the view (only increments if new)
    if (!alreadyViewed) {
      recordArticleView(articleId);
      setViewCount(getArticleViewCount());
      setRemaining(getRemainingArticles());
    }

    setSelectedArticle(articleId);
  };

  const article = SAMPLE_ARTICLES.find(a => a.id === selectedArticle);

  // Show article view
  if (selectedArticle && article) {
    const hasViewed = hasViewedArticle(selectedArticle);
    const canView = isPremium || hasViewed || !hasReachedLimit();

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
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <ArticleListHeader
          isPremium={isPremium}
          remaining={remaining}
          freeArticleLimit={FREE_ARTICLE_LIMIT}
        />

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_ARTICLES.map((article) => {
            const viewed = hasViewedArticle(article.id);
            const locked = !isPremium && !viewed && hasReachedLimit();

            return (
              <ArticleCard
                key={article.id}
                article={article}
                viewed={viewed}
                locked={locked}
                isPremium={isPremium}
                onClick={() => !locked && handleArticleClick(article.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
