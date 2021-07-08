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

const bookAppointment = async (req, res) => {
    let appointment
    try {
        appointment = await AppointmentModel.findById(req.params.id)
        if (appointment == null) {
            return res.status(404).json({message: "Can not find specified appointment"})
        }
        if (appointment.status === Enum.AppointmentStatus.AVAILABLE) {
            if (req.body.patient != null) {
                appointment.patient = req.body.patient
                appointment.appointmentStatus = Enum.AppointmentStatus.SCHEDULED
                const updatedAppointment = await appointment.save()
                res.status(204).json(updatedAppointment)
            } else {
                return res.status(400).json({message: "The patient ID was not specified"})
            }
        } else {
            return res.status(400).json({message: "This appointment is not available"})
        }
    } catch (err) {
        console.log(err)
        return res.status(500).json({message: err.message})
    }
}

const setStatusOfAppointment = async (req, res) => {
    let appointment
    try {
        appointment = await AppointmentModel.findById(req.params.id)
        if (appointment == null) {
            return res.status(404).json({message: "Can not find specified appointment"})
        }
                appointment.status = req.body.status
                const updatedAppointment = await appointment.save()
                res.status(204).json(updatedAppointment)

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
