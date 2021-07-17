"use strict";

const mongoose = require("mongoose");

// this is that the later created virtuals are included in the json send to the user
const opts = { toJSON: { virtuals: true } };


const AddressSchema = new mongoose.Schema({
    //address, required
    address_value: {
        type: String,
        required: true
    },
    //the address as lat and long
    latitude: String,
    longitude: String,
});

module.exports = AddressSchema;