# Store Rating Platform

Users can rate stores from 1 to 5. Three roles — admin, user, owner. Single login for everyone.

## Tech

- Backend: NestJS, TypeORM, PostgreSQL, JWT, bcrypt
- Frontend: React, Vite, axios, react-router-dom, CSS

## Setup

```
git clone https://github.com/yashwanth2307/roxlier-project.git
```

Create a PostgreSQL database:
```
CREATE DATABASE store_ratings;
```

Update `backend/.env` with your DB password.

Start backend:
```
cd backend
npm install
npm run start:dev
```

Start frontend:
```
cd frontend
npm install
npm run dev
```

Open http://localhost:5173

## Default Login

- Email: admin@admin.com
- Password: Admin@123
