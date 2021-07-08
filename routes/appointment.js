"use strict";

const express = require("express");
const router = express.Router();

const AppointmentsController = require("../controllers/appointment")

router.post(
    "/",
    AppointmentsController.createAppointment,
);

router.delete(
    "/:id",
    AppointmentsController.deleteAppointment,
)

router.put(
    "/:id",
    AppointmentsController.updateAppointment,
)

router.get(
    "/:id",
    AppointmentsController.getAppointment,
)

router.get(
    "/",
    AppointmentsController.filterAppointments,
)

module.exports = router;