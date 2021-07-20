"use strict";
const Enums = require("../src/enums");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../src/config");
const PatientModel = require("../models/patient");

const login = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (!Object.prototype.hasOwnProperty.call(req.body, "password"))
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a password property",
        });

    if (!Object.prototype.hasOwnProperty.call(req.body, "username"))
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a username property",
        });

    // handle the request
    try {
        // get the user from the database
        let patient = await PatientModel.findOne({
            username: req.body.username,
        }).exec();

        // check if the password is valid
        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            patient.password,
        );
        if (!isPasswordValid) return res.status(401).send({token: null});

        // if patient is found and password is valid
        // create a token
        const token = jwt.sign(
            {_id: patient._id, username: patient.username, role: Enums.UserRole.PATIENT, thumbnail: patient.thumbnail},
            config.JwtSecret,
            {
                expiresIn: 86400, // expires in 24 hours
            }
        );

        return res.status(200).json({
            token: token,
            username: patient.username,
            _id: patient._id,
            role: Enums.UserRole.PATIENT,
            thumbnail: patient.thumbnail,
        });
    } catch (err) {
        return res.status(404).json({
            error: "User Not Found",
            message: err.message,
        });
    }
};
const register = async (req, res) => {
    // check if the body of the request contains all necessary properties
    if (!Object.prototype.hasOwnProperty.call(req.body, "password"))
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a password property",
        });

    if (!Object.prototype.hasOwnProperty.call(req.body, "username"))
        return res.status(400).json({
            error: "Bad Request",
            message: "The request body must contain a username property",
        });

    // handle the request
    try {
        // hash the password before storing it in the database
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);

        // // create a user object
        // const user = {
        //     username: req.body.username,
        //     password: hashedPassword,
        //     role: req.body.role,
        // };
        req.body.password = hashedPassword;

        // create the user in the database
        let patient = await PatientModel.create(req.body);

        // if user is registered without errors
        // create a token
        const token = jwt.sign(
            {_id: patient._id, username: patient.username, role: Enums.UserRole.PATIENT, thumbnail: patient.thumbnail},
            config.JwtSecret,
            {
                expiresIn: 86400, // expires in 24 hours
            }
        );

        // patient created, return generated token
        res.status(201).json({
            token: token,
            username: patient.username,
            _id: patient._id,
            role: Enums.UserRole.PATIENT,
            thumbnail: patient.thumbnail,
        });
    } catch (err) {
        if (err.code == 11000) {
            return res.status(400).json({
                error: "User exists",
                message: err.message,
            });
        } else {
            return res.status(500).json({
                error: "Internal server error",
                message: err.message,
            });
        }
    }
};
const logout = (req, res) => {
    res.status(200).send({token: null});
};
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
            .json({message: `Patient with id${req.params.id} was deleted`});
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
    login,
    register,
    logout,
}