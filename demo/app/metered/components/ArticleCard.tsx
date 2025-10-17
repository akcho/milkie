import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArticleCardProps } from "../types";

export function ArticleCard({ article, viewed, locked, isPremium, onClick }: ArticleCardProps) {
  return (
    <Card
      className={`transition-all hover:shadow-lg cursor-pointer ${
        locked ? 'opacity-75' : ''
      }`}
      onClick={onClick}
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
          {locked && (
            <Badge variant="secondary" className="text-xs shrink-0 ml-2">
              🔒 Locked
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
}
