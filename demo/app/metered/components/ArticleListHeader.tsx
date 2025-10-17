import { Badge } from "@/components/ui/badge";
import { Gift } from "lucide-react";
import { ArticleListHeaderProps } from "../types";

export function ArticleListHeader({ isPremium, remaining, freeArticleLimit, loading }: ArticleListHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h1 className="text-4xl font-bold mb-2">Premium Articles</h1>
          <p className="text-muted-foreground">
            Browse our collection of in-depth guides and tutorials
          </p>
        </div>
      </div>

      {/* Metered access counter */}
      {loading ? (
        // Placeholder badge during loading to prevent layout shift
        <Badge variant="secondary" className="text-sm py-2 px-4 hover:bg-secondary cursor-default opacity-50">
          <Gift className="h-4 w-4 mr-2" />
          Loading...
        </Badge>
      ) : (
        <>
          {!isPremium && (
            <Badge variant="secondary" className="text-sm py-2 px-4 hover:bg-secondary cursor-default">
              <Gift className="h-4 w-4 mr-2" />
              {remaining > 0
                ? `${remaining} of ${freeArticleLimit} free articles remaining this month`
                : `You've used all ${freeArticleLimit} free articles this month`
              }
            </Badge>
          )}

          {isPremium && (
            <Badge className="text-sm py-2 px-4 hover:bg-primary cursor-default">
              ✨ Premium - Unlimited Access
            </Badge>
          )}
        </>
      )}
    </div>
  );
}
