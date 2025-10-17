export interface Article {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  readTime: string;
  date: string;
}

export interface ArticleCardProps {
  article: Article;
  viewed: boolean;
  locked: boolean;
  isPremium: boolean;
  onClick: () => void;
}

export interface ArticleListHeaderProps {
  isPremium: boolean;
  remaining: number;
  freeArticleLimit: number;
  loading?: boolean;
}

export interface ArticleViewProps {
  article: Article;
  canView: boolean;
  onBack: () => void;
}
