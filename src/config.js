"use strict";

// Configuration variables
const port = process.env.PORT || "4000";
const mongoURI = process.env.MONGODB_URI || "mongodb+srv://medizintermin-dev-app-user:ExYar9kwDYSGSAK6@medizintermin-dev-db.wlpdf.mongodb.net/dbOne?retryWrites=true&w=majority";
const JwtSecret = process.env.JWT_SECRET || "very secret secret";

module.exports = {
    port,
    mongoURI,
    JwtSecret,
};