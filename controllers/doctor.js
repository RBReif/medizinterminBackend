"use strict";

const DoctorModel = require("../models/doctor");

const create = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });

    // handle the request
    try {
        // create doctor in database
        let doctor = await DoctorModel.create(req.body);

        // return created doctor
        return res.status(201).json(doctor);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};
const read = async (req, res) => {
    try {
        // get doctor with id from database
        let doctor = await DoctorModel.findById(req.params.id).exec();

        // if no doctor with id is found, return 404
        if (!doctor)
            return res.status(404).json({
                error: "Not Found",
                message: `Doctor not found`,
            });

        // return gotten doctor
        return res.status(200).json(doctor);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal Server Error",
            message: err.message,
        });
    }
};
const update = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0) {
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });
    }

    // handle the request
    try {
        // find and update doctor with id
        let doctor = await DoctorModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).exec();

        // return updated doctor
        return res.status(200).json(doctor);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};
const remove = async (req, res) => {
    try {
        // find and remove doctor
        await DoctorModel.findByIdAndRemove(req.params.id).exec();

        // return message that doctor was deleted
        return res
            .status(200)
            .json({ message: `Doctor with id${req.params.id} was deleted` });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

module.exports = {
    create,
    read,
    update,
    remove
}