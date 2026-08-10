const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    name: String,
    department: String,
    date: String,
    time: String,
});

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;