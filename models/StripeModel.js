const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Modelo de datos de Stripe
 *
 */

const StripeSchema = new Schema({
    account:{type: String, require: true},
    public_key:{type: String, require: true},
    secret_key:{type: String, require: true}
});

module.exports = mongoose.model("stripe",StripeSchema);
