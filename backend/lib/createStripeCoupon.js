import { stripe } from "./stripe.js";

export async function createStripeCoupon(discountPercentage) {
  const coupon = await stripe.coupons.create({
    percent_off: discountPercentage,
    duration: "once",
    active: true,
  });
  return coupon.id;
}
