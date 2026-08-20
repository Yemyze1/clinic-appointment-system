const mongoose = require("mongoose");

// This helps to define the structure of the appointment data that will be stored in the MongoDB database.
const appointmentSchema = new mongoose.Schema({

    name: String,

    department: String,

    date: {
        type: String,
        required: true
    },

    time: {
        type: String,
        required: true
    }
});

// This allows us to create a unique index on the combination of date and time fields, ensuring that no two appointments can be scheduled at the same date and time.
appointmentSchema.index(
    { date: 1, time: 1 },
      { unique: true }
    );

    // This is the model for the appointment schema, which allows us to interact with the appointments collection in the MongoDB database.
const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;