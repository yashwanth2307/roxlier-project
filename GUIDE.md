# How the Platform Works

Quick reference for how things work end to end.

## Roles

There are 3 roles — `admin`, `user`, `owner`. Everyone logs in from the same page, and the app redirects them based on their role.

- **admin** — can see dashboard stats, manage users and stores, add new users of any role, add stores and assign owners
- **user** — can sign up on their own, browse stores, rate them 1-5 stars, update their rating later
- **owner** — gets created by an admin, sees their own store's avg rating and who rated it

All roles can change their password.

## How Ratings Work

When a user opens the stores page, the backend returns each store with its average rating. It also checks if the current user already rated that store. If they did, the frontend shows their existing rating and lets them change it. If not, clicking a star creates a new rating.

The average gets recalculated every time the store list loads — it's not stored anywhere, it's computed on the fly using a SQL AVG query.

## Auth Flow

Login hits `POST /auth/login`, gets back a JWT token + user object. Token goes into localStorage. Every API call after that sends the token in the Authorization header (axios interceptor handles this). If the backend returns 401, the interceptor clears everything and sends the user back to login.

Protected routes on the frontend check the user's role before rendering. If someone tries to access `/admin` without admin role, they get redirected.

## Sorting and Filtering

Both the users table and stores table support server-side sorting. Click any column header to toggle between ASC and DESC. The frontend sends `sortBy` and `order` as query params, and the backend uses them in the TypeORM query.

Filters (name, email, address, role) also go as query params and the backend does ILIKE matching for text fields.
