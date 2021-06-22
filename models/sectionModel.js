const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SectionSchema = new Schema({
    name: {type: String, require: true},
    price: {type: Number, require: true},
    dimension: {type: Number, require: true}

});

module.exports = mongoose.model("section",SectionSchema);
