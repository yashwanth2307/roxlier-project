# Store Rating Platform

A full-stack web app where users can rate stores. Built with NestJS + PostgreSQL on the backend and React on the frontend.

## Tech Stack

**Backend:** NestJS, TypeORM, PostgreSQL, JWT auth with Passport, bcrypt  
**Frontend:** React (Vite), axios, react-router-dom, vanilla CSS

## Project Structure

```
backend/
  src/
    auth/         - login, signup, JWT, role guards
    users/        - user CRUD, filtering, sorting
    stores/       - store CRUD, avg rating calculation
    ratings/      - submit/update ratings
    
frontend/
  src/
    pages/        - Login, Signup, AdminDashboard, UserStores, etc.
    components/   - Navbar, UserTable, StoreTable, RatingStars, etc.
    context/      - AuthContext (manages logged-in state)
    helpers/      - axios config, form validators
```

## How to Run

1. Make sure PostgreSQL is running and create a database called `store_ratings`
2. Update `backend/.env` with your DB credentials

```bash
cd backend
npm install
npm run start:dev
```

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:3000`, frontend on `http://localhost:5173`

## Default Admin

Email: `admin@admin.com`  
Password: `Admin@123`

Gets created automatically on first startup.

## Database

Three main tables — `users`, `stores`, `ratings`. Users have roles (admin/user/owner). Stores can have an owner. Ratings link a user to a store with a value from 1–5. There's a unique constraint so each user can only rate a store once.
