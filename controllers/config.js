"use strict";
const enums = require("../src/enums")

const read = async (req, res) => {
    try{
        return res.status(200).json({
            areas : enums.AreaOfExpertise,
            insurances: enums.InsuranceType,
            languages: enums.Language,
            facilities: enums.SpecialFacility
        })
    }catch (err){
        console.log(err)
        return res.status(500).json({
            message : "Config could not be sent"
        })
    }

}

module.exports ={
    read,
}