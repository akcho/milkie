"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PaywallGate } from "@milkie/react";
import { ArrowLeft, Clock, User, Gift } from "lucide-react";
import Link from "next/link";
import {
  getArticleViewCount,
  getRemainingArticles,
  hasReachedLimit,
  recordArticleView,
  FREE_ARTICLE_LIMIT,
  hasViewedArticle
} from "@/lib/metered-access";

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
  const { data: session } = useSession();
  const [selectedArticle, setSelectedArticle] = useState<string | null>(null);
  const [viewCount, setViewCount] = useState(0);
  const [remaining, setRemaining] = useState(FREE_ARTICLE_LIMIT);

  // Update counts on mount and when returning to list
  useEffect(() => {
    setViewCount(getArticleViewCount());
    setRemaining(getRemainingArticles());
  }, [selectedArticle]);

  const handleArticleClick = (articleId: string) => {
    // Check if user already viewed this article
    const alreadyViewed = hasViewedArticle(articleId);

    // Record the view (only increments if new)
    if (!alreadyViewed) {
      recordArticleView(articleId);
      setViewCount(getArticleViewCount());
      setRemaining(getRemainingArticles());
    }

    setSelectedArticle(articleId);
  };

  const handleBackToList = () => {
    setSelectedArticle(null);
  };

  const article = SAMPLE_ARTICLES.find(a => a.id === selectedArticle);

  // Show article view
  if (selectedArticle && article) {
    const isPremium = session?.user?.subscriptionStatus === "active";
    const hasViewed = hasViewedArticle(selectedArticle);
    const canView = isPremium || hasViewed || !hasReachedLimit();

    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <Button
            variant="ghost"
            onClick={handleBackToList}
            className="mb-6"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Articles
          </Button>

          <article>
            <header className="mb-8">
              <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {article.author}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {article.readTime}
                </div>
                <span>{article.date}</span>
              </div>
            </header>

            {canView ? (
              <div className="prose prose-gray max-w-none">
                <p className="lead text-lg text-muted-foreground mb-6">
                  {article.excerpt}
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                  incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                  exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <h2>Key Takeaways</h2>
                <ul>
                  <li>Understanding the fundamentals is crucial for success</li>
                  <li>Implementation details matter more than you think</li>
                  <li>Testing and iteration lead to better outcomes</li>
                </ul>
                <p>
                  Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque
                  laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi
                  architecto beatae vitae dicta sunt explicabo.
                </p>
              </div>
            ) : (
              <div className="relative">
                {/* Preview content */}
                <div className="prose prose-gray max-w-none mb-8">
                  <p className="lead text-lg text-muted-foreground mb-6">
                    {article.excerpt}
                  </p>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                    incididunt ut labore et dolore magna aliqua...
                  </p>
                </div>

                {/* Paywall overlay */}
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background h-32 -mt-32" />
                  <PaywallGate requireSubscription={true}>
                    <div className="prose prose-gray max-w-none blur-sm select-none pointer-events-none">
                      <p>
                        [Premium content hidden - Subscribe to continue reading...]
                      </p>
                    </div>
                  </PaywallGate>
                </div>
              </div>
            )}
          </article>
        </div>
      </div>
    );
  }

  // Show article list
  const isPremium = session?.user?.subscriptionStatus === "active";

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-6">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">Premium Articles</h1>
              <p className="text-muted-foreground">
                Browse our collection of in-depth guides and tutorials
              </p>
            </div>
          </div>

          {/* Metered access counter */}
          {!isPremium && (
            <Badge variant="secondary" className="text-sm py-2 px-4">
              <Gift className="h-4 w-4 mr-2" />
              {remaining > 0
                ? `${remaining} of ${FREE_ARTICLE_LIMIT} free articles remaining this month`
                : `You've used all ${FREE_ARTICLE_LIMIT} free articles this month`
              }
            </Badge>
          )}

          {isPremium && (
            <Badge className="text-sm py-2 px-4">
              ✨ Premium - Unlimited Access
            </Badge>
          )}
        </div>

        {/* Article Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SAMPLE_ARTICLES.map((article) => {
            const viewed = hasViewedArticle(article.id);
            const locked = !isPremium && !viewed && hasReachedLimit();

            return (
              <Card
                key={article.id}
                className={`hover:shadow-lg transition-all cursor-pointer ${
                  locked ? 'opacity-60' : ''
                }`}
                onClick={() => handleArticleClick(article.id)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <CardTitle className="text-lg leading-tight">
                      {article.title}
                    </CardTitle>
                    {viewed && !isPremium && (
                      <Badge variant="outline" className="text-xs shrink-0 ml-2">
                        Read
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {article.excerpt}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{article.author}</span>
                    <span>{article.readTime}</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
