require('dotenv').config()
const express = require('express');
const  request = require('request');
const router = express.Router();
const Payment = require('../models/PaymentModel')
const auth = {user: process.env.PAYPAL_CLIENT_ID , pass: process.env.PAYPAL_SECRET}

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY,{
    apiVersion: '2020-08-27',
    //Para debuguear, no se requiere en producción
    appInfo: {
        name: "stripe-samples/accept-a-payment/custom-payment-flow",
        version: "0.0.2",
        url: "https://github.com/stripe-samples"
    }
});

/**
 * GET Se obtiene la llave publica de negocio en Stripe
 * @ResponseBody llave publica
 */
router.get('/config', (req, res) => {
    res.send({
        publishableKey: process.env.STRIPE_PUBLIC_KEY});
});

/**
 * POST se crea un intento de pago
 * @RequestBody cantidad y divisa
 * @ResponseBody llave publica y client_secret
 */
router.post('/create-payment-intent', async (req, res) => {
    const { amount,currency } = req.body;

    const params = {
        payment_method_types: ['card'],
        amount: amount,
        currency: currency,
    }

    // Se crea el intento de pago con la cantidad, divisa y metodo de pago.
    try {
        const paymentIntent = await stripe.paymentIntents.create(params);

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

router.post('/paypal-create-payment', (req,res) =>{
    const { amount,currency } = req.body;

    const body = {
        intent: 'CAPTURE',
        purchase_units: [{
            amount: {
                currency_code: currency,
                value: amount
            }
        }],
        application_context:{
            brand_name: 'The boat',
            landing_page: 'NO_PREFERENCE',
            user_action: 'PAY_NOW',
            return_url: 'http://localhost:3000/payment/paypal-execute-payment',
            cancel_url: 'http://localhost:3000/sections'
        }
    }
    request.post(`${process.env.PAYPAL_SAND_API}/v2/checkout/orders`,{
        auth,
        body,
        json:true
    },(err,response) =>{
        res.send({token:response.body.id})
    })
});

router.get('/paypal-execute-payment', (req,res) =>{
    const token = req.query.token;
    request.post(`${process.env.PAYPAL_SAND_API}/v2/checkout/orders/${token}/capture`,{
        auth,
        body:{},
        json:true
    },(err,response) =>{
        res.render('payInfo')
    })
})
/*
router.get('/paypal-verify-payment', (req,res) =>{
    const token = req.query.token;
    request.get(`${process.env.PAYPAL_SAND_API}/v2/payments/captures/0VD198636J087022R`,{
        auth,
        json:true
    },(err,response) => {
        res.json({data: response.body})
    })
});

 */
/**
 * Implementa uso de webhhoks, si se requiere implementar
 */
/*
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
});*/

module.exports = router;
