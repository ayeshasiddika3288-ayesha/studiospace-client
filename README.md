# 🎬 StudioSpace

Peer-to-peer creative workspace and production studio sharing platform where hosts list photo studios, podcast lounges, and music suites, and creators book them by the hour.

[![Live Demo](https://img.shields.io/badge/Live-Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://studiospace-client-navy.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-App_Router-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

![StudioSpace Screenshot](./screenshot1.png)

## 🔗 Links

- **Live site:** https://studiospace-client-navy.vercel.app
- **Server API:** https://studiospace-server-rosy.vercel.app
- **Server repository:** https://github.com/ayeshasiddika3288-ayesha/studiospace-server

## 📖 Overview

StudioSpace connects creators with studio owners. Hosts list their spaces and manage booking requests from a dashboard, while creators browse, filter and book studios by the hour with live price calculation.

## ✨ Features

- Browse, search, and filter studios by category, with sorting by rating
- Hero slider, featured studios, and category shortcuts on the home page
- Email/password and Google authentication with BetterAuth
- Private routes to add, update, and delete studio listings (confirmation modal on delete)
- Hourly booking system with live price calculation and a My Bookings page with cancel option
- Double-booking prevention that checks overlap with confirmed bookings
- JWT stored in HTTPOnly cookies; protected API routes return 401 when unauthorized
- Host dashboard to confirm and complete booking requests
- Image uploads to imgbb for the cover image and gallery carousel
- Downloadable PDF invoice for confirmed and completed bookings
- Light and dark theme toggle
- Toast notifications, skeleton loaders, empty states, and a custom 404 page

## 🛠️ Tech Stack

- **Client:** Next.js (App Router), TypeScript, Tailwind CSS, DaisyUI, Swiper
- **Authentication:** BetterAuth with MongoDB adapter, JWT
- **Server:** Express.js, MongoDB (Atlas)
- **Other:** jsPDF (invoices), React Icons, React Hot Toast
- **Hosting:** Vercel

## 📦 Dependencies

**Dependencies**

| Package | Purpose |
|---|---|
| `next`, `react`, `react-dom` | Framework and UI library |
| `better-auth` | Authentication (email/password, Google) |
| `mongodb` | Database driver (MongoDB Atlas) |
| `jsonwebtoken` | JWT creation and verification |
| `daisyui` | UI components for Tailwind CSS |
| `swiper` | Hero slider and gallery carousel |
| `jspdf` | PDF invoice generation |
| `react-icons` | Icons |
| `react-hot-toast` | Toast notifications |

**Dev Dependencies**

`typescript`, `tailwindcss`, `@tailwindcss/postcss`, `@tailwindcss/turbopack`, `postcss`, `eslint`, `eslint-config-next`, `@types/node`, `@types/react`, `@types/react-dom`, `@types/jsonwebtoken`

## 🚀 Local Setup

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

```env
MONGODB_URI=your_mongodb_connection_string
BETTER_AUTH_SECRET=your_random_secret
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:5000
JWT_SECRET=same_secret_as_server
NEXT_PUBLIC_IMGBB_KEY=your_imgbb_api_key
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

## 🔑 Examiner Test Credentials

- **Host account:** Email: host@studiospace.test | Password: Host123
- **Creator account:** Email: creator@studiospace.test | Password: Creator123

> Note: please test in a normal browser window (not Incognito). Incognito blocks the cross-site HTTPOnly JWT cookie, so create, update, and delete actions will be rejected with 401.

## 👩‍💻 Author

**Ayesha Siddika**: [GitHub](https://github.com/ayeshasiddika3288-ayesha) · [LinkedIn](https://www.linkedin.com/in/ayesha-siddika-cse)
