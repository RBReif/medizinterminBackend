"use strict";

const mongoose = require("mongoose");
// this is that the later created virtuals are included in the json send to the user
const Enum = require("../src/enums")
const opts = { toJSON: { virtuals: true } };

/***
 *
 * @type {mongoose.Schema}
 * name - String
 * date_of_birth - Date
 * insurance - Enum
 */
const PatientSchema = new mongoose.Schema({
    // name of patient
    name: String,
    // date of birth
    date_of_birth: Date,
    // insurance
    insurance: {
        type: String,
        enum: Enum.InsuranceType,
        required: true,
    },
},
    {collection: 'patient'});
// Export the Patient model
module.exports = mongoose.model("patient", PatientSchema);