const express = require('express');
const router = express.Router();
const https = require('https')
require('dotenv').config()
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

router.get('/get/info/', async (req,res)=> {
    const data = JSON.stringify({
        real_estate_development_code: process.env.BUILDING_CODE
    })
    let res_data=''
    const options = {
        hostname: 'dev.api.capital28.investments',
        path: '/api/realEstateDevelopment/detail',
        method: 'POST',
        headers: {
            'Authorization': process.env.BEARER_TOKEN,
            'Content-Type': 'application/json'
        }
    }
    const request= https.request(options, r => {

        r.on('data', response => {
            res_data +=response
        })

        r.on('end', ()=> {
            res_data = JSON.parse(res_data);
            res.send(res_data);
            console.log(res_data.Data.RealEstateDevelopment.development_structure.floors)
        });

    })

    request.on('error', error => {
        console.error(error)
    })

    request.write(data,() => {
        console.log('data saved')
    })

    request.end()
});

/* POST Save Contact
router.post('/payment', async (req,res) => {
  const {name,price,dimension}  = req.body;
  const section = new  Section({name,price,dimension});
  console.log(section);
  await section.save();
  res.json("Insertado con exito");
});

 */

module.exports = router;
