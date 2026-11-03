# StudioSpace

Peer-to-peer creative workspace and production studio sharing platform where hosts list photo studios, podcast lounges, and music suites, and creators book them by the hour.

**Live site:** https://studiospace-client-navy.vercel.app
**Server API:** https://studiospace-server-rosy.vercel.app
**Server repository:** https://github.com/ayeshasiddika3288-ayesha/studiospace-server

## Features

- Browse, search, and filter studios by category, with sorting by rating
- Hero slider, featured studios, and category shortcuts on the home page
- Email/password and Google authentication with BetterAuth
- Private routes to add, update, and delete studio listings (confirmation modal on delete)
- Hourly booking system with live price calculation and a My Bookings page with cancel option
- Double-booking prevention that checks overlap with confirmed bookings
- JWT stored in HTTPOnly cookies; protected API routes return 401 when unauthorized
- Host dashboard to confirm and complete booking requests
- Light and dark theme toggle
- Toast notifications, skeleton loaders, empty states, and a custom 404 page

## Tech Stack

- **Client:** Next.js (App Router), TypeScript, Tailwind CSS, DaisyUI, Swiper
- **Authentication:** BetterAuth with MongoDB adapter, JWT
- **Server:** Express.js, MongoDB (Atlas)
- **Hosting:** Vercel

## Local Setup

1. Clone both repositories

```bash
git clone https://github.com/ayeshasiddika3288-ayesha/studiospace-client.git
git clone https://github.com/ayeshasiddika3288-ayesha/studiospace-server.git
```

2. Server: create a `.env` file (see `.env.example`), then run

```bash
cd studiospace-server
npm install
npm run dev
```

3. Client: create a `.env.local` file

```
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=same_secret_as_server
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

4. Run the client

```bash
cd studiospace-client
npm install
npm run dev
```

Open http://localhost:3000

## Examiner Test Credentials

- **Host account:** Email: host@studiospace.test | Password: Host123
- **Creator account:** Email: creator@studiospace.test | Password: Creator123

> Note: please test in a normal browser window (not Incognito). Incognito blocks the cross-site HTTPOnly JWT cookie, so create, update, and delete actions will be rejected with 401.