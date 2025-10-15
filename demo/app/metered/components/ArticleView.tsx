import { Button } from "@/components/ui/button";
import { PaywallGate } from "@milkie/react";
import { ArrowLeft, Clock, User } from "lucide-react";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  date: string;
}

interface ArticleViewProps {
  article: Article;
  canView: boolean;
  onBack: () => void;
}

const ARTICLE_CONTENT = (
  <>
    <p>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
      tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
      commodo consequat.
    </p>
    <p>
      Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
      proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
    <h2>Key Takeaways</h2>
    <ul>
      <li>Understanding the fundamentals is crucial for success</li>
      <li>Implementation details matter more than you think</li>
      <li>Testing and iteration lead to better outcomes</li>
    </ul>
    <p>
      Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
      doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo
      inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.
    </p>
  </>
);

const PREVIEW_CONTENT = (
  <p>
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod
    tempor incididunt ut labore et dolore magna aliqua...
  </p>
);

export function ArticleView({ article, canView, onBack }: ArticleViewProps) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Button variant="ghost" onClick={onBack} className="mb-6">
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
              {ARTICLE_CONTENT}
            </div>
          ) : (
            <div className="prose prose-gray max-w-none">
              <p className="lead text-lg text-muted-foreground mb-6">
                {article.excerpt}
              </p>
              {PREVIEW_CONTENT}

              {/* Paywall gate positioned after preview */}
              <div className="relative -mx-4 my-8">
                <PaywallGate
                  title="You've reached your free article limit"
                  subtitle="Subscribe for unlimited access to all premium content"
                  subscribeButtonText="Get unlimited access"
                >
                  <div className="px-4">{ARTICLE_CONTENT}</div>
                </PaywallGate>
              </div>
            </div>
          )}
        </article>
      </div>
    </div>
  );
}
