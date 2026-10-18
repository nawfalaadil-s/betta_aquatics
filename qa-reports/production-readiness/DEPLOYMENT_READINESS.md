# DEPLOYMENT READINESS & INFRASTRUCTURE PROTOCOL
**Platform Targets:** Vercel, Netlify, Cloudflare Pages, Supabase PostgreSQL  
**Verification Status:** **100% READY FOR AUTOMATED CI/CD DEPLOYMENT**  

---

## 1. Hosting Provider Configuration

### Vercel Deployment (`vercel.json`)
The application includes a root `vercel.json` configured for single-page application (SPA) routing:

```json
{
  "framework": "vite",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

### Netlify & Cloudflare Pages (`public/_redirects`)
To support deep links (e.g. `/admin/login`, `/account/orders`, `/product/super-red-samurai-plakat`), `public/_redirects` provides fallback routing:

```text
/*    /index.html   200
```

---

## 2. Environment Variables Specification

The production application requires the following environment variables (modeled in `.env.example`):

| Variable Name | Environment | Required | Description |
|---|---|---|---|
| `VITE_SUPABASE_URL` | Production / Staging | YES | Live Supabase Project URL (`https://<project-id>.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | Production / Staging | YES | Supabase Public Anonymous Client Key |
| `VITE_STORE_NAME` | All | Optional | Store display name (Default: `Betta Aquatics`) |
| `VITE_DEFAULT_CURRENCY` | All | Optional | Currency symbol (Default: `INR`) |
| `VITE_CURRENCY_SYMBOL` | All | Optional | Currency prefix (Default: `₹`) |

> [!CAUTION]
> **Security Mandatory**: NEVER set or commit `SUPABASE_SERVICE_ROLE_KEY` into frontend environment files. The frontend client must solely use `VITE_SUPABASE_ANON_KEY`.

---

## 3. Database Migration Execution Sequence

When connecting a fresh Supabase PostgreSQL instance:
1. Navigate to Supabase Dashboard > SQL Editor.
2. Execute migration `supabase/migrations/20261015000000_initial_schema.sql` (Creates base tables, RLS policies, indexes).
3. Execute migration `supabase/migrations/20261017000000_cms_and_blog_upgrade.sql` (Creates `blog_posts`, `media_assets`, `cms_page_revisions`).
4. Execute migration `supabase/migrations/20261017100000_production_security_hardening.sql` (Installs `trg_prevent_self_admin_elevation`, atomic stock functions, and audit triggers).

---

## 4. Pre-Deployment Verification Checklist

- [x] TypeScript compiler passes cleanly (`tsc -b` -> exit code 0).
- [x] Vite builds production bundle (`vite build` -> exit code 0).
- [x] Linter reports zero critical errors (`oxlint` -> 0 errors).
- [x] Client role switcher removed completely from production markup.
- [x] Admin route protection tested and verified (`AdminRoute.tsx` 403 guard).
- [x] Customer order data isolation verified across test accounts.
- [x] 1-of-1 live fish specimen inventory decrement verified.
- [x] SPA redirects file (`public/_redirects`) present in build root.
