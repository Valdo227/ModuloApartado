require('dotenv').config()
const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    apiVersion: '2020-08-27',
    appInfo: { // For sample support and debugging, not required for production:
        name: "stripe-samples/accept-a-payment/custom-payment-flow",
        version: "0.0.2",
        url: "https://github.com/stripe-samples"
    }
});


router.get('/config', (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_SECRET_KEY});
});

router.post('/create-payment-intent', async (req, res) => {
    const { amount } = req.body;

    const params = {
        payment_method_types: ['card'],
        amount: amount,
        currency: 'mxn',
    }

    // Create a PaymentIntent with the amount, currency, and a payment method type.
    try {
        const paymentIntent = await stripe.paymentIntents.create(params);

        // Send publishable key and PaymentIntent details to client
        res.send({
            clientSecret: paymentIntent.client_secret
        });

    } catch(e) {
        return res.status(400).send({
            error: {
                message: e.message
            }
        });
    }
});

router.post('/webhook', async (req, res) => {
    let data, eventType;

    // Check if webhook signing is configured.
    if (process.env.STRIPE_WEBHOOK_SECRET) {
        // Retrieve the event by verifying the signature using the raw body and secret.
        let event;
        let signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                req.rawBody,
                signature,
                process.env.STRIPE_WEBHOOK_SECRET
            );
        } catch (err) {
            console.log(`⚠️  Webhook signature verification failed.`);
            return res.sendStatus(400);
        }
        data = event.data;
        eventType = event.type;
    } else {
        // Webhook signing is recommended, but if the secret is not configured in `config.js`,
        // we can retrieve the event data directly from the request body.
        data = req.body.data;
        eventType = req.body.type;
    }

    if (eventType === 'payment_intent.succeeded') {
        // Funds have been captured
        // Fulfill any orders, e-mail receipts, etc
        // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
        console.log('💰 Payment captured!');
    } else if (eventType === 'payment_intent.payment_failed') {
        console.log('❌ Payment failed.');
    }
    res.sendStatus(200);
});

router.get("/stripe-key", (req, res) => {
    res.send({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY });
});

module.exports = router;
