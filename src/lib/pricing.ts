import { COUPONS, ECO_FEE, VAT_RATE, getService } from "./catalog";

export type CartItem = { serviceId: string; addons: string[]; qty: number };

export function lineTotal(item: CartItem): number {
  const s = getService(item.serviceId);
  if (!s) return 0;
  const extras = (s.addons ?? []).filter((a) => item.addons.includes(a.id)).reduce((t, a) => t + a.price, 0);
  return (s.price + extras) * item.qty;
}

/** All prices include VAT (23%). Coupon applies to services subtotal; eco fee added once. */
export function computeTotals(items: CartItem[], coupon: string | null, extraFee = 0) {
  const subtotal = items.reduce((t, i) => t + lineTotal(i), 0);
  const rate = coupon ? (COUPONS[coupon.toUpperCase()] ?? 0) : 0;
  const discount = Math.round(subtotal * rate * 100) / 100;
  const eco = items.length ? ECO_FEE : 0;
  const total = Math.round((subtotal - discount + eco + extraFee) * 100) / 100;
  const vat = Math.round(((total * VAT_RATE) / (1 + VAT_RATE)) * 100) / 100;
  const hours = items.reduce((t, i) => t + (getService(i.serviceId)?.hours ?? 0) * i.qty, 0);
  return { subtotal, discount, eco, extraFee, total, vat, hours, couponValid: rate > 0 };
}
