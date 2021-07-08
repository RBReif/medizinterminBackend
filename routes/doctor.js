"use strict";

const express = require("express");
const router = express.Router();
const middlewares = require("../src/middleware");

//const middlewares = require("../middlewares");
const DoctorController = require("../controllers/doctor");
// Mehul - add the middleware for authentication in all these APIs
router.post(
    "/login",
    DoctorController.login,
); // login a doctor
router.post(
    "/register",
    DoctorController.register,
); // register a new doctor
router.post(
    "/logout",
    middlewares.checkAuthentication,
    DoctorController.logout,
)
router.post(
    "/",
    DoctorController.create,
); // Create a new doctor

router.get(
    "/:id",
    middlewares.checkAuthentication,
    DoctorController.read); // Read a movie by Id
router.put(
    "/:id",
    DoctorController.update
); // Update a doctor by Id
router.delete(
    "/:id",
    DoctorController.remove
)

module.exports = router;
