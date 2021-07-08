"use strict";

const AppointmentModel = require("../models/appointment");
const DoctorModel = require("../models/doctor")
const PatientModel = require("../models/patient")
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
                let patient = await DoctorModel.findById(req.params.patient)
                if (patient == null) {
                    return res.status(400).json({message: "The patient ID does not belong to a stored patient."})
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
        if (appointment == null) {
            return res.status(404).json({message: "Can not find specified appointment"})
        }
        return res.status(200).json(appointment)
    } catch (err) {
        return res.status(500).json({message: err.message})
    }

}


var isDate = function (date) {
    return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
}

const filterAppointment = async (req, res) => {
    try {
        let profession = req.body.profession

       if (!Object.values(Enum.AreaOfExpertise).includes(profession)) {
            res.status(400).json({message: "Profession unknown"})
        }


        let languages = req.body.languagesD
        if (!languages.every((item) => Object.values(Enum.Language).includes(item))) {
            res.status(400).json({message: "Language(s) unknown"})
        }


        let facilities = req.body.facilities
        if (!facilities.every((item) => Object.values(Enum.SpecialFacility).includes(item))) {
            res.status(400).json({message: "Facilitie(s) unknown"})
        }
        console.log("Facilities: ",facilities)
        console.log("Languages: ",languages)

        let startpoint = new Date(req.body.startpoint)
        let endpoint = new Date(req.body.endpoint)
        if (startpoint.isNaN || endpoint.isNaN) {
         //   res.status(500).json({message: "Date or Time wrongly specified"})
        }
        console.log("Startpoint: ",startpoint)
        console.log("endpoint: ",endpoint)


        let fittingDoctors = await DoctorModel.find({
            area_of_expertise: profession,
            languages: {$in: languages},
            special_facilities: {$all: facilities}
        })
        console.log(fittingDoctors)
        let fittingDoctorIDs = fittingDoctors.map((item) => item["_id"])

        res.status(200).json(fittingDoctors)

    } catch (err) {
        console.log(err)
        return res.status(500).json({message: err.message})
    }

}




module.exports = {
    deleteAppointment,
    createAppointment,
    updateAppointment,
    getAppointment,
    filterAppointment,
}