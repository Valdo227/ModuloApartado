const express = require('express');
const router = express.Router();
//const Contact = require('../models/ContactModel')
const Section = require('../models/sectionModel')

/* GET Section Page */
router.get('/',async (req,res) => {
  const sections = await Section.find();
  console.log(sections);
  res.render('index', { sections});
});
/* GET info */
router.get('/pay/:id', async (req, res) => {
  const section = await Section.find({_id: req.params.id});
  console.log("Sección:");
  console.log(req.params.section);
  res.render('pay',{section})
});

router.post('/contact', async (req,res) => {
  const {name,price,dimension}  = req.body;
  const section = new  Section({name,price,dimension});
  console.log(section);
  await section.save();
  res.json("Insertado con exito");
});

module.exports = router;
