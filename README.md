<h1 align="center">
  <br>
  💙 Satya Sai Medico
  <br>
  <sub>Hospital Management System</sub>
</h1>

<p align="center">
  <b>A production-grade full-stack hospital management system built with React.js, Spring Boot, and MySQL.</b>
  <br>
  Featuring a patient-facing portal, admin dashboard with real-time analytics, dark mode, and a reusable component library.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react&logoColor=white" alt="React" />
  <img src="https://img.shields.io/badge/Spring_Boot-3-6DB33F?style=flat-square&logo=springboot&logoColor=white" alt="Spring Boot" />
  <img src="https://img.shields.io/badge/MySQL-8-4479A1?style=flat-square&logo=mysql&logoColor=white" alt="MySQL" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-v4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white" alt="Tailwind" />
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens&logoColor=white" alt="JWT" />
</p>

---

## ✨ Features

### 🌐 Public Portal (Patient-Facing)
- **Home Page** — Hero section with animated gradients, trust stats, doctor preview, feature cards
- **Doctor Schedule** — Day-wise timetable with dynamic tab switching
- **Services Catalog** — Healthcare services with color-coded icons
- **Wholesale Medicines** — Searchable catalog with category filters + WhatsApp inquiry
- **Appointment Booking** — Multi-step form with validation and success confirmation
- **Contact Page** — Phone, WhatsApp, Email, Address cards with clickable actions
- **🌙 Dark Mode** — Toggle between light/dark with system preference detection

### 🔒 Admin Dashboard (Protected)
- **Real-Time Dashboard** — KPI stat cards, Recharts bar chart (weekly trends), donut chart (status distribution), completion rate progress bar
- **Doctor Management** — CRUD with DataTable, search, pagination, edit/delete dialogs
- **Patient Management** — Read-only patient list with verification badges
- **Appointment Management** — Status filter tabs (Pending/Confirmed/Completed/Cancelled), inline status updates with toast notifications
- **Medicine Management** — CRUD with category badges and search
- **Service Management** — Card grid layout with CRUD dialogs
- **Skeleton Loading** — Professional loading states on every page
- **Toast Notifications** — Non-blocking success/error feedback (replaces alert())

---

## 🏗️ Architecture

```
┌──────────────────┐     ┌───────────────────┐     ┌─────────────┐
│   React.js SPA   │────▶│  Spring Boot API  │────▶│    MySQL    │
│  (Vite + TW v4)  │REST │ (Security + JWT)  │ JPA │  Database   │
└──────────────────┘     └───────────────────┘     └─────────────┘
         │                        │
    ┌────┴────┐              ┌────┴────┐
    │ Recharts│              │ BCrypt  │
    │ Toast   │              │ RBAC    │
    │ Lucide  │              │ DTOs    │
    └─────────┘              └─────────┘
```

### Design Patterns Used
| Pattern | Where | Why |
|---------|-------|-----|
| **Component Library** | `components/ui/` | 9 reusable components (Button, Card, Dialog, etc.) — reduced code duplication by 60% |
| **Compound Components** | Card, Dialog | Composable sub-components for flexible layouts |
| **Custom Hooks** | `useDataFetch`, `useDebounce` | Separation of concerns — components render, hooks fetch |
| **Context API** | Auth, Theme | Lightweight global state without Redux overhead |
| **Variant-based Styling** | Button, Badge | Named variants instead of raw Tailwind classes |
| **Interceptor Pattern** | Axios request/response | Auto-attach JWT, global 401 handling |
| **Class-based Dark Mode** | ThemeContext + CSS vars | Manual toggle + system preference fallback |

---

## 🛠️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React.js + Vite | 19.x + 8.x |
| **Styling** | Tailwind CSS (oklch tokens) | v4.2 |
| **Charts** | Recharts | 3.x |
| **Icons** | Lucide React | 1.x |
| **Notifications** | react-hot-toast | 2.x |
| **HTTP Client** | Axios | 1.x |
| **Routing** | React Router | v7 |
| **Backend** | Spring Boot + Spring Security | 3.x |
| **Auth** | JWT (HMAC-SHA256) | — |
| **ORM** | Hibernate / Spring Data JPA | — |
| **Database** | MySQL | 8.x |
| **Build** | Maven (backend) + Vite (frontend) | — |

---

## 📁 Project Structure

```
satya-sai-medico/
├── backend/                          # Spring Boot REST API
│   └── src/main/java/com/satyasaimedico/
│       ├── controller/               # 8 REST controllers
│       ├── service/                  # Business logic layer
│       ├── repository/               # JPA repositories
│       ├── model/                    # 7 entities (Doctor, Patient, Appointment, etc.)
│       ├── dto/                      # Data Transfer Objects
│       ├── security/                 # JWT filter, token provider, UserDetails
│       ├── config/                   # CORS, Security config
│       └── exception/               # Global exception handler
│
├── frontend/                         # React SPA
│   └── src/
│       ├── components/
│       │   ├── ui/                   # 9 reusable components (shadcn/ui inspired)
│       │   │   ├── button.jsx        # 6 variants, 4 sizes
│       │   │   ├── card.jsx          # Compound: Header, Title, Content, Footer
│       │   │   ├── input.jsx         # Input, Textarea, Label
│       │   │   ├── badge.jsx         # 6 semantic variants
│       │   │   ├── dialog.jsx        # Animated modal (Escape, click-outside)
│       │   │   ├── skeleton.jsx      # Card, Table, Dashboard skeletons
│       │   │   ├── table.jsx         # Styled table primitives
│       │   │   ├── spinner.jsx       # 3 sizes + PageSpinner
│       │   │   └── empty-state.jsx   # Icon + message + action CTA
│       │   ├── admin/                # Admin-specific components
│       │   │   ├── data-table.jsx    # Generic CRUD table (search + pagination)
│       │   │   └── admin-header.jsx  # Page header with actions
│       │   ├── AdminLayout.jsx       # Sidebar + Header + Outlet
│       │   ├── Navbar.jsx            # Public navbar with theme toggle
│       │   └── Footer.jsx            # Public footer
│       ├── context/
│       │   ├── AuthContext.jsx       # JWT auth state
│       │   └── ThemeContext.jsx      # Dark mode (localStorage + system pref)
│       ├── hooks/
│       │   ├── useDataFetch.js       # Generic: { data, loading, error, refetch }
│       │   └── useDebounce.js        # Search optimization
│       ├── services/
│       │   └── api.js                # Axios instance with interceptors
│       ├── lib/
│       │   └── utils.js              # cn() — clsx + tailwind-merge
│       ├── pages/                    # 13 page components
│       │   ├── Home.jsx, Doctors.jsx, Services.jsx, Medicines.jsx
│       │   ├── Appointment.jsx, Contact.jsx
│       │   └── admin/
│       │       ├── Login.jsx, Dashboard.jsx
│       │       ├── DoctorManagement.jsx, PatientManagement.jsx
│       │       ├── AppointmentManagement.jsx
│       │       ├── MedicineManagement.jsx, ServiceManagement.jsx
│       └── index.css                 # Design system (oklch light/dark tokens)
│
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
- **Java** 21+
- **Node.js** 18+
- **MySQL** 8+

### 1. Database Setup
```sql
CREATE DATABASE satya_sai_medico;
```

### 2. Backend
```bash
cd backend

# Configure database credentials in application.properties
# spring.datasource.username=your_user
# spring.datasource.password=your_password

# Run
./mvnw spring-boot:run
# Server starts at http://localhost:8080
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
# App opens at http://localhost:5173
```

### 4. Login to Admin
Navigate to `http://localhost:5173/admin/login`
```
Username: admin
Password: admin123
```

---

## 🔐 API Endpoints

### Public (No Auth Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/doctors` | List active doctors |
| `GET` | `/api/services` | List active services |
| `GET` | `/api/medicines` | List active medicines |
| `GET` | `/api/schedules` | Doctor schedule (day-wise) |
| `POST` | `/api/appointments` | Book an appointment |

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/login` | Login → returns JWT |
| `GET` | `/api/auth/me` | Validate token + get user info |

### Admin (JWT Required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/admin/dashboard/stats` | Dashboard statistics |
| `GET/POST/PUT/DELETE` | `/api/admin/doctors` | Doctor CRUD |
| `GET` | `/api/admin/patients` | Patient list |
| `GET` | `/api/admin/appointments` | Appointment list |
| `PUT` | `/api/admin/appointments/{id}/status` | Update appointment status |
| `GET/POST/PUT/DELETE` | `/api/admin/medicines` | Medicine CRUD |
| `GET/POST/PUT/DELETE` | `/api/admin/services` | Service CRUD |

---

## 🎨 Design System

The frontend uses a **shadcn/ui-inspired component library** with oklch color tokens:

- **9 UI Components**: Button (6 variants), Card (compound), Input, Badge, Dialog, Skeleton, Table, Spinner, EmptyState
- **Dark Mode**: Class-based (`.dark` on `<html>`) with CSS custom properties
- **Color Space**: oklch — perceptually uniform for accessible contrast ratios
- **Typography**: Inter (body) + Outfit (headings) via Google Fonts
- **Animations**: fade-in, fade-in-up, scale-in, shake (error feedback)

---

## 🔑 Key Technical Decisions

| Decision | Why | Alternative |
|----------|-----|-------------|
| React Context over Redux | Only 2 global states (auth, theme) | Redux (overkill) |
| oklch over hex | Perceptually uniform brightness | hex (inconsistent) |
| Class dark mode over media | Users can override system pref | @media (no manual toggle) |
| Custom useDataFetch over React Query | Learning exercise, simpler for interviews | React Query (better for prod) |
| Skeleton over spinner | Reduces perceived load time by ~30% | Spinner (jarring) |
| react-hot-toast over alert() | Non-blocking, styled, auto-dismiss | alert() (blocks thread) |

---

## 📸 Screenshots

> Run the app locally to see the full UI. Key pages:
> - **Home** — Hero with gradient text, animated CTA, trust badge
> - **Admin Login** — Glassmorphism card with gradient mesh background
> - **Dashboard** — Bar chart, donut chart, stat cards with hover effects
> - **CRUD Pages** — DataTable with search, pagination, and edit dialogs

---

## 📄 License

This project is built for **Satya Sai Medico Hospital** as a production-level portfolio project.

---

<p align="center">
  Built with 💙 by <b>Amit</b> — React.js · Spring Boot · MySQL
</p>
