import "dotenv/config";
import express from "express";
import Stripe from "stripe";
import cors from "cors";

const app = express();
const stripe = new Stripe(process.env.STRIPE_SECRET);

app.use(cors());
app.use(express.json());

app.post("/create-checkout-session", async (req, res) => {
    const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        line_items: [
            {
                price_data: {
                    currency: "usd",
                    product_data: { name: "Premium Plan" },
                    unit_amount: 999, // $9.99 in cents
                },
                quantity: 1,
            },
        ],
        success_url: `${process.env.CLIENT_URL}/success`,
        cancel_url: `${process.env.CLIENT_URL}/cancel`,
    });
    res.json({ url: session.url });
});

app.listen(3001, () => console.log("✅ Server running on port 3001"));