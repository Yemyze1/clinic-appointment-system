require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const cors = require ("cors");
const Appointment = require("./models/appointment");

const app = express();

// This lets the server read JSON data sent by the frontend
app.use(express.json());

// This allows the frontend to talk to the backend even if they are on different ports
app.use(cors());

// This is the port number the server will use
const PORT = 5000;

// Home page route: shows a welcome message when someone opens the API
app.get("/", (req, res) => {
    res.send("Welcome to the Clinic Appointment API!")
});

// About page route: tells the user what this API is for
app.get("/about", (req, res) => {
    console.log("Someone visited the about page");
    res.send("This API helps patients book appointments.");
});

// This route gets all appointments and sends them to the client as JSON
app.get("/appointments", async (req, res) => {

    try {

        const appointments = await Appointment.find();

        res.json(appointments);

    } catch (error) {

        console.log(error);
        
        res.status(500).json({ 
            message: "Failed to load appointments" });
    }
});



// This route creates a new appointment when the form is submitted
app.post("/appointments", async (req, res) => {
    try {

// check that all required appointment details are provided in the request body
    if
     (!req.body.name ||
         !req.body.department || 
         !req.body.date || 
         !req.body.time) {
        return res.status(400).json({
            message : "All appointment details are required."
        });
    }
    
    // This prevents users from booking appointments in the past
    const today = new Date().toISOString().split("T")[0];

    // This checks if the date in the request body is less than today's date
    if (req.body.date < today) {
        // If the date is in the past, send a 400 Bad Request response with an error message
        return res.status(400).json({
            message: "You cannot book an appointment for a past date."
        });
    }

    const appointmentExists = await Appointment.findOne({
        date: req.body.date,
        time: req.body.time
    });

    if (appointmentExists) {
        return res.status(400).json({
            message: "This appointment slot is already booked."
        });
    }

    const newAppointment = await Appointment.create({
        name: req.body.name,
        department: req.body.department,
        date: req.body.date,
        time: req.body.time
    });

    res.status(201).json({
        message: "Appointment booked successfully!",
        appointment: newAppointment
    });

} catch (error) {

    console.log(error);

    res.status(500).json({
        message: "Failed to book appointment."
    });
    };

    


   
}); 

// This route deletes an appointment using the ID in the URL
app.delete("/appointments/:id", async (req, res) => {

try {

    const deletedAppointment = await Appointment.findByIdAndDelete(
        req.params.id
    );

    if (!deletedAppointment) {
        return res.status(404).json({
            message: "Appointment not found."
        });
    }

    res.json({
        message: "Appointment deleted successfully!"
    });

} catch (error) {

    console.log(error);

    res.status(500).json({
        message: "Failed to delete appointment."
    });

}
});


// This route updates an appointment using the ID in the URL
app.put("/appointments/:id", async (req, res) => {

    try {

        // Check that all required appointment details are provided
        if (
            !req.body.name ||
            !req.body.department ||
            !req.body.date ||
            !req.body.time
        ) {
            return res.status(400).json({
                message: "All appointment details are required."
            });
        }

        // Prevent updating an appointment to a past date
        const today = new Date().toISOString().split("T")[0];

        if (req.body.date < today) {
            return res.status(400).json({
                message: "You cannot book an appointment for a past date."
            });
        }

        // Check whether another appointment already uses this date and time
        const appointmentExists = await Appointment.findOne({
            date: req.body.date,
            time: req.body.time,
            _id: { $ne: req.params.id }
        });

        if (appointmentExists) {
            return res.status(400).json({
                message: "This appointment date and time is already booked."
            });
        }

        // Update the appointment
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            req.params.id,
            {
                name: req.body.name,
                department: req.body.department,
                date: req.body.date,
                time: req.body.time
            },
            { new: true }
        );

        // Check whether the appointment actually exists
        if (!updatedAppointment) {
            return res.status(404).json({
                message: "Appointment not found."
            });
        }

        res.json({
            message: "Appointment updated successfully!",
            appointment: updatedAppointment
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Failed to update appointment."
        });
    }
});


// connect to MongoDB using the connection string from the .env file
mongoose.connect(process.env.MONGODB_URI)
.then(() => {
    console.log("Connected to MongoDB!");
})
.catch((error) => {
    console.log(error);
});

// Start the server and make it listen for requests
app.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
})

