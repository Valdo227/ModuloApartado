const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Modelo de datos de paypal
 *
 */

const PaypalSchema = new Schema({
    account:{type: String, require: true},
    client_id:{type: String, require: true},
    secret:{type: String, require: true}
});

module.exports = mongoose.model("paypal",PaypalSchema);
