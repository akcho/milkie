import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Gift } from "lucide-react";
import Link from "next/link";

interface ArticleListHeaderProps {
  isPremium: boolean;
  remaining: number;
  freeArticleLimit: number;
}

export function ArticleListHeader({ isPremium, remaining, freeArticleLimit }: ArticleListHeaderProps) {
  return (
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
            ? `${remaining} of ${freeArticleLimit} free articles remaining this month`
            : `You've used all ${freeArticleLimit} free articles this month`
          }
        </Badge>
      )}

      {isPremium && (
        <Badge className="text-sm py-2 px-4">
          ✨ Premium - Unlimited Access
        </Badge>
      )}
    </div>
  );
}
