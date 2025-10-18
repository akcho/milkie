import { Button } from "@/components/ui/button";
import { PaywallGate } from "@milkie/react";
import { ArrowLeft, Clock, User } from "lucide-react";
import { Header } from "@/components/site-header/header";
import { ArticleViewProps } from "../types";
import { ArticleContent, PreviewContent } from "./article-content";

export function ArticleView({ article, canView, onBack }: ArticleViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={onBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to articles
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
              <ArticleContent />
            </div>
          ) : (
            <div className="prose prose-gray max-w-none">
              <p className="lead text-lg text-muted-foreground mb-6">
                {article.excerpt}
              </p>
              <PreviewContent />
              <PaywallGate
                title="You've reached your free article limit"
                subtitle="Subscribe for unlimited access to all premium content"
                subscribeButtonText="Get unlimited access"
                overlayClassName="pt-8"
              >
                <ArticleContent />
              </PaywallGate>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
