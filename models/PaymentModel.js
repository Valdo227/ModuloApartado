const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Modelo del guardado de la información de pago
 *
 */

const PaymentSchema = new Schema({
    name:{type: String, require: true},
    phone:{type: String, require: true},
    email:{type: String, require: true},
    property_id: {type: String, require: true},
    real_estate_development_id:{type: String, require: true}
});

module.exports = mongoose.model("payment",PaymentSchema);
