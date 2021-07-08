"use strict";

const express    = require('express');
const bodyParser = require('body-parser');
const helmet     = require('helmet');

const api = express();
const patient  = require('../routes/patient');
const doctor = require('../routes/doctor');
api.use(helmet());
api.use(bodyParser.json());
api.use(bodyParser.urlencoded({ extended: false }));

api.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
});

// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'Medizintermin backend application service'
    });
});

// API routes
api.use('/patient', patient);
api.use('/doctor', doctor);

module.exports = api;