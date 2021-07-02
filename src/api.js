"use strict";

const express    = require('express');
const bodyParser = require('body-parser');

const api = express();

// Basic route
api.get('/', (req, res) => {
    res.json({
        name: 'Medizintermin backend application service'
    });
});

// API routes
const patient  = require('./routes/patient');

module.exports = api;