"use strict"


const mongoose = require("mongoose")
const Enum = require("../src/enums")

/*


 */

const AppointmentSchema = new mongoose.Schema(
    {
        doctor: { //doctor`s ID
            type: String,
            required: true,
        },
        patient:{ //patient`s ID
            type: String,
            required: true,
        },
        startPoint:{
            type: Date,
            required:true,
        },
        endPoint:{
            type: Date,
            required:true,
        },
        status:{
            type: String,
            enum: Enum.AppointmentStatus,
            required:true,
            default:Enum.AppointmentStatus.AVAILABLE,
        }
    }
)
module.exports = mongoose.model("appointment", AppointmentSchema)