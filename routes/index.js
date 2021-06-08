const express = require('express');
const router = express.Router();
require('dotenv').config()
const Contact = require('../models/ContactModel')
const Section = require('../models/sectionModel')

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

module.exports = router;
