# Store Rating Platform - Developer Notes

This document is for your personal understanding of the codebase and technology stack used in the project.

## Technology Stack

### Backend
- **Framework**: [NestJS](https://nestjs.com/) (A progressive Node.js framework for building efficient, scalable server-side applications)
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM (Object-Relational Mapping)**: [TypeORM](https://typeorm.io/) (Used to interact with PostgreSQL using TypeScript classes instead of raw SQL queries)
- **Authentication**: JWT (JSON Web Tokens) using `@nestjs/passport` and `passport-jwt`
- **Security & Hashing**: `bcrypt` (for securely hashing user passwords before saving them to the database)
- **Validation**: `class-validator` and `class-transformer` (for validating incoming data like email formats and password strength)

### Frontend
- **Framework**: [React](https://react.dev/)
- **Build Tool**: [Vite](https://vitejs.dev/) (Extremely fast frontend build tool)
- **Language**: JavaScript (JSX)
- **Routing**: `react-router-dom` (For handling navigation between pages without reloading the browser)
- **HTTP Client**: `axios` (For making API requests to the NestJS backend)
- **Styling**: Vanilla CSS (Using CSS variables for consistent theming and a clean, dependency-free design)

---

## Codebase Structure

### Backend Architecture (`backend/src/`)
NestJS follows a modular architecture. Each feature is encapsulated in its own module:

1. **Auth Module (`auth/`)**: 
   - Handles login, signup, password changing, and JWT verification.
   - Contains the `RolesGuard` which checks if a user has permission (Admin, Owner, Normal User) to access specific routes.
2. **Users Module (`users/`)**: 
   - Defines the `User` entity (database table).
   - Handles listing, filtering, and creating users.
3. **Stores Module (`stores/`)**: 
   - Defines the `Store` entity.
   - Handles creating and listing stores. Includes logic for the "Owner Dashboard" to find stores assigned to a specific owner.
4. **Ratings Module (`ratings/`)**: 
   - Defines the `Rating` entity.
   - Handles submitting new ratings, updating existing ones, and calculating the average rating for a store.

### Frontend Architecture (`frontend/src/`)
React is structured into reusable components and pages:

1. **Pages (`pages/`)**: 
   - These represent full screens (e.g., `Login.jsx`, `AdminDashboard.jsx`, `UserStores.jsx`).
   - Each page is mapped to a URL in `App.jsx`.
2. **Components (`components/`)**: 
   - Reusable UI blocks like `Navbar.jsx`, `StoreTable.jsx`, and `RatingStars.jsx`.
   - `ProtectedRoute.jsx` wraps around pages to prevent unauthorized access (e.g., kicking a normal user out of the Admin dashboard).
3. **Context (`context/`)**: 
   - `AuthContext.jsx` holds the global authentication state. It stores the currently logged-in user and their JWT token in `localStorage` so they stay logged in after refreshing the page.
4. **Helpers (`helpers/`)**: 
   - `api.js` configures `axios` to automatically attach the JWT token to every request sent to the backend.

---

## How Data Flows

1. **User Action**: The user clicks a button on the frontend (e.g., "Submit Rating").
2. **API Call**: React uses `axios` to send a `POST` request to `http://localhost:3000/ratings`.
3. **Backend Authentication**: NestJS receives the request, verifies the JWT token (to ensure the user is logged in), and checks their role.
4. **Service Logic**: The Controller passes data to the Service, which uses TypeORM to save the rating into PostgreSQL.
5. **Response**: The backend sends a success response back to React.
6. **UI Update**: React updates the UI to show the new average rating.
