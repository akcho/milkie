import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    excerpt: string;
    author: string;
    readTime: string;
  };
  viewed: boolean;
  locked: boolean;
  isPremium: boolean;
  onClick: () => void;
}

export function ArticleCard({ article, viewed, locked, isPremium, onClick }: ArticleCardProps) {
  return (
    <Card
      className={`transition-all ${
        locked ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg cursor-pointer'
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
