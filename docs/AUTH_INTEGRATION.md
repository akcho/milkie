# Authentication Integration

Milkie is **auth-agnostic** - it works with any authentication solution. You just need to provide an authenticated user's email address.

## Two Usage Modes

### 1. With Authentication (Recommended)
If your app already has user authentication, pass the email to Milkie:

```tsx
<MilkieProvider email={authenticatedUserEmail}>
  <App />
</MilkieProvider>
```

The paywall will show "Logged in as [email]" instead of an email input form.

### 2. Without Authentication
If you don't have auth, Milkie will ask users for their email:

```tsx
<MilkieProvider>
  <App />
</MilkieProvider>
```

The paywall will show an email input form. **Note:** This is less secure as emails aren't verified.

---

## Integration Examples

### With NextAuth

```tsx
import { useSession } from 'next-auth/react';
import { MilkieProvider } from '@/lib/milkie';

export default function App({ Component, pageProps }) {
  const { data: session } = useSession();

  return (
    <MilkieProvider email={session?.user?.email}>
      <Component {...pageProps} />
    </MilkieProvider>
  );
}
```

### With Clerk

```tsx
import { useUser } from '@clerk/nextjs';
import { MilkieProvider } from '@/lib/milkie';

export default function App({ children }) {
  const { user } = useUser();

  return (
    <MilkieProvider email={user?.primaryEmailAddress?.emailAddress}>
      {children}
    </MilkieProvider>
  );
}
```

### With Lucia Auth

```tsx
import { useAuth } from '@/lib/auth';
import { MilkieProvider } from '@/lib/milkie';

export default function App({ children }) {
  const { user } = useAuth();

  return (
    <MilkieProvider email={user?.email}>
      {children}
    </MilkieProvider>
  );
}
```

### With Supabase Auth

```tsx
import { useSupabaseUser } from '@/lib/supabase';
import { MilkieProvider } from '@/lib/milkie';

export default function App({ children }) {
  const user = useSupabaseUser();

  return (
    <MilkieProvider email={user?.email}>
      {children}
    </MilkieProvider>
  );
}
```

### With Better Auth

```tsx
import { useSession } from 'better-auth/react';
import { MilkieProvider } from '@/lib/milkie';

export default function App({ children }) {
  const { data: session } = useSession();

  return (
    <MilkieProvider email={session?.user?.email}>
      {children}
    </MilkieProvider>
  );
}
```

### With Custom Auth

As long as you can get the user's authenticated email, it works:

```tsx
<MilkieProvider email={yourAuthSolution.getUserEmail()}>
  <App />
</MilkieProvider>
```

---

## Security Considerations

### With Authentication (Secure ✅)
When you pass an email from your auth system, Milkie trusts that the email is verified and authenticated. The paywall flow is:

1. User is authenticated via your auth solution
2. You pass verified email to Milkie
3. Milkie checks if email has active Stripe subscription
4. If not, shows checkout (already knows their email)
5. After payment, user gains access

This is secure because the email comes from your verified auth session.

### Without Authentication (Less Secure ⚠️)
When no email is provided, Milkie asks users to enter their email. This is convenient but less secure:

1. User enters email manually
2. Milkie checks if email has subscription
3. No verification that they own the email

**Risk:** Someone could enter another person's email to gain access.

**When to use:**
- Low-stakes content
- MVP/prototypes
- When you trust your users
- When you don't need user accounts

**Better alternatives for production:**
- Add magic link email verification
- Integrate proper authentication
- Use license keys instead of emails

---

## FAQ

**Q: Can I use Milkie without any authentication?**
A: Yes, but users will need to enter their email. This works for simple use cases but isn't fully secure.

**Q: Does Milkie replace my auth solution?**
A: No. Milkie only handles subscription/payment gating. You still need your own authentication for user accounts.

**Q: What if my auth doesn't use email?**
A: Currently Milkie requires an email to link to Stripe customers. Support for other identifiers (user IDs, etc.) may come later.

**Q: Can I customize the paywall UI?**
A: Yes! Use the `fallback` prop on `<PaywallGate>` to provide your own upgrade prompt.

**Q: Does the email need to be verified?**
A: Milkie doesn't verify emails - that's your auth solution's job. When you pass an email from NextAuth/Clerk/etc., it's assumed to be verified.
