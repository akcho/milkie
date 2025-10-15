/**
 * Metered Paywall Utilities
 *
 * Implements Medium/NYT-style metered paywall:
 * - Tracks unique articles viewed per month
 * - Resets on calendar month boundary
 * - Uses localStorage for anonymous users
 */

export const FREE_ARTICLE_LIMIT = 3;

interface MeteredData {
  article_view_month: string;
  viewed_article_ids: string[];
}

function getCurrentMonth(): string {
  return new Date().toISOString().slice(0, 7); // "2025-10"
}

function getMeteredData(): MeteredData {
  if (typeof window === 'undefined') {
    return { article_view_month: getCurrentMonth(), viewed_article_ids: [] };
  }

  const month = localStorage.getItem('article_view_month');
  const viewedIds = localStorage.getItem('viewed_article_ids');
  const currentMonth = getCurrentMonth();

  // Reset if new month
  if (month !== currentMonth) {
    const newData: MeteredData = {
      article_view_month: currentMonth,
      viewed_article_ids: []
    };
    saveMeteredData(newData);
    return newData;
  }

  return {
    article_view_month: month || currentMonth,
    viewed_article_ids: viewedIds ? JSON.parse(viewedIds) : []
  };
}

function saveMeteredData(data: MeteredData): void {
  if (typeof window === 'undefined') return;

  localStorage.setItem('article_view_month', data.article_view_month);
  localStorage.setItem('viewed_article_ids', JSON.stringify(data.viewed_article_ids));
}

/**
 * Get the number of unique articles viewed this month
 */
export function getArticleViewCount(): number {
  const data = getMeteredData();
  return data.viewed_article_ids.length;
}

/**
 * Get remaining free articles
 */
export function getRemainingArticles(): number {
  return Math.max(0, FREE_ARTICLE_LIMIT - getArticleViewCount());
}

/**
 * Check if user has reached their free article limit
 */
export function hasReachedLimit(): boolean {
  return getArticleViewCount() >= FREE_ARTICLE_LIMIT;
}

/**
 * Check if a specific article has been viewed
 */
export function hasViewedArticle(articleId: string): boolean {
  const data = getMeteredData();
  return data.viewed_article_ids.includes(articleId);
}

/**
 * Record an article view (only increments if not already viewed)
 * Returns true if this was a new view, false if already viewed
 */
export function recordArticleView(articleId: string): boolean {
  const data = getMeteredData();

  // Already viewed this article
  if (data.viewed_article_ids.includes(articleId)) {
    return false;
  }

  // Add to viewed list
  data.viewed_article_ids.push(articleId);
  saveMeteredData(data);
  return true;
}

/**
 * Reset the counter (useful for testing)
 */
export function resetMeteredAccess(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('article_view_month');
  localStorage.removeItem('viewed_article_ids');
}
