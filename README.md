# Cloud-Based Emergency Hospital Management System

[![Live Demo](https://img.shields.io/badge/🚀_Live-Demo-success?style=for-the-badge)](https://l04zob-qabhkofu8-arcadawebapps3.vercel.app)

📌 About the Project

The Cloud-Based Emergency Hospital Management System is a web-based healthcare management application designed to help hospitals manage emergency patients quickly and efficiently.

The system provides a centralized platform for managing patients, doctors, emergency cases, hospital beds, appointments, medicines, and medical records.

By using cloud-based architecture, hospital staff can access updated information from different locations and improve emergency response and hospital resource management.

---

🎯 Objectives

- 🚑 Manage emergency patients efficiently.
- 🏥 Track available hospital beds.
- 👨‍⚕️ Manage doctors and medical staff.
- 📋 Maintain patient medical records.
- 💊 Manage medicines and prescriptions.
- 📅 Manage appointments.
- 🔔 Provide emergency case notifications.
- ☁️ Store hospital data using a cloud-ready architecture.
- 🔐 Provide secure login and role-based access.

---

✨ Key Features

👤 Patient Management

- Add new patients.
- Update patient information.
- Search patient records.
- View medical history.
- Manage emergency patient details.

🚨 Emergency Management

- Register emergency cases.
- Record emergency severity.
- Assign doctors.
- Track emergency case status.
- Display priority patients.

🛏️ Bed Management

- View available beds.
- Assign beds to patients.
- Update bed availability.
- Track occupied and available beds.

👨‍⚕️ Doctor Management

- Add doctors.
- View doctor information.
- Assign doctors to emergency cases.
- Manage doctor availability.

💊 Medicine Management

- Add medicines.
- Update medicine stock.
- Track prescriptions.
- Monitor available medicines.

📅 Appointment Management

- Create appointments.
- View upcoming appointments.
- Assign doctors.
- Update appointment status.

📊 Admin Dashboard

The administrator can view:

- Total patients
- Emergency cases
- Available beds
- Occupied beds
- Available doctors
- Medicine stock
- Appointments

---

🏗️ System Architecture

                ┌──────────────────────┐
                │       User           │
                │ Patient / Doctor /   │
                │ Admin / Staff        │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │    Web Frontend      │
                │ HTML / CSS / JS      │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │    Backend API       │
                │ Node.js + Express    │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │     MySQL Database   │
                │ Patients             │
                │ Doctors              │
                │ Emergency Cases      │
                │ Beds                  │
                │ Medicines             │
                │ Appointments          │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │    Cloud Storage     │
                │   / Cloud Server     │
                └──────────────────────┘

---

🛠️ Technologies Used

Frontend

- HTML5
- CSS3
- JavaScript
- Bootstrap

Backend

- Node.js
- Express.js
- REST API

Database

- MySQL

Development Tools

- Visual Studio Code
- Git
- GitHub
- MySQL Workbench / MySQL Command Line

Cloud

The application is designed with a cloud-ready architecture and can be deployed on a cloud server with a managed database.

---

📂 Project Structure

Cloud-Based-Emergency-Hospital-Management-System/
│
├── frontend/
│   ├── index.html
│   ├── login.html
│   ├── dashboard.html
│   ├── patients.html
│   ├── doctors.html
│   ├── emergency.html
│   ├── beds.html
│   ├── medicines.html
│   ├── appointments.html
│   │
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── script.js
│       ├── patients.js
│       ├── doctors.js
│       └── emergency.js
│
├── backend/
│   ├── server.js
│   ├── package.json
│   │
│   ├── routes/
│   │   ├── patients.js
│   │   ├── doctors.js
│   │   ├── emergency.js
│   │   ├── beds.js
│   │   └── appointments.js
│   │
│   ├── controllers/
│   │
│   └── config/
│       └── database.js
│
├── database/
│   └── hospital_management.sql
│
├── screenshots/
│   ├── login.png
│   ├── dashboard.png
│   ├── patients.png
│   └── emergency.png
│
├── .gitignore
└── README.md

---

🗄️ Database Tables

The MySQL database contains the following major tables:

Table| Description
"users"| Login and user information
"patients"| Patient details
"doctors"| Doctor details
"emergency_cases"| Emergency patient information
"beds"| Hospital bed availability
"appointments"| Appointment details
"medicines"| Medicine information
"prescriptions"| Patient prescriptions
"medical_records"| Patient medical history

---

🔐 User Roles

Admin

- Manage users
- Manage doctors
- Manage patients
- Manage beds
- Manage medicines
- View reports

Doctor

- View assigned patients
- View emergency cases
- Update medical records
- Create prescriptions

Hospital Staff

- Register patients
- Manage appointments
- Assign beds
- Update emergency status

---

🚨 Emergency Workflow

Patient Arrives
      ↓
Emergency Registration
      ↓
Severity Assessment
      ↓
Priority Assignment
      ↓
Doctor Assignment
      ↓
Bed Availability Check
      ↓
Treatment
      ↓
Medical Record Update
      ↓
Discharge / Transfer

---

⚙️ Installation and Setup

1. Clone the Repository

git clone https://github.com/your-username/Cloud-Based-Emergency-Hospital-Management-System.git

2. Open the Project

cd Cloud-Based-Emergency-Hospital-Management-System

Open the project in Visual Studio Code.

3. Install Backend Dependencies

cd backend
npm install

4. Configure MySQL

Create a MySQL database:

CREATE DATABASE emergency_hospital;

Import the SQL file:

database/hospital_management.sql

5. Configure Database Connection

Update:

backend/config/database.js

Example:

const mysql = require("mysql2");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "YOUR_PASSWORD",
    database: "emergency_hospital"
});

db.connect((err) => {
    if (err) {
        console.log("Database connection failed");
    } else {
        console.log("MySQL Connected");
    }
});

module.exports = db;

6. Start the Backend

cd backend
node server.js

Or, if a start script is configured:

npm start

The backend will normally run on:

http://localhost:5000

7. Run the Frontend

Open the "frontend/index.html" file using Live Server in VS Code.

Example:

http://127.0.0.1:5500/frontend/

---

🔌 API Endpoints

Example REST API structure:

Method| Endpoint| Purpose
GET| "/api/patients"| Get all patients
POST| "/api/patients"| Add patient
PUT| "/api/patients/:id"| Update patient
DELETE| "/api/patients/:id"| Delete patient
GET| "/api/doctors"| Get doctors
POST| "/api/doctors"| Add doctor
GET| "/api/beds"| Get bed availability
POST| "/api/emergency"| Register emergency case
GET| "/api/emergency"| Get emergency cases
POST| "/api/appointments"| Create appointment

---

📸 Screenshots

Add your project screenshots inside the "screenshots" folder.

Login Page

![Login Page](screenshots/login.png)

Dashboard

![Dashboard](screenshots/dashboard.png)

Patient Management

![Patient Management](screenshots/patients.png)

Emergency Management

![Emergency Management](screenshots/emergency.png)

---

☁️ Cloud Deployment

The system can be deployed using a cloud architecture such as:

                 Internet
                    │
                    ▼
             Cloud Web Server
                    │
                    ▼
             Node.js Backend
                    │
                    ▼
            Cloud MySQL Database
                    │
                    ▼
              Hospital Data

Possible deployment components include:

- Cloud virtual server
- Cloud database
- Object/file storage
- HTTPS
- Environment variables
- Database backups

---

🔒 Security

The system should implement:

- Secure authentication
- Password hashing
- Role-based authorization
- Input validation
- SQL injection protection
- HTTPS in production
- Environment variables for secrets
- Regular database backups

«[!WARNING]
Do not upload real patient medical information, passwords, API keys, or database credentials to a public GitHub repository.»

---

🚀 Future Enhancements

- 🤖 AI-based emergency severity prediction
- 📍 GPS-based ambulance tracking
- 🚑 Ambulance management
- 🗺️ Hospital location and navigation
- 📱 Mobile application
- 🔔 SMS/email emergency notifications
- 📊 Advanced hospital analytics
- ☁️ Automatic cloud backup
- 🔐 Two-factor authentication
- 🧠 AI-assisted hospital resource prediction

---

🎓 Project Use

This project can be used as a:

- College mini project
- Final-year project
- Cloud computing project
- Web technology project
- Database management project
- Healthcare management project

---

👨‍💻 Developer

Dinesh M

Cloud-Based Emergency Hospital Management System

---

📄 License

This project is developed for educational and academic purposes.

---

⭐ Support

If you find this project useful, consider giving the repository a ⭐ on GitHub.   
