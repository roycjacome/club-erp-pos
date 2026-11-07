import Stripe from "stripe";
import { ENV } from "./env";

export const stripe = new Stripe(ENV.stripeSecret, {
  apiVersion: "2024-12-18.acacia" as any, 
});

export async function createStripeCheckoutSession({
  monto,
  concepto,
  socioId,
  reservacionId,
  torneoId,
}: {
  monto: number;
  concepto: string;
  socioId: number;
  reservacionId?: number;
  torneoId?: number;
}) {
  if (!ENV.stripeSecret) {
    throw new Error("Stripe secret key is not configured.");
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "mxn",
          product_data: {
            name: concepto,
          },
          unit_amount: Math.round(monto * 100), // Stripe uses cents
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${ENV.appUrl}/padel?status=success&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${ENV.appUrl}/padel?status=cancel`,
    metadata: {
      socioId: socioId.toString(),
      reservacionId: reservacionId?.toString() || "",
      torneoId: torneoId?.toString() || "",
      concepto,
    },
  });

  return session;
}
