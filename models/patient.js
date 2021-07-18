"use strict";

const mongoose = require("mongoose");
// this is that the later created virtuals are included in the json send to the user
const Enum = require("../src/enums")
const opts = { toJSON: { virtuals: true } };
const AddressSchema = require("../models/address")

/***
 *
 * @type {mongoose.Schema}
 * name - String
 * date_of_birth - Date
 * insurance - Enum
 */
const PatientSchema = new mongoose.Schema({

    // username of patient
    username:{
            type: String,
            required: true,
            unique: true,
        },
    // password of patient
    password: {
            type: String,
            required: true,
        },
    // firstname of patient
    firstname: {
        type: String,
        required: true,
    },
    // lastname of patient
    lastname: {
        type: String,
        required: true,
    },
    // date of birth
    date_of_birth: {
        type: Date,
        required: true,
    },
    // insurance
    insurance: {
        type: String,
        enum: Enum.InsuranceType,
        required: true,
    },
    address: {
        type: AddressSchema,
        require: true,
    },
    gender: {
        type: String,
        required: true,
    },
},
    {collection: 'patient'});
// Export the Patient model
module.exports = mongoose.model("patient", PatientSchema);