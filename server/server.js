const express = require("express");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());
const PORT = 5000;

app.get ("/", (req, res) => {
    res.send("Welcome to the Clinic Appointment API!")
});
 
app.get("/about", (req, res) => {
    console.log("Someone visited the about page");
    res.send("This API helps patients book appointments.");
});

app.get("/appointments", (req, res) => {
    res.json(appointments);
});

const appointments = [
    { id: 1,
         name: "John Doe",
        department: "Dental",
        date: "2026-07-30",
        time: "10:00 AM"
    },
    { id: 2,
        name: "Mary Jane",
        department: "Eye Clinic",
        date: "2026-07-30",
        time: "11:00 AM"
    },
];



app.post("/appointments", (req, res) => {
    const newAppointment = {
        id: appointments.length + 1,
        ...req.body,
    };

    const appointmentExists = appointments.find((appointment) => {
        return (
            appointment.date === newAppointment.date &&
        appointment.time === newAppointment.time
    );
});

if (appointmentExists) {
    return res.status(400).json({
        message: "This appointment slot is already booked."
    });
}

    appointments.push(newAppointment);

    res.status(201).json({
        message: "Appointment booked successfully!",
        appointment: newAppointment,
    });
}); 

app.listen(PORT, () => {
    console.log(`Server is now running on http://localhost:${PORT}`);
})

