import Stripe from "stripe";
import config from "../utils/config.js";
const stripe = new Stripe(config.STRIPE_KEY);
export const createSession = async (req, res) => {
  const total = req.params.total;
  const cid = req.params.cid;
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          product_data: { name: "TOTAL" },
          currency: "BRL",
          unit_amount: Number(total * 100),
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `https://backendcomision51225-production.up.railway.app/api/cart/${cid}/${total}/ticket`,
    cancel_url: `https://backendcomision51225-production.up.railway.app/api/cart/${cid}/purchase`,
  });
  return res.redirect(session.url);
};
