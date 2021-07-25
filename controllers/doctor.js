"use strict";
const Enums = require("../src/enums")
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
            { _id: doctor._id, username: doctor.username, role: Enums.UserRole.DOCTOR, thumbnail: doctor.thumbnail},
            config.JwtSecret,
            {
                expiresIn: 86400, // expires in 24 hours
            }
        );

        return res.status(200).json({
            token: token,
            username: doctor.username,
            _id: doctor._id,
            role: Enums.UserRole.DOCTOR,
            thumbnail: doctor.thumbnail,
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
                role: Enums.UserRole.DOCTOR,
                thumbnail: doctor.thumbnail,
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
            role: Enums.UserRole.DOCTOR,
            thumbnail: doctor.thumbnail
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

//Doctorlist
const list = async (req, res) => {
    try {
        // get all doctors in database
        let doctors = await DoctorModel.find({}).exec();

        // return gotten doctors
        return res.status(200).json(doctors);
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

//Rate a doctor 
const rate = async (req, res) => {
    try {
        let votedDoctorId = req.params.id;
        // find a doctor that has the id and is voted by the user
        // returns null if the user has not voted this doctor
        let alreadyVotedDoctor = await DoctorModel.findOne({
            _id: votedDoctorId,
            "audience_ratings.patient_id": req.userId,
        });

        // check if user has already voted this doctor
        if (alreadyVotedDoctor !== null) {
            // if the user has already voted update his voting entry
            await DoctorModel.updateOne(
                {
                    _id: votedDoctorId,
                    "audience_ratings.patient_id": req.userId,
                },
                {
                    $set: {
                        "audience_ratings.$.rating": req.body.rating,
                    },
                }
            );
        } else {
            // if the user has not voted create a new rating entry
            let ratingObject = {
                patient_id: req.userId,
                rating: req.body.rating,
            };
            await DoctorModel.findByIdAndUpdate(votedDoctorId, {
                $push: { audience_ratings: ratingObject },
            });
        }

        return res.status(200).json({});
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: "Internal server error",
            message: err.message,
        });
    }
};

//get the rate of a doctor
const getRate = async (req, res) => {
    try {
        let doctorId = req.params.id;

        // get the doctor
        let doctorRating = await DoctorModel.findById(doctorId);

        // extract the average audience rating
        let rating = doctorRating.avgAudienceRating;

        // return average audience rating
        return res.status(200).json({ rating: rating });
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
    list,
    rate,
    getRate,
}