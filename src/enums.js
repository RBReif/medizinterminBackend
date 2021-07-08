const AreaOfExpertise = {
    CARDIOLOGIST: "CARDIOLOGIST",
    PSYCHOLOGIST: "PSYCHOLOGIST",
    GYNAECOLOGIST: "GYNAECOLOGIST",
    ORTHOPAEDIST: "ORTHOPAEDIST",
    DENTIST: "DENTIST",
    RADIOLOGIST: "RADIOLOGIST",
    SPORTS_DOCTOR: "SPORTS_DOCTOR",
    PEDIATRICIAN: "PEDIATRICIAN",
    ONCOLOGIST: "ONCOLOGIST",
    GENERAL_PHYSICIAN: "GENERAL_PHYSICIAN",
}

const InsuranceType = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE",
}

const Language = {
    GERMAN: "GERMAN",
    ENGLISH: "ENGLISH",
    FRENCH: "FRENCH",
    ITALIAN: "ITALIAN",
    TURKISH: "TURKISH",
}

const SpecialFacility = {
    WHEELCHAIR: "WHEELCHAIR",
    ELEVATOR: "ELEVATOR",
    PARKING: "PARKING",
    PUBLIC_TRANSPORT: "PUBLIC_TRANSPORT",
}

const AppointmentStatus = {
    SUCCESSFUL: "SUCCESSFUL",
    SCHEDULED: "SCHEDULED",
 //   REQUESTED: "REQUESTED",
    FAILED: "FAILED",
    AVAILABLE: "AVAILABLE",
}

const UserType = {
    DOCTOR: "DOCTOR",
    PATIENT: "PATIENT",

}

module.exports = {
    AreaOfExpertise,
    InsuranceType,
    Language,
    SpecialFacility,
    AppointmentStatus,
    UserType,
}