# Pattern 7: Custom Checkout Handler

Override the default checkout behavior with your own logic.

## Perfect for:

- Adding custom metadata to checkout sessions
- UTM tracking and marketing attribution
- Custom return URLs
- Special checkout flows

## Implementation

```tsx
"use client";

import { PaywallGate } from "@milkie/react";

export default function CustomCheckoutPage() {
  const handleCustomCheckout = async (email: string) => {
    // Your custom checkout logic
    const response = await fetch("/api/custom-checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        // Add any custom data you need
        source: "landing_page",
        utmCampaign: new URLSearchParams(window.location.search).get(
          "utm_campaign"
        ),
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    const data = await response.json();

    // Must return an object with a 'url' property
    return { url: data.checkoutUrl };
  };

  return (
    <PaywallGate onCheckout={handleCustomCheckout}>
      <PremiumContent />
    </PaywallGate>
  );
}
```

## Custom Checkout Handler Requirements

Your `onCheckout` function must:

1. **Accept** `email: string` parameter
2. **Return** a Promise that resolves to `{ url: string }`
3. **Throw** errors for built-in error handling to catch
4. **Redirect** user to Stripe Checkout via the URL

## Use Cases

### 1. Add UTM Tracking

Track marketing attribution in checkout sessions:

```tsx
const handleCheckout = async (email: string) => {
  const searchParams = new URLSearchParams(window.location.search);

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      metadata: {
        utm_source: searchParams.get("utm_source"),
        utm_medium: searchParams.get("utm_medium"),
        utm_campaign: searchParams.get("utm_campaign"),
      },
    }),
  });

  const data = await response.json();
  return { url: data.checkoutUrl };
};
```

### 2. Promo Codes

Apply discount codes automatically:

```tsx
const handleCheckout = async (email: string) => {
  const promoCode = localStorage.getItem("promo_code");

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      promoCode,
      allowPromoCodes: true,
    }),
  });

  const data = await response.json();
  return { url: data.checkoutUrl };
};
```

### 3. Custom Return URLs

Redirect users to specific pages after checkout:

```tsx
const handleCheckout = async (email: string) => {
  const callbackUrl = window.location.pathname; // Current page

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      successUrl: `${window.location.origin}${callbackUrl}?success=true`,
      cancelUrl: `${window.location.origin}${callbackUrl}?canceled=true`,
    }),
  });

  const data = await response.json();
  return { url: data.checkoutUrl };
};
```

### 4. Custom Metadata

Add any data you need to track in Stripe:

```tsx
const handleCheckout = async (email: string) => {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      metadata: {
        referrer: document.referrer,
        signup_source: "dashboard",
        user_agent: navigator.userAgent,
      },
    }),
  });

  const data = await response.json();
  return { url: data.checkoutUrl };
};
```

## Server-Side Example

Custom checkout API route with metadata:

```tsx
// app/api/custom-checkout/route.ts
import { NextRequest } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { email, metadata } = await request.json();

  try {
    // Create Stripe checkout session with custom metadata
    const session = await stripe.checkout.sessions.create({
      customer_email: email,
      mode: "subscription",
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing`,
      metadata: {
        ...metadata,
        // Stripe metadata is limited to 50 keys and 500 characters per value
      },
    });

    return Response.json({ checkoutUrl: session.url });
  } catch (error) {
    console.error("Checkout creation failed:", error);
    return Response.json(
      { error: "Failed to create checkout session" },
      { status: 500 }
    );
  }
}
```

## Error Handling

Custom checkout handlers benefit from PaywallGate's built-in error recovery:

```tsx
const handleCheckout = async (email: string) => {
  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    // Error will be caught and displayed by PaywallGate
    throw new Error("Unable to start checkout");
  }

  const data = await response.json();

  if (!data.checkoutUrl) {
    throw new Error("No checkout URL received");
  }

  return { url: data.checkoutUrl };
};

<PaywallGate
  onCheckout={handleCheckout}
  onToast={(message, type) => toast[type](message)}
>
  <PremiumContent />
</PaywallGate>;
```

## Best Practices

### 1. Validate Input

Always validate data before sending to checkout API:

```tsx
const handleCheckout = async (email: string) => {
  // Validate email format
  if (!email || !email.includes("@")) {
    throw new Error("Invalid email address");
  }

  // Proceed with checkout
  // ...
};
```

### 2. Use Idempotency Keys

Prevent duplicate checkout sessions:

```tsx
const handleCheckout = async (email: string) => {
  const idempotencyKey = `checkout-${email}-${Date.now()}`;

  const response = await fetch("/api/checkout", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify({ email }),
  });

  // ...
};
```

### 3. Respect Stripe Metadata Limits

Stripe has limits on metadata:

- Maximum 50 keys per object
- Maximum 500 characters per value
- Keys and values must be strings

```tsx
// ✅ Good - within limits
metadata: {
  utm_source: "google",
  campaign_id: "summer2024",
}

// ❌ Bad - value too long
metadata: {
  user_agent: navigator.userAgent, // Often > 500 chars
}
```

## TypeScript Types

For type safety in custom handlers:

```typescript
type CheckoutHandler = (email: string) => Promise<{ url: string }>;

const handleCheckout: CheckoutHandler = async (email) => {
  // Implementation
  return { url: checkoutUrl };
};
```

## Future Considerations

**Multiple pricing tiers:** Milkie currently supports single-tier subscriptions. Multi-tier support (basic/pro/enterprise) is on the roadmap but hasn't been tested. If you need tiers now, you can experiment with custom checkout handlers to pass different `priceId` values, but this is unverified.

## Related Patterns

- [Error Recovery](error-recovery.md) - Handle checkout errors gracefully
- [Hook-Based Access](hook-based-access.md) - Refresh subscription after checkout

## Next Steps

- Review [API reference](../reference/api-reference.md) for checkout route setup
- See [best practices](../reference/best-practices.md) for security tips
