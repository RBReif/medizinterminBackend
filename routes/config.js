"use strict";

const express = require("express");
const router = express.Router();
const middleware = require("../src/middleware")

const ConfigController = require("../controllers/config")

router.get(
    "/",
    ConfigController.read
);

module.exports = router;