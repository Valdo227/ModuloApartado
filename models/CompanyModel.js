const mongoose = require('mongoose');
const {Schema} = mongoose;

const CompanySchema = new Schema({
    name:{type: String, require: true},
    pays:{type: Number, require: true },
    price:{type: Number, require:true}
})

module.exports = mongoose.model("company",CompanySchema);
