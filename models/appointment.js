"use strict"


const mongoose = require("mongoose")
const Enum = require("../src/enums")

const AppointmentSchema = new mongoose.Schema(
    {
        doctor: { //doctor`s ID
            type: String,
            required: true,
        },
        patient:{ //patient`s ID
            type: String,
            required: false,
        },
        startPoint:{
            type: Date,
            required:true,
        }, // all our appointments have a fixed duration e.g. 30 minutes
        /*
        endPoint:{
            type: Date,
            required:true,
        },
         */
        appointmentStatus:{
            type: String,
            enum: Enum.AppointmentStatus,
            required:true,
            default:Enum.AppointmentStatus.AVAILABLE,
        },

        appointmentDetails:{
            type: String,
            required: false,
        },

        appointmentTitle:{
            type: String,
            required: false,
        }
    }
)
module.exports = mongoose.model("appointment", AppointmentSchema)