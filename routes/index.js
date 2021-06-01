const express = require('express');
const router = express.Router();

//const Contact = require('../models/ContactModel')
const Section = require('../models/sectionModel')
const stripe = require('stripe')('sk_test_51IwvTRHKxDxRJvOZUJXVkIQT57I0Y0GhlKfCKxWwiCKxkjf7Vxof3p1HyISQuEOPYqG9q06cjbl0VvyMhRi7lJXS003SmALkTv');


/* GET Section Page */
router.get('/',async (req,res) => {
  const sections = await Section.find();
  res.render('index', {sections});
});
/* GET Pay Page */
router.get('/pay/:id', async (req, res) => {
  const section = await Section.findOne({_id: req.params.id});
  res.render('pay',{section})
});

router.get('/info', async (req, res) => {
  res.render('PayInfo',)
});

/* POST Save Contact */
router.post('/contact', async (req,res) => {
  const {name,price,dimension}  = req.body;
  const section = new  Section({name,price,dimension});
  console.log(section);
  await section.save();
  res.json("Insertado con exito");
});

router.post('/create-checkout-session', async (req, res) => {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'mxn',
          product_data: {
            name: 'Departamento',
            images: ['https://www.bienesonline.com/mexico/photos/preventa-de-departamentos-en-el-sur-de-cancun-residencial-lirios-DEV2599691585931923-930.jpg'],
          },
          unit_amount: 2000000,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: 'http://localhost:3000/sections/info',
    cancel_url: 'http://localhost:3000/sections',
  });
  res.json({ id: session.id });
});
module.exports = router;
