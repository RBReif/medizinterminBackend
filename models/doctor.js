"use strict";

const mongoose = require("mongoose");
const Enum = require("../src/enums")
//const area_of_expertise = require("../enums/area_of_expertise.js")
//import {AreaOfExpertise} from '../enums'
// this is that the later created virtuals are included in the json send to the user
const opts = { toJSON: { virtuals: true } };

// Define schema for ratings
const AddressSchema = new mongoose.Schema({
            //address, required
            address: {
                type: String,
                required: true
            },
            //the address as lat and long
            latitude: String,
            longitude: String,
    });

// const Ratingschema = new mongoose.Schema({
//     patientId: { type: mongoose.Schema.Types.ObjectId, ref: "patient" },
//     // rating of user
//     rating: {
//         type: Number,
//         min: 1,
//         max: 5,
//     },
// });

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
        username:{
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        // name of doctor, required
        name: {
            type: String,
            required: true,
        },

        last_name: {
            type: String,
            required: true,
        },

        // area_of_expertise, required
        area_of_expertise: {
            type: String,
            enum: Enum.AreaOfExpertise,
            required: true,
        },
        //spooken languages, required
        languages: {
            type: [String],
            enum: Enum.Language,
            required: true
        },
        special_facilities: {
            type: [String],
            enum: Enum.SpecialFacility,
        },

        //addresss:
        address: [AddressSchema],
        
        //phone number, not required 
        phone_number: String,

        //doctors' rating
        // audienceRatings: [RatingSchema],

        //thumbnail image, not required 
        //thumbnail is stored somewhere else, only the reference url to the image will be saved in the model.
        thumbnail: String, 
    },
    {collection: 'doctor'}
);

DoctorSchema.virtual("avgAudienceRating").get(function () {
    let avgRating = 0;
    let ratings = 0;
    // if there are no ratings return 0
    if (this.audienceRatings.length === 0) {
        return 0;
    }
    this.audienceRatings.map((rating) => {
        if (typeof rating.rating === "number") {
            avgRating += rating.rating;
        }
        ratings++;
    });
    avgRating = avgRating / ratings;
    return avgRating;
});

// Export the Doctor model
module.exports = mongoose.model("doctor", DoctorSchema);