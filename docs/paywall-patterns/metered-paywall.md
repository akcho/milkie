# Pattern 4: Metered Paywall

Provide limited free access per time period, then show paywall with blurred content preview.

## Perfect for:

- Content sites (blogs, news, magazines)
- Freemium content strategies
- Building engagement before conversion
- Gradual onboarding to paid features

## Implementation Overview

Metered paywalls track unique content views and show the paywall after a limit is reached. This pattern combines:

1. **Server-side view tracking** (in your database)
2. **PaywallGate component** (for the UI)
3. **Content preview** (blurred background effect)

```tsx
"use client";

import { PaywallGate, usePaywall } from "@milkie/react";

export default function MeteredContentPage({ article, userViewCount }) {
  const { hasAccess: isPremium } = usePaywall();
  const canView = isPremium || userViewCount < FREE_ARTICLE_LIMIT;

  if (!canView) {
    return (
      <div className="prose">
        {/* Show preview content */}
        <h1>{article.title}</h1>
        <p className="lead">{article.excerpt}</p>
        <p>{article.content.slice(0, 200)}...</p>

        {/* PaywallGate with blurred background */}
        <PaywallGate
          title="You've reached your free article limit"
          subtitle="Subscribe for unlimited access to all premium content"
          subscribeButtonText="Get unlimited access"
        >
          <div className="blur-sm">{article.content}</div>
        </PaywallGate>
      </div>
    );
  }

  // User has access - show full article
  return <ArticleView article={article} />;
}
```

## Server-Side View Tracking

**Recommended approach:** Track views in your database for security and accuracy.

### Database Schema

Add a table to track article views:

```sql
CREATE TABLE article_views (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(255) NOT NULL,        -- User email or ID
  article_id VARCHAR(255) NOT NULL,
  viewed_at TIMESTAMP DEFAULT NOW(),
  view_month VARCHAR(7) NOT NULL,       -- "2025-10" for monthly reset
  UNIQUE(user_id, article_id, view_month)
);

CREATE INDEX idx_article_views_user_month ON article_views(user_id, view_month);
```

### Server Actions

```tsx
// app/actions/track-view.ts
"use server";

import { auth } from "@/auth";
import { db } from "@/lib/db";

export async function trackArticleView(articleId: string) {
  const session = await auth();
  if (!session?.user?.email) return { success: false };

  const viewMonth = new Date().toISOString().slice(0, 7); // "2025-10"

  try {
    // Insert view (ON CONFLICT DO NOTHING prevents duplicate views)
    await db.query(`
      INSERT INTO article_views (user_id, article_id, view_month)
      VALUES ($1, $2, $3)
      ON CONFLICT (user_id, article_id, view_month) DO NOTHING
    `, [session.user.email, articleId, viewMonth]);

    return { success: true };
  } catch (error) {
    console.error("Failed to track view:", error);
    return { success: false };
  }
}

export async function getUserViewCount() {
  const session = await auth();
  if (!session?.user?.email) return 0;

  const viewMonth = new Date().toISOString().slice(0, 7);

  const result = await db.query(`
    SELECT COUNT(DISTINCT article_id) as view_count
    FROM article_views
    WHERE user_id = $1 AND view_month = $2
  `, [session.user.email, viewMonth]);

  return result.rows[0]?.view_count || 0;
}
```

### Client Component

```tsx
"use client";

import { useEffect } from "react";
import { trackArticleView } from "@/app/actions/track-view";

export function ArticleWithTracking({ article, viewCount }) {
  const { hasAccess } = usePaywall();

  useEffect(() => {
    // Track view on mount (only for non-premium users)
    if (!hasAccess && viewCount < FREE_ARTICLE_LIMIT) {
      trackArticleView(article.id);
    }
  }, [article.id, hasAccess, viewCount]);

  // ... rest of component
}
```

## Key Features

- **Server-side tracking** - Secure, can't be bypassed by clearing localStorage
- **Unique article tracking** - Same article doesn't count twice
- **Monthly reset** - Fresh limit each month via `view_month` column
- **Premium bypass** - Premium users skip metering entirely
- **Cross-device sync** - Works across all user's devices

## UX Benefits

### Less Restrictive Than Hard Blocks

Users experience value before hitting the paywall, which:
- Builds desire and engagement
- Feels like an invitation, not a barrier
- Provides context for subscription decision
- Industry-proven (Medium, NYT, WSJ)

### Visual Preview Creates Context

The blurred content preview:
- Shows what they're missing
- Maintains reading context
- Creates urgency without frustration
- Professional, polished appearance

## Usage Counter Component

Display remaining articles to users:

```tsx
function ArticleListHeader({ viewCount }: { viewCount: number }) {
  const remaining = FREE_ARTICLE_LIMIT - viewCount;

  return (
    <div className="flex justify-between items-center mb-6">
      <h1>Premium Articles</h1>
      <div className="text-sm text-muted-foreground">
        {remaining > 0 ? (
          <span>{remaining} free articles remaining this month</span>
        ) : (
          <span>Free article limit reached</span>
        )}
      </div>
    </div>
  );
}
```

## Alternative: IP-Based Tracking

For anonymous users (no auth), track by IP address:

```tsx
// app/actions/track-view.ts
import { headers } from "next/headers";

export async function trackArticleView(articleId: string) {
  const headersList = headers();
  const ip = headersList.get("x-forwarded-for") || "unknown";

  // Track by IP instead of user_id
  // Note: Less accurate (shared IPs, VPNs), but works without auth
}
```

## Production Considerations

1. **Rate limiting** - Prevent abuse by limiting requests per IP/user
2. **Analytics** - Track which articles drive conversions
3. **A/B testing** - Test different limits (3 vs 5 articles)
4. **Grace period** - Allow 1-2 articles after limit with softer messaging
5. **Email capture** - Offer extended trial for email signup

## Live Demo

Try this pattern at [milkie.dev/metered](https://milkie.dev/metered)

**Note:** The demo uses localStorage for simplicity, but production apps should use server-side tracking.

## Related Patterns

- [Component-Level Gating](component-gating.md) - Foundation for this pattern
- [Hook-Based Access](hook-based-access.md) - Custom access logic

## Next Steps

- Review [customization options](../reference/customization.md) for paywall messaging
- See [best practices](../reference/best-practices.md) for UX tips
- Set up [backend tracking](../BACKEND_SETUP.md) for production use
