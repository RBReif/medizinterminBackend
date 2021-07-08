"use strict";

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const config = require("../src/config");
const DoctorModel = require("../models/doctor");

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
        let doctor = await DoctorModel.findOne({
            username: req.body.username,
        }).exec();

        // check if the password is valid
        const isPasswordValid = bcrypt.compareSync(
            req.body.password,
            doctor.password,
        );
        if (!isPasswordValid) return res.status(401).send({ token: null });

        // if user is found and password is valid
        // create a token
        const token = jwt.sign(
            { _id: doctor._id, username: doctor.username},
            config.JwtSecret,
            {
                expiresIn: 86400, // expires in 24 hours
            }
        );

        return res.status(200).json({
            token: token,
            username: doctor.username,
            _id: doctor._id,
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
        let doctor = await DoctorModel.create(req.body);

        // if user is registered without errors
        // create a token
        const token = jwt.sign(
            {
                _id: doctor._id,
                username: doctor.username,
            },
            config.JwtSecret,
            {
                expiresIn: 86400, // expires in 24 hours
            }
        );

        // doctor created, return generated token
        res.status(201).json({
            token: token,
            username: doctor.username,
            _id: doctor._id,
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
    res.status(200).send({ token: null });
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
    remove,
    login,
    register,
    logout,
}