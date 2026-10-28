# 🎬 IMovies — Movie Ticket Booking System

IMovies is a full-stack **MERN** movie-ticket booking application built as a college project. Users can explore movies and showtimes, choose seats, and manage their bookings. An admin interface supports movie management.

> **Project status:** College/demo application. Payment screens may use a simulated payment flow; do not treat them as a production payment gateway.

## Tech Stack

| Layer | Technologies |
| --- | --- |
| Frontend | React, Vite, React Router, CSS, Lucide React |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Authentication | JSON Web Tokens (JWT), bcrypt.js |
| Development | VS Code, npm, nodemon |

## Features

- Browse movies with posters, descriptions, and showtimes.
- Search movies by title (where enabled in the UI).
- Register, log in, and access authenticated routes.
- Select seats using an interactive seat map; booked seats are unavailable.
- View booking history and cancel bookings (subject to backend rules).
- Admin-only movie management.
- Demo payment and confirmation pages, if configured.
- Responsive layout for desktop and mobile.

## Project Structure

```text
IMovies/
├── client/
│   ├── public/
│   │   └── images/             # Optional locally stored posters and banners
│   ├── src/
│   │   ├── components/         # Navbar and reusable components
│   │   ├── context/            # AuthContext
│   │   ├── pages/              # Home, Movies, MovieDetail, SeatSelection, etc.
│   │   ├── api.js              # API helper
│   │   ├── main.jsx            # React entry point and routes
│   │   └── style.css           # IMovies theme
│   └── package.json
├── server/
│   ├── models/                 # Mongoose models
│   ├── controllers/            # Route handlers (if separated)
│   ├── routes/                 # Express API routes
│   ├── server.js               # Backend entry point
│   ├── .env                    # Local secrets — DO NOT commit
│   └── package.json
└── README.md
```

> Folder names and available features may vary slightly depending on your current project version.

## Prerequisites

1. Install **Node.js** and **npm**.
2. Have a **MongoDB Atlas** cluster and database user.
3. Allow your current public IP in Atlas **Network Access**.
4. Use **VS Code** or another code editor.

## Installation and Setup

### 1. Open the project

Open the `IMovies` folder in VS Code. Open two integrated terminals (**Terminal → New Terminal**).

### 2. Configure the backend

In terminal 1:

```powershell
cd server
npm install
```

Create `server/.env` with the following **template**:

```dotenv
PORT=5000
MONGODB_URI=mongodb+srv://DB_USERNAME:URL_ENCODED_DB_PASSWORD@YOUR_ACTUAL_CLUSTER.mongodb.net/test?retryWrites=true&w=majority
JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
CLIENT_ORIGIN=http://localhost:5173
ADMIN_EMAIL=admin@imovies.local
ADMIN_PASSWORD=REPLACE_WITH_A_STRONG_ADMIN_PASSWORD
```

- Copy the actual MongoDB connection string from **Atlas → Clusters → Connect → Drivers**.
- Replace all placeholder values. If your existing movies are in Atlas database `test`, retain `/test`.
- `CLIENT_ORIGIN` must match the frontend URL printed by Vite; it might be `http://localhost:5174` or `http://localhost:5175`.
- Generate a JWT secret with:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

- Never commit `.env` or share database passwords, JWT secrets, or admin credentials.

### 3. Start the backend

From `server/`:

```powershell
npm run dev
```

If no `dev` script is defined in `server/package.json`, use:

```powershell
npx nodemon server.js
```

The backend normally runs at **http://localhost:5000**.

### 4. Configure and start the frontend

In terminal 2, from the project root:

```powershell
cd client
npm install
```

Create `client/.env` if needed:

```dotenv
VITE_API_URL=http://localhost:5000/api
```

Then run:

```powershell
npm run dev
```

Open the localhost URL displayed by Vite (typically **http://localhost:5173**).

## Main Pages

| Route | Purpose |
| --- | --- |
| `/` | Homepage |
| `/movies` | Browse movies |
| `/movies/:id` | Movie details and shows |
| `/movies/:id/shows/:showId` | Seat selection |
| `/login` | Log in |
| `/register` | Register |
| `/bookings` | Booking history (login required) |
| `/admin` | Admin page (admin role required) |
| `/payment` | Demo payment flow (if enabled) |
| `/payment-success` | Booking/payment confirmation (if enabled) |

## Backend API

The project uses API routes such as:

| Prefix | Purpose |
| --- | --- |
| `/api/auth` | Registration and login |
| `/api/movies` | Movie and showtime data |
| `/api/bookings` | Create, view, and manage bookings |

The exact HTTP methods, request bodies, and access rules are defined in your `server/routes/` files.

## Movie Posters and Banner Images

You can store movie images either as direct URLs in MongoDB or locally in `client/public/images/`.

For local images, save a poster at `client/public/images/posters/rrr.jpg` and use this movie field:

```json
{
  "title": "RRR",
  "poster": "/images/posters/rrr.jpg"
}
```

For the homepage banner, a CSS background can reference `/images/banners/home-banner.jpg` when that file exists. Only use images you have permission to display.

## Troubleshooting

| Error | What to check |
| --- | --- |
| `Missing MONGODB_URI or JWT_SECRET` | `server/.env` exists, values are set, and `dotenv` is loaded |
| `querySrv ENOTFOUND ...YOUR_CLUSTER...` | Replace the placeholder with your actual Atlas hostname |
| `bad auth : authentication failed` | Reset/check the Atlas **database user** credentials; URL-encode password characters |
| `Could not connect to any servers` | Atlas Network Access IP allowlist, cluster status, and network connectivity |
| `EADDRINUSE :::5000` | Another process is using port 5000; stop it or choose a different port |
| Images not appearing | Verify the `poster` URL or local file path and check the browser Network tab |
| CORS errors | Set `CLIENT_ORIGIN` to the exact Vite origin and restart the backend |

To check which Windows process uses port 5000:

```powershell
netstat -ano | findstr :5000
```

## Security Notes

- Add `.env`, `node_modules/`, and build outputs to `.gitignore`.
- Rotate any database password or secret that has been exposed.
- Validate seat availability on the server before confirming a booking.
- Do not store payment card details in the application or present demo payments as real transactions.

## Future Enhancements

- Real payment-gateway integration with verified callbacks.
- Live seat availability updates using WebSockets.
- Email/SMS booking notifications.
- Advanced filters, ratings, and reviews.
- Admin analytics and reports.

## Academic Project Information

- **Project name:** IMovies — Movie Ticket Booking System
- **Project type:** B.Tech CSE / MERN full-stack college project
- **Team ID:** _Add your team ID_
- **Contributors:** _Add team member names_
- **Institution:** _Add institution name_

---

**Note:** Update this README if your current routes, environment variable names, or implemented features differ from the descriptions above.
