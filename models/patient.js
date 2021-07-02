"use strict";

const mongoose = require("mongoose");
// this is that the later created virtuals are included in the json send to the user
const opts = { toJSON: { virtuals: true } };

const PatientSchema = new mongoose.Schema({
    // name of patient
    name: String,
    // date of birth
    characters: [String],
});