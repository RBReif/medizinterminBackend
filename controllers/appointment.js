"use strict";

const AppointmentModel = require("../models/appointment");
const DoctorModel = require("../models/doctor")
const PatientModel = require("../models/patient")
const Enum = require("../src/enums")


const createAppointment = async (req, res) => {

    try {
        let doctor = await DoctorModel.findById(req.body.doctor)
        if (doctor == null) {
            return res.status(400).json({message: "The doctor ID does not belong to a stored doctor."})
        }
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
                let patient = await PatientModel.findById(req.params.patient)
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


const getAppointmentsPatient = async (req, res) => {
    try{
        let appointmentsPat = await AppointmentModel.find({
                patient: req.params.id
            }
        )
        return res.status(200).json(appointmentsPat)
    }catch (err){
        return res.status(500).json({message: err.message})

    }
}

const getAppointmentsDoctor = async (req, res) => {
    try{
        let appointmentsPat = await AppointmentModel.find({
                doctor: req.params.id
            }
        )
        return res.status(200).json(appointmentsPat)
    }catch (err){
        return res.status(500).json({message: err.message})

    }
}

const getAppointment = async (req, res) => {
    try {
                let appointment = await AppointmentModel.findById(req.params.id)
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




// //This component will go somewhere else
// //In the backend most probaly. It will calculate the distance between two coordinates
// let hbf = {lat: 48.166629, lng: 11.591026}
// let home = {lat: 48.1402669, lng: 11.559998};

//This function takes in latitude and longitude of two location and returns the distance between them as the crow flies (in km)
function calcDistance(lat1, lng1, lat2, lng2)
{
    var R = 6371; // km
    var dLat = toRad(lat2-lat1);
    var dLng = toRad(lng2-lng1);
    var lat1 = toRad(lat1);
    var lat2 = toRad(lat2);

    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLng/2) * Math.sin(dLng/2) * Math.cos(lat1) * Math.cos(lat2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    var d = R * c;
    return d;
}
// Converts numeric degrees to radians
function toRad(Value)
{
    return Value * Math.PI / 180;
}



const filterAppointment = async (req, res) => {
    try {

        let profession = req.body.profession
        if (!Object.values(Enum.AreaOfExpertise).includes(profession)) {
            return res.status(400).json({message: "Profession unknown"})
        }


        let languages = req.body.languages
        if (!languages.every((item) => Object.values(Enum.Language).includes(item))) {
            return res.status(400).json({message: "Language(s) unknown"})
        }


        let facilities
        facilities = req.body.facilities
        if (!facilities.every((item) => Object.values(Enum.SpecialFacility).includes(item))) {
            return res.status(400).json({message: "Facilitie(s) unknown"})
        }

        console.log("Facilities: ", facilities)
        console.log("Languages: ", languages)

        let fittingDoctors
        if (facilities.length > 0) {
            fittingDoctors = await DoctorModel.find({
                area_of_expertise: profession,
                languages: {$in: languages},
                special_facilities: {$all: facilities},
            });
        } else {
            fittingDoctors = await DoctorModel.find({
                area_of_expertise: profession,
                languages: {$in: languages},
            });
        }
        console.log(fittingDoctors)

        //ADDRESS :: :: :: :: ::
        let address = req.body.address
        if (!Object.values().includes(address)) {
            return res.status(400).json({message: "Address unknown"})
        }

        let maxDistance = req.body.radius
        if (!Object.values().includes(radius)) {
            return res.status(400).json({message: "max distance not specified"})
        }

        fittingDoctors = fittingDoctors.filter((item) => calcDistance(item.address.lat,item.address.lng, address.lat, address.lng)<=maxDistance)


        //  let test = calcDistance(hbf.lat, hbf.lng, home.lat, home.lng);
  //  console.log("DISTANCE: ", test);



        let fittingDoctorIDs = fittingDoctors.map((item) => item["_id"])


        let startpoint = new Date(req.body.startpoint)
        let endpoint = new Date(req.body.endpoint)
        if (startpoint.isNaN || endpoint.isNaN) {
            return res.status(400).json({message: "Date or Time wrongly specified"})
        }
        if (endpoint < startpoint) {
            return res.status(400).json({message: "Endpoint must be later than startpoint"})

        }
        console.log("Startpoint: ", startpoint)
        console.log("endpoint: ", endpoint)

        let appointments = await AppointmentModel.find({
            doctor: {$in: fittingDoctorIDs},
            startPoint: {
                $gte: startpoint,
                $lt: endpoint
            },
            appointmentStatus: Enum.AppointmentStatus.AVAILABLE

        })

        console.log("Appointments ", appointments)


        return res.status(200).json(appointments)

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
    getAppointmentsPatient,
    getAppointmentsDoctor,
}


