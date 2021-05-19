const express = require('express');
const router = express.Router();
//const Contact = require('../models/ContactModel')
const Section = require('../models/sectionModel')
/* GET home page. */
router.get('/',async (req,res) => {
  const sections = await Section.find();
  console.log(sections);
  res.render('index', { sections});
});

router.post('/', async (req,res) => {
  const {name,price,dimension}  = req.body;
  const section = new  section({name,price,dimension});
  console.log(section);
  await section.save();
  res.json("Insertado con exito")
});

module.exports = router;
