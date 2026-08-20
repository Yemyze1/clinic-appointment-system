import { useState, useEffect } from "react";

// This is the main page of the app
function App() {
  // These are the values the user types into the appointment form
  
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [editAppointment, setEditAppointment] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const [filterDepartment, setFilterDepartment] = useState("");
  const [searchName, setSearchName] = useState("");

  // This shows messages like success or error after booking or deleting
  const [message, setMessage] = useState("");

  // This stores all the appointments we get from the backend
  const [appointments, setAppointments] = useState([]);

  const [loading, setLoading] = useState(true);

  // These are the appointment times that the clinic makes available
  // Each appointment slot is 30 minutes apart
  const timeSlots = [
  "09:00",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  "12:00",
  "12:30",
];

  // This gets all appointments from the server and saves them in the state
  function loadAppointments() {
    setLoading(true);

    fetch("https://clinic-appointment-system-1j6p.onrender.com/appointments")
        .then((response) => response.json())
        .then((data) => {
            console.log(data);
            setAppointments(data);
        })
        .catch((error) => {
            console.log(error);
            setMessage("Failed to load appointments.");
        })
        .finally(() => {
            setLoading(false);
        });
}

  // This finds which appointment times are still available
  // for the date selected by the patient
  function getAvailableSlots() {

    // If the patient has not selected a date yet,
    // show all clinic time slots
    if (!date) {
      return timeSlots;
    }

    // Find all appointments that are already booked
    // on the date selected by the patient
    const bookedTimes = appointments
      .filter((appointment) => appointment.date === date)
      .map((appointment) => appointment.time);

    // Remove the times that are already booked
    // and return only the available ones
    return timeSlots.filter((slot) => {

      // If the patient is editing an existing appointment,
      // allow them to keep their current time
      if (
        editAppointment &&
        editAppointment.date === date &&
        editAppointment.time === slot
      ) {
        return true;
      }

      // Keep the slot only if nobody has booked it
      return !bookedTimes.includes(slot);
    });
  }

  // This finds appointments that are happening tomorrow
// so we can show the patient a reminder.
function getTomorrowAppointments() {

  // Get today's date
  const today = new Date();

  // Create a new date representing tomorrow
  const tomorrow = new Date(today);

  tomorrow.setDate(today.getDate() + 1);

  // Convert tomorrow into the same YYYY-MM-DD format
  // that our appointment dates use.
  const tomorrowString = tomorrow.toISOString().split("T")[0];

  // Find all appointments scheduled for tomorrow
  return appointments.filter(
    (appointment) => appointment.date === tomorrowString
  );
}

  // This runs once when the page loads to fetch the appointment list
  useEffect(() => { 
    loadAppointments();
  }, [])
  
  // This runs when the user submits the form
  function handleSubmit(event) {

          event.preventDefault();

          

  // This checks if all fields are filled in before submitting
    if (!name || !department || !date || !time) {
            setMessage("Please fill in all appointment details.");
            return;
          }


 // This prevents users from booking appointments in the past

   // gets today's date in the same format as your HTML date input
      const today = new Date().toISOString().split("T")[0];

   if (date < today) {
    setMessage("You cannot book an appointment for a past date.");
       return;
          }

    // only start submitting after validation passes
     setSubmitting(true);

  // Put the form values together into one object  
   const appointment = {
      name,
      department,
      date,
      time
    };

    if (editAppointment) {

    fetch(`https://clinic-appointment-system-1j6p.onrender.com/appointments/${editAppointment._id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(appointment),
    })
    .then((response) => response.json())
    .then((data) => {
        setMessage(data.message);

        loadAppointments();

        setName("");
        setDepartment("");
        setDate("");
        setTime("");

        setEditAppointment(null);

        setSubmitting(false);
    });

    return;
}
    
   

    // Send the appointment to the backend server
    fetch("https://clinic-appointment-system-1j6p.onrender.com/appointments", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify(appointment),
})

  .then((response) => {
    const success = response.ok;

     return response.json().then((data) => ({
 
      success: success,
      data: data,
    }
   
     ));
  })
     
    .then(({ success, data }) => {
  setMessage(data.message);

  if (success) {
    loadAppointments();
  setName("");
  setDepartment("");
  setDate("");
  setTime("");

  

  };
setSubmitting(false);
  })};

  // This deletes one appointment from the server using its ID
  function handleDelete(_id) {

  fetch(`https://clinic-appointment-system-1j6p.onrender.com/appointments/${_id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      setMessage(data.message);
      loadAppointments();
    });

}

 {/* This edits users appointment */}

      function handleEdit(appointment) {
        setEditAppointment(appointment);

        setName(appointment.name);
        setDepartment(appointment.department);
        setDate(appointment.date);
        setTime(appointment.time);
      }

  return (
  <div className="app">

    {/* Header */}
    <header className="header">
      <div className="header-content">
        <div className="brand">
          <div className="brand-icon">+</div>

          <div>
            <h2>Clinic Appointment System</h2>
            {/* Appointment reminders */}
{getTomorrowAppointments().length > 0 && (
  <div className="reminder-box">

    {/* Reminder heading */}
    <h3>🔔 Appointment Reminder</h3>

    {/* Display every appointment happening tomorrow */}
    {getTomorrowAppointments().map((appointment) => (
      <p key={appointment._id}>
        You have an appointment tomorrow at{" "}
        <strong>{appointment.time}</strong>{" "}
        for <strong>{appointment.department}</strong>.
      </p>
    ))}

  </div>
)}
            <span>Clinic Appointment System</span>
          </div>
        </div>

        <div className="header-status">
          <span className="status-dot"></span>
          Appointments Open
        </div>
      </div>
    </header>


    {/* Main content */}
    <main className="main-content">

      {/* Hero section */}
      <section className="hero-section">

        <div className="hero-text">
          <span className="eyebrow">SMARTER CLINIC VISITS</span>

          <h1>
            Skip the queue.
            <br />
            <span>Book your appointment.</span>
          </h1>

          <p>
            Choose a convenient appointment time and manage your
            clinic visit without waiting in long queues.
          </p>

          <div className="hero-features">
            <div>
              <span className="feature-icon">✓</span>
              Easy booking
            </div>

            <div>
              <span className="feature-icon">✓</span>
              Quick confirmation
            </div>

            <div>
              <span className="feature-icon">✓</span>
              Secure records
            </div>
          </div>
        </div>


        {/* Booking card */}
        <div className="booking-card">

          <div className="booking-header">
            <div>
              <span className="card-eyebrow">
                {editAppointment ? "EDIT APPOINTMENT" : "BOOK AN APPOINTMENT"}
              </span>

              <h2>
                {editAppointment
                  ? "Update your appointment"
                  : "Schedule your visit"}
              </h2>
            </div>

            <div className="calendar-icon">
              
            </div>
          </div>


          <form onSubmit={handleSubmit} className="appointment-form">

            {/* Patient name */}
            <div className="form-group">
              <label>Patient Name</label>

              <input
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(event) => setName(event.target.value)}
              />
            </div>


            {/* Department */}
            <div className="form-group">
              <label>Department</label>

              <select
                value={department}
                onChange={(event) =>
                  setDepartment(event.target.value)
                }
              >
                <option value="">Select a department</option>
                <option>Dental</option>
                <option>Eye Clinic</option>
                <option>General Medicine</option>
              </select>
            </div>


            {/* Date and appointment slots */}
<div className="form-group">

  {/* Patient chooses the appointment date */}
  <label>Date</label>

  <input
    type="date"
    value={date}
    onChange={(event) => {
      // Save the selected date
      setDate(event.target.value);

      // Clear the previously selected time
      // because the available slots may change
      setTime("");
    }}
  />

</div>


{/* Show appointment slots only after a date is selected */}
{date && (
  <div className="slot-section">

    {/* Heading for the available times */}
    <label>Available Time Slots</label>

    <div className="slot-grid">

      {/* Go through every available slot */}
      {getAvailableSlots().map((slot) => (

        <button
          key={slot}
          type="button"

          // When the patient clicks a slot,
          // save that time as the appointment time
          onClick={() => setTime(slot)}

          // Add "selected" styling to the chosen slot
          className={`slot-button ${
            time === slot ? "selected" : ""
          }`}
        >
          {slot}
        </button>

      ))}

    </div>


    {/* Tell the patient when no slots are available */}
    {getAvailableSlots().length === 0 && (
      <p className="no-slots">
        No appointment slots are available for this date.
      </p>
    )}

  </div>
)}

            {/* Message */}
            {message && (
              <div className="message">
                {message}
              </div>
            )}


            {/* Buttons */}
            <div className="form-actions">

              <button
                type="submit"
                className="primary-button"
                disabled={submitting}
              >
                {submitting
                  ? "Submitting..."
                  : editAppointment
                    ? "Update Appointment"
                    : "Book Appointment"}
              </button>


              {editAppointment && (
                <button
                  type="button"
                  className="cancel-button"
                  onClick={() => {
                    setEditAppointment(null);
                    setName("");
                    setDepartment("");
                    setDate("");
                    setTime("");
                    setMessage("");
                  }}
                >
                  Cancel Edit
                </button>
              )}

            </div>

          </form>

        </div>

      </section>


      {/* Appointments section */}
      <section className="appointments-section">

        <div className="section-heading">
          <div>
            <span className="eyebrow">YOUR BOOKINGS</span>
            <h2>Appointments</h2>
          </div>

          <span className="appointment-count">
            {appointments.length} total
          </span>
        </div>


        {/* Search and filter */}
        <div className="appointment-controls">

          <div className="search-box">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search patient name..."
              value={searchName}
              onChange={(event) =>
                setSearchName(event.target.value)
              }
            />
          </div>


          <select
            value={filterDepartment}
            onChange={(event) =>
              setFilterDepartment(event.target.value)
            }
          >
            <option value="">All Departments</option>
            <option value="Dental">Dental</option>
            <option value="Eye Clinic">Eye Clinic</option>
            <option value="General Medicine">
              General Medicine
            </option>
          </select>

        </div>


        {/* Loading */}
        {loading && (
          <div className="empty-state">
            <div className="loading-spinner"></div>
            <p>Loading appointments...</p>
          </div>
        )}


        {/* No appointments */}
        {!loading && appointments.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <h3>No appointments yet</h3>
            <p>
              Your booked appointments will appear here.
            </p>
          </div>
        )}


        {/* Appointment list */}
        {!loading &&
          appointments
            .filter((appointment) => {

              const matchesDepartment =
                !filterDepartment ||
                appointment.department === filterDepartment;

              const matchesName =
                appointment.name
                  .toLowerCase()
                  .includes(searchName.toLowerCase());

              return matchesDepartment && matchesName;
            })

            .sort((a, b) => {

              const appointmentA =
                new Date(`${a.date}T${a.time}`);

              const appointmentB =
                new Date(`${b.date}T${b.time}`);

              return appointmentA - appointmentB;
            })

            .map((appointment) => (

              <div
                key={appointment._id}
                className="appointment-card"
              >

                <div className="appointment-main">

                  <div className="appointment-avatar">
                    {appointment.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3>{appointment.name}</h3>

                    <span className="department-badge">
                      {appointment.department}
                    </span>
                  </div>

                </div>


                <div className="appointment-details">

                  <div>
                    <span className="detail-label">
                      DATE
                    </span>

                    <strong>
                      {appointment.date}
                    </strong>
                  </div>

                  <div>
                    <span className="detail-label">
                      TIME
                    </span>

                    <strong>
                      {appointment.time}
                    </strong>
                  </div>

                </div>


                <div className="appointment-actions">

                  <button
                    className="edit-button"
                    onClick={() =>
                      handleEdit(appointment)
                    }
                  >
                    Edit
                  </button>

                  <button
                    className="delete-button"
                    onClick={() =>
                      handleDelete(appointment._id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))}

      </section>

    </main>


    {/* Footer */}
    <footer className="footer">
      <p>
        Clinic Appointment System © 2026 · Helping patients spend less time
        waiting and more time getting care.
      </p>
    </footer>

  </div>
);
};
export default App;