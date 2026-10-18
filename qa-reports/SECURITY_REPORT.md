# Security Report

## Confirmed and fixed

1. Mock-mode admin console lacked route-level authorization.
2. Order detail route allowed viewing another customer's order by ID.
3. Courier tracking URLs were not restricted to safe HTTP(S) schemes.

## Unverified / environment-dependent

- Supabase RLS could not be tested because Supabase is not configured.
- Payment receipt storage exposure could not be tested without Supabase Storage.
- Inventory concurrency and transactional safety could not be verified in mock mode.

## Notes

- Mock role switching is presentation/state only and must not be treated as production authentication.
- Store settings are publicly readable by design in the schema.
