const express = require('express');
const router = express.Router();
const https = require('https')
require('dotenv').config()
const Payment = require('../models/PaymentModel')
/**
 * GET Página inicial
 * Se consume el API externo de Capital 28
 */
router.get('/',async (req,res) => {
    const data = JSON.stringify({
        real_estate_development_code: process.env.BUILDING_CODE
    })
    let res_data=''
    const options = {
        hostname: 'dev.api.capital28.investments',
        path: '/api/Property/list',
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
            if(res_data.Code === 200)
                res.render('index', {property: res_data.Data.Property});
        });

    })

    request.on('error', error => {
        console.error(error)
    })

    request.write(data)

    request.end()
});

/**
 * GET Página para el pago de la propiedad
 * Se consume el API externo de Capital 28
 */
router.get('/pay/:id', async (req, res) => {

    const data = JSON.stringify({
        real_estate_development_code: process.env.BUILDING_CODE
    })
    let res_data=''
    const options = {
        hostname: 'dev.api.capital28.investments',
        path: '/api/Property/list',
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
            if(res_data.Code === 200) {
                res_data.Data.Property.forEach(con => {
                    if (con._id === req.params.id) {
                        console.log(con);
                        res.render('pay', {property: con});
                    }
                });

            }
        });

    })

    request.on('error', error => {
        console.error(error)
    })

    request.write(data)

    request.end()
});

/**
 * GET Pagina de información despues del pago éxitoso.
 */

router.get('/payinfo', async (req, res) => {
    res.render('payInfo')
});
/**
 *  POST Guarda la información del pago
 *  @RequestBody nombre,correo y telefono del cliente; id de la propiedad y el inmueble
 *  @ResponseBody mensaje de confirmación
 */
router.post('/pay/save', async (req,res) => {
    const {name,phone,email,property_id,real_estate_development_id}  = req.body;
    const payment = new  Payment({name,phone,email,property_id,real_estate_development_id});
    console.log(payment);
    await payment.save();
    res.json("Insertado con exito");
});

module.exports = router;
