# Personal Finance Tracker

A full-stack web app to track income and expenses, built with React, Node.js, Express, and MongoDB.

## Features

- JWT authentication (register / login)
- Dashboard with balance summary and charts
- Add, edit, and delete transactions
- Filter by type, category, and date range
- Category breakdown (donut chart)
- Profile and password management
- Responsive layout

## Tech Stack

- **Frontend:** React 18, React Router v6, Axios, Formik, Yup, Recharts
- **Backend:** Node.js, Express.js, MongoDB, Mongoose
- **Auth:** JWT, bcryptjs

## Getting Started

### Backend

```bash
cd server
npm install
npm run dev
```

Runs on `http://localhost:5000`

Create `server/.env`:

```
NODE_ENV=development
PORT=5000
MONGO_URI=mongodb://localhost:27017/financetracker
JWT_SECRET=your_secret_here
JWT_EXPIRE=30d
```

### Frontend

```bash
cd client
npm install
npm run dev
```

Runs on `http://localhost:5173`

Create `client/.env`:

```
VITE_API_URL=http://localhost:5000/api
```
