# Platform Functioning Guide

This guide explains how the Store Rating Platform works from a functional perspective. It covers the different user roles, their capabilities, and how the system processes data.

## 1. User Roles and Access

The platform has a single, unified login system, but users are divided into three distinct roles. When a user logs in, the system checks their role and grants access to specific features.

### A. System Administrator (`admin`)
The admin has full oversight of the platform.
- **Dashboard**: Sees real-time statistics (total users, total stores, total ratings).
- **Manage Users**: Can view a table of all users, filter them by name, email, address, or role, and sort them. They can also manually add new users of *any* role (including other admins).
- **Manage Stores**: Can view all stores, filter them, and add new stores. When adding a store, the admin can optionally assign a "Store Owner" to that store.

### B. Normal User (`user`)
Normal users are the consumers who rate stores.
- **Registration**: This is the only role that can sign up on their own via the public Signup page.
- **Store Browsing**: They can view the list of all registered stores and search by name or address.
- **Rating System**: Users can submit a 1 to 5-star rating for any store. If they have already rated a store, they see their existing rating and can modify it. A user can only have *one active rating per store* (handled by a unique constraint in the database).

### C. Store Owner (`owner`)
Store owners manage their assigned business. They cannot sign up themselves; an Admin must create their account and assign a store to them.
- **Owner Dashboard**: When logged in, they see details of the specific store assigned to them.
- **Analytics**: They can see their store's overall average rating.
- **Customer Feedback**: They can view a list of all users who have rated their store, the specific rating value, and the date it was submitted.

*(All roles have the ability to securely change their password while logged in).*

---

## 2. Core Workflows

### The Rating Workflow
1. A Normal User logs in and navigates to the "Stores" page.
2. The frontend requests the list of stores. The backend calculates the **Average Rating** for each store dynamically. It also checks if the *currently logged-in user* has a rating for each store, and attaches that specific value (`myRating`).
3. The user clicks a star on the `RatingStars` component.
4. If `myRating` is empty, it sends a `POST` request to create a new rating. If `myRating` exists, it sends a `PUT` request to update the existing rating.
5. The frontend automatically refreshes the store list so the user sees the updated Average Rating immediately.

### The Admin Addition Workflow
1. When the Admin clicks "+ Add Store", a modal opens.
2. The frontend fetches a list of all users with the `owner` role.
3. The Admin fills out the store details and optionally selects one of the owners from a dropdown.
4. Upon submission, the store is created in the database with a foreign key linking it to the selected owner's User ID.

### The Authentication Workflow
1. When any user logs in, the backend verifies their password and generates a **JWT (JSON Web Token)**.
2. The frontend saves this token in the browser's `localStorage`.
3. For every subsequent API request (like viewing stores or submitting ratings), the frontend automatically attaches this token in the `Authorization: Bearer <token>` header.
4. If a user tries to access a page they shouldn't (e.g., a Normal User trying to view the Admin Dashboard), the `ProtectedRoute` component in React intercepts them and redirects them to their correct home page.
5. If the token expires or is invalid, the backend returns a `401 Unauthorized` error. The frontend's `api.js` interceptor catches this, clears the local storage, and kicks the user back to the login screen.
