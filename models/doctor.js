"use strict";

const mongoose = require("mongoose");
const Enum = require("../src/enums")
//const area_of_expertise = require("../enums/area_of_expertise.js")
//import {AreaOfExpertise} from '../enums'
// this is that the later created virtuals are included in the json send to the user
const opts = { toJSON: { virtuals: true } };

/***
 *
 * @type {mongoose.Schema}
 * name - String
 * date_of_birth - Date
 * area_of_expertise - Enum(AreaOfExpertise)
 * languages - Enum(Language)
 * special_facilities - Enum(SpecialFacility)
 */
const DoctorSchema = new mongoose.Schema(
    {
        // name of patient
        name: {
            type: String,
            required: true,
        },
        // date of birth
        date_of_birth: {
            type: String,
            required: true,
        },
        // area_of_expertise
        area_of_expertise: {
            type: String,
            enum: Enum.AreaOfExpertise,
            required: true,
        },
        languages: {
            type: [String],
            enum: Enum.Language,
            required: true
        },
        special_facilities: {
            type: [String],
            enum: Enum.SpecialFacility,
        }
    },
    {collection: 'doctor'}
);
// Export the Doctor model
module.exports = mongoose.model("doctor", DoctorSchema);