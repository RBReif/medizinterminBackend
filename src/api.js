"use strict";

const express    = require('express');
const bodyParser = require('body-parser');
const helmet     = require('helmet');

const api = express();
const patient  = require('../routes/patient');
const doctor = require('../routes/doctor');
const appointment = require('../routes/appointment');
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'Medizintermin backend application service'
    });
});

// API routes
api.use('/patient', patient);
api.use('/doctor', doctor);
api.use('/appointment', appointment)

module.exports = api;