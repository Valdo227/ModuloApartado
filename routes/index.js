const express = require('express');
const router = express.Router();
const  request = require('request');
require('dotenv').config()
const Payment = require('../models/PaymentModel')
const body ={
    real_estate_development_code: process.env.BUILDING_CODE
}
const headers =  {
    'Authorization': process.env.BEARER_TOKEN,
    'Content-Type': 'application/json'
}
const urlAPI = 'https://dev.api.capital28.investments/api/Property/list';

/**
 * GET Página inicial
 * Se consume el API externo de Capital 28
 */
router.get('/', (req,res) =>{
    request.post(urlAPI,{
        headers,
        body,
        json:true
    },(err,response) =>{
        res.render('index', {property: response.body.Data.Property})
    })
});

/**
 * GET Página para el pago de la propiedad
 * Se consume el API externo de Capital 28
 */
router.get('/pay/:id', (req,res) =>{
    request.post(urlAPI,{
        headers,
        body,
        json:true
    },(err,response) =>{
        if(response.body.Code === 200) {
            response.body.Data.Property.forEach(con => {
                if (con._id === req.params.id) {
                    res.render('pay', {property: con});
                }
            });

        }
    })
});

/**
 * GET Pagina de información después del pago exitoso.
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
