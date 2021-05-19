const mongoose = require('mongoose');
const {Schema} = mongoose;

const SectionSchema = new Schema({
    name: String,
    price: Number,
    dimension: Number

})
module.exports = mongoose.model("section",SectionSchema);
