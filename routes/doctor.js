"use strict";

const express = require("express");
const router = express.Router();
//const middlewares = require("../middlewares");

//const middlewares = require("../middlewares");
const DoctorController = require("../controllers/doctor");
// Mehul - add the middleware for authentication in all these APIs
router.post(
    "/",
    DoctorController.create,
); // Create a new doctor

router.get("/:id", DoctorController.read);
router.put(
    "/:id",
    DoctorController.update
);
router.delete(
    "/:id",
    DoctorController.remove
);

module.exports = router;
