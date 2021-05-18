const express = require('express');
const router = express.Router();
const Contact = require('../models/ContactModel')
/* GET home page. */
router.get('/',async (req,res) => {
  const contacts = await Contact.find();
  console.log(contacts);
  res.render('index', { contacts});
});

router.post('/', async (req,res) => {
  const {name,lastname,phone,email}  = req.body;
  const contact = new  Contact({name,lastname,phone,email});
  console.log(contact);
  await contact.save();
  res.json("recibido")
});

module.exports = router;
