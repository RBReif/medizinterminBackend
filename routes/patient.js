"use strict";

const express = require("express");
const router = express.Router();

const middlewares = require("../src/middleware");
const PatientController = require("../controllers/patient");
// Mehul - add the middleware for authentication in all these APIs
router.post(
    "/login",
    PatientController.login,
);
router.post(
    "/register",
    PatientController.register,
);
router.post(
    "/logout",
    middlewares.checkAuthentication,
    PatientController.logout,
)
router.post(
    "/",
    PatientController.create
); // Create a new patient
router.get(
    "/:id",
    middlewares.checkAuthentication,
    PatientController.read); // Read a movie by Id
router.put(
    "/:id",
    PatientController.update
); // Update a patient by Id
router.delete(
    "/:id",
    PatientController.remove
)

module.exports = router;
