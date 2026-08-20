# Clinic Appointment System

A full-stack clinic appointment-booking application designed to help reduce long queues at Nigerian clinics by allowing patients to choose an available appointment slot before visiting.

## Live Demo

- Frontend: https://clinic-appointment-system-kohl.vercel.app/
- Backend API: https://clinic-appointment-system-1j6p.onrender.com/
- Source code: https://github.com/Yemyze1/clinic-appointment-system

## Problem

Long queues are a common problem in busy clinics. Patients may spend significant time waiting simply to see a healthcare provider. This project provides a simple digital booking flow so patients can choose a date and available time slot in advance.

## MVP Features

- Appointment booking
- Predefined 30-minute appointment slots
- Available-slot filtering based on existing bookings
- Duplicate appointment protection
- Past-date validation
- Edit appointments
- Delete appointments
- Search appointments by patient name
- Filter appointments by department
- Appointments sorted by date and time
- In-app reminder for appointments scheduled for the next day
- MongoDB persistence
- Deployed React frontend and Express backend

## Tech Stack

### Frontend

- React
- Vite
- JavaScript
- CSS

### Backend

- Node.js
- Express
- Mongoose
- CORS
- dotenv

### Database

- MongoDB

### Deployment

- Vercel for the frontend
- Render for the backend
- MongoDB Atlas/database connection for persistence

## Project Structure

```text
clinic-appointment-system/
├── client/          # React + Vite frontend
├── server/          # Express API + MongoDB/Mongoose backend
├── .gitignore
└── README.md
```

## How It Works

1. A patient opens the clinic website.
2. The patient enters their name and department.
3. The patient chooses a date.
4. The application displays available clinic time slots for that date.
5. Already-booked slots are excluded from the available choices.
6. The patient selects a slot and submits the appointment.
7. The React frontend sends the appointment to the Express API.
8. The backend validates the request and checks MongoDB before creating the appointment.
9. The appointment is saved in MongoDB and returned to the frontend.
10. Upcoming appointments can trigger an in-app reminder.

## Local Setup

### 1. Clone the repository

```bash
git clone https://github.com/Yemyze1/clinic-appointment-system.git
cd clinic-appointment-system
```

### 2. Install frontend dependencies

```bash
cd client
npm install
```

### 3. Install backend dependencies

In another terminal:

```bash
cd server
npm install
```

### 4. Configure the backend environment

Create `server/.env`:

```env
MONGODB_URI=your_mongodb_connection_string
```

Never commit the real MongoDB connection string or other secrets to GitHub.

### 5. Start the backend

```bash
cd server
npm start
```

The API runs locally on port `5000`.

### 6. Start the frontend

In another terminal:

```bash
cd client
npm run dev
```

Vite will display the local development URL in the terminal.

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/` | API welcome message |
| GET | `/about` | API description |
| GET | `/appointments` | Get all appointments |
| POST | `/appointments` | Create an appointment |
| PUT | `/appointments/:id` | Update an appointment |
| DELETE | `/appointments/:id` | Delete an appointment |

## Validation and Booking Protection

The application validates appointment details on both the client and server sides. The server checks required fields, rejects past dates, and checks whether a requested date/time is already booked. The backend remains the final authority because client-side validation can be bypassed by sending requests directly to an API.

## Deployment

The current deployment uses:

- Vercel: React frontend
- Render: Express backend

The production frontend communicates with the deployed Render API rather than a local `localhost` server.

## Future Improvements

Possible future versions could add:

- Email or SMS reminders
- Patient accounts and authentication
- Doctor/provider-specific schedules
- Clinic working hours and holidays
- Admin dashboard
- Appointment cancellation workflow
- Role-based access control
- More detailed reporting and analytics

## Demo Video Plan (2–3 minutes)

### 0:00–0:20 — Problem

"Clinic queues can be long, especially in busy Nigerian healthcare facilities. This Clinic Appointment System lets patients book an available time before arriving."

### 0:20–0:50 — Booking

Show the home page. Enter a patient name and department, select a date, and show the available time slots. Select a slot and book the appointment.

Say: "The system only presents available appointment slots, and the backend checks MongoDB to prevent duplicate bookings."

### 0:50–1:20 — Validation

Try selecting an already-booked slot or demonstrate the duplicate-booking protection. Show that past dates and incomplete forms are rejected.

### 1:20–1:50 — Manage appointments

Show the appointment list. Demonstrate search/filtering, edit an appointment, and delete an appointment.

### 1:50–2:15 — Reminder

Show an appointment scheduled for tomorrow and demonstrate the in-app reminder.

### 2:15–2:40 — Technical overview

Briefly show the React frontend, Express API, MongoDB persistence, and deployed frontend/backend URLs.

### 2:40–3:00 — Closing

"The MVP provides appointment slots, booking, reminders, persistent storage, and a deployed web application, with room for future email/SMS reminders and clinic administration features."

## Project Status

**MVP complete and deployed.**
