const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId();

const ContactSchema = new Schema({
    name:{type: String, require: true},
    phone:{type: String, require: true},
    email:{type: String, require: true},
    type:{type: String, require: true},
    process:{type: String, require: true},
    property_id: {type: ObjectId, require: true},
    real_estate_development_id:{type: ObjectId, require: true}
});

module.exports = mongoose.model("contact",ContactSchema);
