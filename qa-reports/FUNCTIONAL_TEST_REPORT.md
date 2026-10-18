# Functional Test Report

## Customer Journey

1. Homepage search for `betta` -> PASS
2. Product detail opened -> PASS
3. Add to cart -> PASS
4. Coupon `AQUA10` applied -> PASS (discount 150)
5. Checkout with UTR `407519823412` and synthetic receipt -> PASS
6. Order `BA-2026-2568` created with pending verification -> PASS
7. Admin approved payment -> PASS
8. Admin dispatched via Bluedart AWB `BLUEDART-882947192` -> PASS
9. Customer order shows shipped and tracking link -> PASS

## Validation & Edge Cases

- Invalid product ID -> PASS (Graceful 404/not-found screen)
- PIN code checker present on PDP -> PASS (Validates 6-digit pin and returns delivery SLA)
- Coupon validation:
  - Valid active coupon (`AQUA10`) -> PASS (Applies percentage discount with max threshold)
  - Below minimum order value -> PASS (Rejects with informative error message)
  - Expired coupon (`EXPIRED50`) -> PASS (Verified via `cp-04` fixture in `INITIAL_COUPONS` and `validateCoupon` expiry check)
  - Non-existent coupon code -> PASS (Returns "Invalid or expired coupon code")
- Empty cart checkout safeguard -> PASS (Accessing `/checkout` with 0 items displays "No Items in Cart" notice with direct button back to `/shop`, preventing empty order generation)
- Multi-tab duplicate purchase concurrency -> BLOCKED (Requires live backend PostgreSQL/Supabase transactional locks)
