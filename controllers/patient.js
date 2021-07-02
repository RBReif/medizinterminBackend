"use strict";

const PatientModel = require("../models/patient");

const create = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (Object.keys(req.body).length === 0)
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body is empty",
        });

    // handle the request
    try {
        // create patient in database
        let patient = await PatientModel.create(req.body);

        // return created patient
        return res.status(201).json(patient);
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
        // get patient with id from database
        let patient = await PatientModel.findById(req.params.id).exec();

        // if no patient with id is found, return 404
        if (!patient)
            return res.status(404).json({
                error: "Not Found",
                message: `Patient not found`,
            });

        // return gotten patient
        return res.status(200).json(patient);
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
        // find and update patient with id
        let patient = await PatientModel.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        ).exec();

        // return updated patient
        return res.status(200).json(patient);
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
        // find and remove patient
        await PatientModel.findByIdAndRemove(req.params.id).exec();

        // return message that patient was deleted
        return res
            .status(200)
            .json({ message: `Patient with id${req.params.id} was deleted` });
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
    remove,
}