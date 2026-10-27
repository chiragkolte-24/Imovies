# IMovies — React + Express + MongoDB

## Requirements
- Node.js 20.19+ or 22.12+ (recommended for Vite)
- MongoDB Community Server running locally, or a MongoDB Atlas connection string
- VS Code

## 1. Open this folder in VS Code
Open the **imovies_project** folder, not its parent. Open two terminals.

## 2. Backend (Terminal 1)
```powershell
cd server
Copy-Item .env.example .env
npm install
npm run seed
npm run dev
```
Edit `server/.env` before starting: set a long random `JWT_SECRET` and update `MONGODB_URI` if you use Atlas. Change `ADMIN_PASSWORD` for the demo admin. Seed creates six sample movies and an admin account; it will not overwrite existing movies or users.

Backend health: http://localhost:5000/api/health

## 3. Frontend (Terminal 2)
From the project root:
```powershell
cd client
npm install
npm run dev
```
Open http://localhost:5173

If you already are inside client or server, do not `cd` into that folder again. Use `pwd` to check.

## Demo features
- Register and log in
- Browse/search movies
- Choose a show and up to 8 seats
- Confirm a demo booking (no real payment)
- View and cancel upcoming bookings
- Admin login: email/password from `server/.env`, then use **Add Movie**

## Common issues
- `ENOENT package.json`: run npm commands inside `client` or `server`, not their parent.
- MongoDB connection refused: start MongoDB service, or use a valid Atlas connection string.
- Port in use: stop the other process or adjust the ports and `CLIENT_ORIGIN`/`VITE_API_URL`.
- No movies: run `npm run seed` inside `server`.
- API unavailable: start the backend in a separate terminal.

## API routes
- GET `/api/health`
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/auth/me` (Bearer token)
- GET `/api/movies`
- GET `/api/movies/:id`
- POST `/api/movies` (admin)
- GET `/api/bookings/mine` (authenticated)
- POST `/api/bookings` (authenticated)
- PATCH `/api/bookings/:id/cancel` (authenticated)

## Project limitations
College-project MVP. No payment gateway, emails, production transaction guarantees, or advanced admin show management. For production, add MongoDB transactions around booking creation and cancellation, rate limiting, input validation, and stronger session security.
