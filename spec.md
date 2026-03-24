# RAW POWER

## Current State
Checkout is a 3-step modal: Step 1 = Shipping Info, Step 2 = Order Review + Place Order, Step 3 = Confirmation. No payment step exists.

## Requested Changes (Diff)

### Add
- Step 2: Dedicated Payment page with Stripe (card) and UPI/COD (simulated) options
- After payment, go directly to Step 3 (Order Confirmation)

### Modify
- Step 2 changes from Order Review to Payment
- Steps: 1 = Shipping, 2 = Payment, 3 = Confirmation

### Remove
- Old Order Review step

## Implementation Plan
1. Update CheckoutModal.tsx: Step 2 = Payment with order summary + Stripe + UPI/COD tabs
2. Integrate Stripe Caffeine component
3. Keep Step 3 confirmation as-is
