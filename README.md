# Store Rating Platform

A full-stack web app where Normal Users rate registered Stores (1-5), Store Owners track their ratings, and a System Administrator manages the whole platform. Built for the FullStack Intern Coding Challenge.

**Stack:** Express.js · PostgreSQL (Sequelize ORM) · React (Vite) · Tailwind CSS · JWT auth

---

## 1. Project Structure

```
store-rating-app/
├── backend/                  Express API
│   ├── config/database.js    Sequelize/Postgres connection
│   ├── models/                User, Store, Rating + associations
│   ├── controllers/           Business logic per role
│   ├── routes/                 auth / admin / stores / owner
│   ├── middleware/            JWT auth, role authorization, error handler
│   ├── utils/                  Shared validators, JWT helpers
│   ├── seed/seedAdmin.js       Creates the first System Administrator
│   └── server.js               Entry point
└── frontend/                 React app (Vite)
    └── src/
        ├── pages/admin/       Dashboard, Users, Add User, User Detail, Stores, Add Store
        ├── pages/user/        Store browsing + rating
        ├── pages/owner/       Store Owner dashboard
        ├── components/        Navbar, SortableTable, StarRating, ProtectedRoute
        └── context/            Auth state (JWT + user)
```

## 2. Database Schema

- **users**: `id, name (20-60 chars), email (unique), password (bcrypt hash), address (≤400 chars), role (admin|user|owner), created_at, updated_at`
- **stores**: `id, name, email (unique), address, owner_id → users.id (nullable), created_at, updated_at`
- **ratings**: `id, user_id → users.id, store_id → stores.id, rating (1-5), created_at, updated_at` — unique constraint on `(user_id, store_id)` so each user has exactly one rating per store (submitting again modifies it).

A store's **overall rating** and a store owner's **rating** are both computed on read (`AVG(ratings.rating)`), not stored redundantly.

## 3. Setup

### Prerequisites
- Node.js 18+
- PostgreSQL database (e.g. Supabase connection pooler on port 5432)

### Backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env with your Supabase credentials:
# Copy the pooler connection string from Supabase Console -> Project Settings -> Database -> Connection Pooling (Session Mode, port 5432)
```

*(No `createdb` step is needed because Supabase provides the `postgres` database out of the box).*

Start the server (this also auto-creates/syncs the tables):

```bash
npm run dev      # nodemon, auto-restart
# or: npm start
```

Seed the first System Administrator account (reads credentials from `.env`):

```bash
npm run seed
```

Default seeded login: `admin@storerating.com` / `Admin@1234` (change these in `.env` before seeding if you want different values).

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Visit `http://localhost:5173`. The Vite dev server proxies `/api` requests to `http://localhost:5000` (configured in `vite.config.js`), so both servers need to be running.

## 4. How the Roles Work

| Role | How the account is created | Entry point after login |
|---|---|---|
| **System Administrator** | Seeded once via `npm run seed`; further admins created by an existing admin | `/admin` |
| **Normal User** | Self-registers via the Sign Up page | `/stores` |
| **Store Owner** | Created by an admin (Add User → role "Store Owner"), then optionally linked to a store when the admin creates that store | `/owner` |

A Store Owner account with no store linked yet will see a friendly "no store associated" message on their dashboard until an admin assigns one.

## 5. Form Validation Rules (enforced on both client and server)

- **Name:** 20-60 characters
- **Address:** up to 400 characters
- **Password:** 8-16 characters, at least one uppercase letter and one special character
- **Email:** standard email format
- **Rating:** integer 1-5

## 6. API Overview

All protected routes require `Authorization: Bearer <token>`.

```
POST   /api/auth/signup            Normal User self-registration
POST   /api/auth/login             Any role
PUT    /api/auth/password          Change own password (any role)
GET    /api/auth/me                Current user info

GET    /api/admin/dashboard        Total users / stores / ratings
POST   /api/admin/users            Create user (any role)
GET    /api/admin/users            List + filter (name/email/address/role) + sort
GET    /api/admin/users/:id        User detail (includes rating if Store Owner)
POST   /api/admin/stores           Create store (optional ownerId)
GET    /api/admin/stores           List + filter (name/email/address) + sort
GET    /api/admin/owners           List users with role "owner" (for the Add Store form)

GET    /api/stores                 Normal User: browse/search stores (name/address) + sort
POST   /api/stores/:storeId/ratings  Submit a rating
PUT    /api/stores/:storeId/ratings  Modify an existing rating

GET    /api/owner/dashboard        Store Owner: raters list + average rating
```

## 7. What Was Tested

The full flow was run end-to-end against a live PostgreSQL instance: admin login → create Store Owner → create Store (linked to owner) → Normal User signup → browse/search stores → submit rating → modify rating → change password → Store Owner login → owner dashboard reflects the new rating → admin user detail reflects the owner's rating → filtering/sorting on both users and stores → role-based route blocking (403) → weak-password rejection (400). All passed. `npm run build` for the frontend also completes cleanly with no errors.

## 8. Notes / Possible Extensions

- `sequelize.sync({ alter: true })` is used for convenience in this challenge; a production setup would use migrations instead.
- Admin can assign a Store Owner to a store only from existing "Store Owner"-role users — create the owner account first via **Add User**, then reference them in **Add Store**.
- Table sorting is done client-driven (click a column header) with the actual sort executed server-side via query params, per the "all tables should support sorting" requirement.
