# 🩺 DocSpot — Seamless Appointment Booking for Health

DocSpot is a full-stack doctor appointment booking web application that connects patients with healthcare professionals. It features role-based dashboards for **Patients**, **Doctors**, and **Admins**, enabling seamless appointment scheduling, doctor profile management, and administrative control — all wrapped in a modern, responsive UI.

## ✨ Key Features

- **Patient Dashboard** — Browse available doctors, book appointments, and track appointment history.
- **Doctor Dashboard** — Manage profile, view incoming appointments, and approve/reject bookings.
- **Admin Dashboard** — Oversee all users, doctors, and appointments with full CRUD capabilities.
- **Authentication & Authorization** — Secure JWT-based auth with role-based access control (User / Admin).
- **Security Hardened** — Helmet, rate limiting, XSS protection, and NoSQL injection sanitization built in.
- **Auto Admin Seeding** — A default admin account is seeded on first server start.

---

## 🛠️ Tech Stack

### Frontend

| Technology       | Purpose                        |
| ---------------- | ------------------------------ |
| React 19         | UI library                     |
| Vite 7           | Build tool & dev server        |
| React Router 7   | Client-side routing            |
| Ant Design 6     | UI component library           |
| Axios            | HTTP client for API calls      |
| ESLint           | Code linting                   |

### Backend

| Technology              | Purpose                              |
| ----------------------- | ------------------------------------ |
| Node.js                 | Runtime environment                  |
| Express.js 4            | Web framework                        |
| MongoDB + Mongoose 8    | Database & ODM                       |
| JSON Web Tokens (JWT)   | Authentication                       |
| bcryptjs                | Password hashing                     |
| Helmet                  | HTTP security headers                |
| express-rate-limit      | API rate limiting                    |
| express-mongo-sanitize  | NoSQL injection prevention           |
| xss-clean               | Cross-site scripting protection      |
| express-validator       | Request validation                   |
| dotenv                  | Environment variable management      |
| Nodemon                 | Development auto-restart             |

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or above recommended)
- **npm** (comes with Node.js)
- **MongoDB** — A running MongoDB instance or a MongoDB Atlas connection string

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd DocSpot
```

### 2. Setup Environment Variables

Create a `.env` file inside the `server/` directory using the provided example:

```bash
cp server/.env.example server/.env
```

Then fill in your values:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/docspot?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_key_here
```

### 3. Install Dependencies

**Server:**

```bash
cd server
npm install
```

**Client:**

```bash
cd client
npm install
```

### 4. Run the Application

**Start the backend server:**

```bash
cd server
npm run dev
```

The server will start on `http://localhost:8080` (or the port specified in `.env`).

**Start the frontend dev server (in a separate terminal):**

```bash
cd client
npm run dev
```

The client will start on `http://localhost:5173` by default.

### 5. Build for Production (Optional)

```bash
cd client
npm run build
```

---

## 📁 Project Structure

```
DocSpot/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # React context for auth state
│   │   ├── pages/          # Page-level components
│   │   │   ├── Landing.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── UserDashboard.jsx
│   │   │   ├── DoctorDashboard.jsx
│   │   │   └── AdminDashboard.jsx
│   │   ├── utils/          # Axios config & helpers
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── server/                 # Express backend
│   ├── config/             # Database connection
│   ├── controllers/        # Route handlers
│   ├── middleware/         # Auth, error handling
│   ├── models/            # Mongoose schemas (User, Doctor, Appointment)
│   ├── routes/            # API route definitions
│   ├── utils/             # Token generation, admin seeding
│   ├── validators/        # Request validation rules
│   ├── index.js           # Server entry point
│   └── package.json
│
└── README.md
```

---

## 📡 API Endpoints

| Prefix               | Description              |
| --------------------- | ------------------------ |
| `/api/auth`           | Register, Login, Profile |
| `/api/doctor`         | Doctor CRUD & listings   |
| `/api/appointments`   | Booking & management     |
| `/api/admin`          | Admin-only operations    |
| `/api/v1/health`      | Server health check      |

---

## 📄 License

This project is licensed under the **ISC License**.
