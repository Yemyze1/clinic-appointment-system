import { useState, useEffect } from "react";



function App() {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [appointments, setAppointments] = useState([]);

    function loadAppointments() {
     fetch("http://localhost:5000/appointments")
      .then((response) => response.json())
      .then((data) => { console.log(data);
        setAppointments(data);
      });
  };

useEffect(() => { 
  loadAppointments();
}, [])
  
// handles the submission of the appointment form
  function handleSubmit(event) {

          event.preventDefault();

    const appointment = {
      name,
      department,
      date,
      time
    };
    
    
    fetch("http://localhost:5000/appointments", {
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

  })};

// handles the deletion of an appointment by its ID
  function handleDelete(id) {

  fetch(`http://localhost:5000/appointments/${id}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then((data) => {
      setMessage(data.message);
      loadAppointments();
    });

}
  return (
    <div style={{ padding: "20px", fontFamily: "Arial", color: "ash" }}>
      <h1 style={{color: "white"}}>Clinic Appointment System</h1>

      <form onSubmit={handleSubmit} style={{border: "solid 20px blue", color: "white"}}>
        <div>
          <label>Patient Name</label>
          <br />
          <input type="text" placeholder="Enter your name"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
          }}
          />
        </div>

        <br />

        <div>
          <label>Department</label>
          <br />
          <select value={department} onChange={(event) => 
            setDepartment(event.target.value)}>
            <option>Select Department</option>
            <option>Dental</option>
            <option>Eye Clinic</option>
            <option>General Medicine</option>
          </select>
        </div>

        <br />

        <div>
          <label>Date</label>
          <br />
          <input type="date" value={date} onChange={(event) =>
            {setDate(event.target.value);

            }
          }/>
        </div>

        <br />

        <div>
          <label>Time</label>
          <br />
          <input type="time" value={time} 
          onChange={(event)=> {setTime(event.target.value)}
          }/>
        </div>

        <br />

        <button style={{border: "round 20px white", background: "blue"}}
         type="submit">Book Appointment</button>
      </form>

<h2>Appointments</h2>

{appointments.map((appointment) => (
  <div key={appointment.id}>
    <p><strong>Name:</strong> {appointment.name}</p>
    <p><strong>Department:</strong> {appointment.department}</p>
    <p><strong>Date:</strong> {appointment.date}</p>
    <p><strong>Time:</strong> {appointment.time}</p>

    <button onClick={() => handleDelete(appointment.id)}>
  Delete
</button>

    <hr />
  </div>
))}

      <p>{message}</p>

      <p>Hello, {name} </p>
      
    </div>
  );
};


export default App;