"use strict";
const enums = require("../src/enums")

const read = async (req, res) => {
    try{
        return res.status(200).json({
            areas : Object.values(enums.AreaOfExpertise),
            insurances: Object.values(enums.InsuranceType),
            languages: Object.values(enums.Language),
            facilities: Object.values(enums.SpecialFacility)
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