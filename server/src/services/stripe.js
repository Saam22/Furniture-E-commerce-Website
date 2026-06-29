import Stripe from 'stripe';
import env from '../config/env.js';

const stripe = env.stripeSecretKey ? new Stripe(env.stripeSecretKey) : null;

export async function createPaymentIntent(amount, currency = 'egp', metadata = {}) {
  if (!stripe) {
    console.warn('Stripe not configured. Returning mock payment intent.');
    return { id: `mock_${Date.now()}`, client_secret: `mock_secret_${Date.now()}` };
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: Math.round(amount * 100),
    currency: currency.toLowerCase(),
    metadata,
    automatic_payment_methods: { enabled: true },
  });

  return paymentIntent;
}

export async function confirmPayment(paymentIntentId) {
  if (!stripe) return { status: 'succeeded' };
  return stripe.paymentIntents.retrieve(paymentIntentId);
}

export async function createCheckoutSession(items, successUrl, cancelUrl) {
  if (!stripe) {
    console.warn('Stripe not configured. Returning mock session.');
    return { id: `mock_${Date.now()}`, url: successUrl };
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: items.map(item => ({
      price_data: {
        currency: 'egp',
        product_data: { name: item.name, images: item.image ? [item.image] : [] },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: item.quantity,
    })),
    mode: 'payment',
    success_url: successUrl,
    cancel_url: cancelUrl,
  });

  return session;
}
