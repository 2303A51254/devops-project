# Hotel Management System

A full-stack MERN hotel booking website with:

- Multi-page React frontend
- Express + MongoDB backend
- Guest and authenticated bookings
- Admin dashboard for rooms, availability, bookings, and customers

## Structure

- `client` - React + Vite frontend
- `server` - Express + MongoDB API

## Quick Start

1. Install dependencies:

```bash
npm run install:all
```

2. Create environment file:

```bash
copy server\\.env.example server\\.env
```

3. Update `MONGODB_URI` and `JWT_SECRET` in `server/.env`

4. Start backend:

```bash
npm run dev:server
```

5. Start frontend:

```bash
npm run dev:client
```

## Demo Accounts

Seed data creates:

- Admin: `admin@aurorastay.com` / `Admin@123`
- Customer: `guest@aurorastay.com` / `Guest@123`

## Notes

- Online payment is a placeholder flow in v1.
- Inventory is tracked by room type quantity.
- If the database is empty, the server seeds starter content automatically.
