"use strict";

const AppointmentModel = require("../models/appointment");
const Enum = require("../src/enums")


const createAppointment = async (req, res) => {

    try {
        let appointment = await AppointmentModel.create(req.body);
        res.status(201).json(appointment)
    } catch (err) {
        console.log(err)
        res.status(400).json({message: err.message})
    }
};

const updateAppointment = async (req, res) => {
    let appointment
    try {
        appointment = await AppointmentModel.findById(req.params.id)
        if (appointment == null) {
            return res.status(404).json({message: "Can not find specified appointment"})
        }
        switch (req.body.appointmentStatus) {
            case Enum.AppointmentStatus.SCHEDULED:
                if (appointment.appointmentStatus !== Enum.AppointmentStatus.AVAILABLE) {
                    return res.status(400).json({message: "This appointment is not available"})
                }
                if (req.body.patient == null) {
                    return res.status(400).json({message: "The patient ID was not specified"})
                }
                appointment.patient = req.body.patient
                appointment.appointmentStatus = Enum.AppointmentStatus.SCHEDULED
                break;
            case Enum.AppointmentStatus.FAILED:
                appointment.appointmentStatus = Enum.AppointmentStatus.FAILED
                break;

            case Enum.AppointmentStatus.SUCCESSFUL:
                appointment.appointmentStatus = Enum.AppointmentStatus.SUCCESSFUL
                break;
            default:
                return res.status(400).json({message: "Only setting the Status to SUCCESSFUL, FAILED, SCHEDULED is allowed"})

        }
        let updatedAppointment = await appointment.save()
        res.status(200).json(updatedAppointment)
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: err.message})
    }
}


const deleteAppointment = async (req, res) => {
    try {
        await AppointmentModel.findByIdAndRemove(req.params.id);
        return res.status(200).json({message: "Deleted appointment"})

    } catch (err) {
        console.log(err)
        return res.status(500).json({message: err.message})
    }
}

const getAppointment = async (req, res) => {
  let appointment
    try {
         appointment = await AppointmentModel.findById(req.params.id)
        if (appointment==null) {
            return res.status(404).json({message: "Can not find specified appointment"})
        }
        return res.status(200).json(appointment)
        }catch (err){
        return res.status(500).json({ message: err.message})
    }

}

const filterAppointment = async (req,res) => {
    let profession = req.body.profession

}





module.exports = {
    deleteAppointment,
    createAppointment,
    updateAppointment,
    getAppointment,
    filterAppointment,
}