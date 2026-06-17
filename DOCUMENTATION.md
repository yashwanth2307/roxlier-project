# Store Rating Platform - Project Documentation

## 1. Overview

This is a full-stack web application where users can submit 1-5 star ratings for stores. There's a single login system for all users, and based on their role they see different pages.

Repo: https://github.com/yashwanth2307/roxlier-project

---

## 2. Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Backend    | NestJS (Node.js framework)          |
| Language   | TypeScript (backend — NestJS requires it for decorators), JavaScript (frontend) |
| Database   | PostgreSQL                          |
| ORM        | TypeORM                             |
| Auth       | JWT via Passport                    |
| Hashing    | bcrypt                              |
| Validation | class-validator, class-transformer  |
| Frontend   | React (with Vite as build tool)     |
| HTTP       | axios                               |
| Routing    | react-router-dom                    |
| Styling    | Vanilla CSS                         |

NestJS is built around TypeScript decorators like @Controller(), @Injectable(), @Entity() — these don't exist in plain JavaScript. That's why the backend uses .ts files. The frontend is fully JavaScript (.jsx files).

---

## 3. Database Schema

### users table

| Column     | Type         | Constraints               |
|------------|-------------|---------------------------|
| id         | int (PK)    | auto-increment            |
| name       | varchar(60) | not null                  |
| email      | varchar(255)| unique, not null          |
| password   | varchar(255)| not null (bcrypt hashed)  |
| address    | varchar(400)| not null                  |
| role       | enum        | 'admin', 'user', 'owner' |
| created_at | timestamp   | auto-generated            |

### stores table

| Column     | Type         | Constraints                     |
|------------|-------------|----------------------------------|
| id         | int (PK)    | auto-increment                   |
| name       | varchar(60) | not null                         |
| email      | varchar(255)| unique, not null                 |
| address    | varchar(400)| not null                         |
| owner_id   | int (FK)    | nullable, references users(id), ON DELETE SET NULL |
| created_at | timestamp   | auto-generated                   |

### ratings table

| Column     | Type      | Constraints                              |
|------------|----------|------------------------------------------|
| id         | int (PK) | auto-increment                            |
| user_id    | int (FK) | references users(id), ON DELETE CASCADE   |
| store_id   | int (FK) | references stores(id), ON DELETE CASCADE  |
| value      | int      | 1 to 5                                    |
| created_at | timestamp| auto-generated                            |
| updated_at | timestamp| auto-updated                              |

UNIQUE constraint on (user_id, store_id) so one user can only rate a store once.

### Relationships

- A user can have many ratings (one-to-many)
- A store can have many ratings (one-to-many)
- A store has one optional owner (many-to-one with users)
- If a user is deleted, their ratings are also deleted (CASCADE)
- If a store is deleted, its ratings are also deleted (CASCADE)
- If an owner user is deleted, the store's owner_id becomes null (SET NULL)

---

## 4. API Endpoints

### Auth Routes (no guard needed for login/signup)

| Method | URL                   | Body                                    | Response                  | Who can access |
|--------|-----------------------|-----------------------------------------|---------------------------|----------------|
| POST   | /auth/login           | { email, password }                     | { token, user }           | anyone         |
| POST   | /auth/signup          | { name, email, password, address, role }| { token, user }           | anyone         |
| PUT    | /auth/change-password | { currentPassword, newPassword }        | { message }               | logged in user |
| GET    | /auth/me              | -                                       | user object (no password) | logged in user |
| GET    | /auth/dashboard/stats | -                                       | { users, stores, ratings }| admin          |
| GET    | /auth/owner/store     | -                                       | store + ratings array     | owner          |

### User Routes (admin only)

| Method | URL                                              | Body / Params             | Response       |
|--------|--------------------------------------------------|---------------------------|----------------|
| GET    | /users?name=&email=&address=&role=&sortBy=&order= | query params              | array of users |
| GET    | /users/:id                                       | -                         | single user    |
| POST   | /users                                           | { name, email, password, address, role } | created user |
| PUT    | /users/:id                                       | partial update fields     | updated user   |
| DELETE | /users/:id                                       | -                         | -              |

### Store Routes (all logged in users)

| Method | URL                                          | Body / Params          | Response        |
|--------|----------------------------------------------|------------------------|-----------------|
| GET    | /stores?name=&address=&sortBy=&order=        | query params           | array of stores (with averageRating and userRating) |
| GET    | /stores/:id                                  | -                      | single store    |
| POST   | /stores                                      | { name, email, address, ownerId } | created store (admin only) |
| PUT    | /stores/:id                                  | partial update fields  | updated store (admin only) |
| DELETE | /stores/:id                                  | -                      | - (admin only)  |
| GET    | /stores/:id/ratings                          | -                      | array of ratings|

### Rating Routes (logged in users)

| Method | URL              | Body               | Response       |
|--------|------------------|---------------------|----------------|
| POST   | /ratings         | { storeId, value }  | created rating |
| PUT    | /ratings/:id     | { value }           | updated rating |
| GET    | /ratings/my      | -                   | user's ratings |
| GET    | /ratings/store/:storeId | -            | store's ratings|

---

## 5. Validation Rules

These are enforced on both backend (class-validator) and frontend (helpers/validators.js):

| Field    | Rule                                                              |
|----------|-------------------------------------------------------------------|
| Name     | min 20 characters, max 60 characters                              |
| Email    | must be a valid email format                                      |
| Password | 8-16 characters, at least 1 uppercase letter, at least 1 special character |
| Address  | max 400 characters                                                |

---

## 6. User Roles and What They Can Do

### Admin
- Sees a dashboard with total users, stores, and ratings counts
- Can view, filter, and sort a list of all users
- Can add new users with any role (admin, user, owner)
- Can view, filter, and sort a list of all stores
- Can add new stores and assign an owner to them
- Can change their own password

### Normal User
- Can register themselves via the signup page
- Can browse all stores and search by name or address
- Can rate any store from 1-5 stars
- Can update their existing rating
- Can change their password

### Store Owner
- Cannot sign up on their own (admin creates their account)
- Sees a dashboard showing their assigned store
- Can see the store's average rating
- Can see a list of all users who rated their store and what they rated
- Can change their password

---

## 7. Frontend Pages

| Page             | Route           | Role   | What it does                                |
|------------------|-----------------|--------|---------------------------------------------|
| Login            | /               | all    | email + password login form                 |
| Signup           | /signup         | public | registration form for normal users          |
| Admin Dashboard  | /admin          | admin  | shows stat cards (users, stores, ratings)   |
| Manage Users     | /admin/users    | admin  | table with filters + sorting + add user     |
| Manage Stores    | /admin/stores   | admin  | table with filters + sorting + add store    |
| Browse Stores    | /stores         | user   | store cards with search + star rating       |
| Owner Dashboard  | /owner          | owner  | store info + avg rating + ratings list      |
| Change Password  | /password       | all    | current password + new password form        |

---

## 8. Frontend Components

| Component       | File                                | Purpose                                    |
|-----------------|-------------------------------------|-------------------------------------------|
| Navbar          | components/Navbar.jsx               | top nav bar, shows links based on role     |
| ProtectedRoute  | components/ProtectedRoute.jsx       | blocks access if user doesn't have the right role |
| UserTable       | components/UserTable.jsx            | sortable table for user data               |
| StoreTable      | components/StoreTable.jsx           | sortable table for store data              |
| RatingStars     | components/RatingStars.jsx          | 5 clickable gold stars                     |
| AddUserForm     | components/AddUserForm.jsx          | modal form to create a new user            |
| AddStoreForm    | components/AddStoreForm.jsx         | modal form to create a new store           |
| AuthContext     | context/AuthContext.jsx             | global state for login/logout/token        |

---

## 9. Backend Modules

NestJS organizes code into modules. Each module has its own entity, DTO, service, controller, and module file.

### Auth Module (auth/)
- auth.controller.ts — login, signup, change password, dashboard stats, owner store endpoints
- auth.service.ts — password verification with bcrypt, JWT token generation, password change logic
- jwt.strategy.ts — Passport JWT strategy that extracts user from token
- roles.guard.ts — checks if the logged-in user has the required role
- roles.decorator.ts — custom decorator to mark endpoints with required roles

### Users Module (users/)
- user.entity.ts — TypeORM entity mapping to the users table
- user.dto.ts — CreateUserDto, UpdateUserDto, UserFilterDto with class-validator decorators
- users.service.ts — CRUD operations, filtering with ILIKE, sorting, admin seed logic
- users.controller.ts — REST endpoints for user management
- users.module.ts — registers the entity and service

### Stores Module (stores/)
- store.entity.ts — TypeORM entity with ManyToOne (owner) and OneToMany (ratings) relations
- store.dto.ts — CreateStoreDto, UpdateStoreDto, StoreFilterDto
- stores.service.ts — CRUD, average rating calculation using QueryBuilder, user-specific rating lookup
- stores.controller.ts — REST endpoints for store management
- stores.module.ts — registers the entity and service

### Ratings Module (ratings/)
- rating.entity.ts — TypeORM entity with unique constraint on (user_id, store_id)
- rating.dto.ts — CreateRatingDto, UpdateRatingDto
- ratings.service.ts — submit, update, find by store/user, count, average calculation
- ratings.controller.ts — REST endpoints for rating operations
- ratings.module.ts — registers the entity and service

---

## 10. How the Auth Flow Works

1. User submits email + password on the login page
2. Backend finds the user by email, compares the password hash using bcrypt
3. If valid, backend generates a JWT token with payload { sub: userId, email, role }
4. Frontend receives { token, user } and stores both in localStorage
5. AuthContext makes the user object available to all components via React Context
6. Every API call goes through the axios interceptor in helpers/api.js which attaches the token as Authorization: Bearer <token>
7. If backend returns 401, the interceptor clears localStorage and redirects to login
8. ProtectedRoute component checks user role before rendering any protected page

---

## 11. How Sorting Works

Tables support clicking column headers to sort.

Frontend side:
- Each table component (UserTable, StoreTable) receives sortBy, order, and onSort props
- Clicking a header calls onSort(fieldName)
- The parent page toggles between ASC and DESC and re-fetches data

Backend side:
- sortBy and order come in as query parameters
- The service builds a TypeORM query with .orderBy() using those params
- For stores, sorting by averageRating uses a computed SQL column

---

## 12. How to Run Locally

Prerequisites: Node.js, PostgreSQL

1. Create a PostgreSQL database called store_ratings
2. Update backend/.env with your DB credentials:
   - DB_HOST=localhost
   - DB_PORT=5432
   - DB_USERNAME=postgres
   - DB_PASSWORD=your_password
   - DB_NAME=store_ratings
   - JWT_SECRET=storeratingsecretkey2024

3. Start the backend:
   cd backend
   npm install
   npm run start:dev

4. Start the frontend:
   cd frontend
   npm install
   npm run dev

5. Open http://localhost:5173

Default admin login: admin@admin.com / Admin@123
