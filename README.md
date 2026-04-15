# Satya Sai Medico — Hospital Website 🏥

A full-stack hospital website built with **React.js**, **Tailwind CSS**, **Spring Boot**, and **MySQL**.

## Features

- 🏠 **Home Page** — Hospital introduction, services, doctor info
- 💊 **Wholesale Medicines** — Medicine catalog with WhatsApp contact
- 👨‍⚕️ **Doctor Schedule** — Day-wise doctor timetable
- 📅 **Appointment Booking** — Book appointments with OTP verification
- ⚙️ **Admin Panel** — Manage doctors, services, medicines, appointments

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js + Tailwind CSS + Axios |
| Backend | Java 21 + Spring Boot 3 + JPA/Hibernate |
| Database | MySQL 8 |
| Auth | Spring Security + JWT |

## Project Structure

```
├── backend/     → Spring Boot REST API (port 8080)
├── frontend/    → React + Vite app (port 5173)
└── README.md
```

## Getting Started

### Prerequisites
- Java 21+
- Node.js 18+
- MySQL 8

### Backend
```bash
cd backend
mvnw.cmd spring-boot:run
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### MySQL
Create the database:
```sql
CREATE DATABASE satya_sai_medico;
```

## License

This project is for **Satya Sai Medico Hospital**.
