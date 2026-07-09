# Notice Board

A full CRUD Notice Board built with Next.js (Pages Router), Prisma, and a hosted MySQL database (TiDB Cloud), deployed on Vercel.

**Live app:** _add your Vercel URL here_
**Repository:** _add your GitHub URL here_

## Features

- List all notices as responsive cards (phone and desktop)
- Add / Edit notice via a single shared form
- Delete with a confirmation step
- Server-side validation on every write (required fields, valid date)
- Urgent notices always sort above Normal notices — done via Prisma's `orderBy`, not client-side sorting
- Notices persist in a hosted MySQL database via Prisma

## Tech stack

- Next.js 14, Pages Router
- Prisma ORM
- TiDB Cloud (MySQL-compatible, free tier)
- Plain CSS (no framework)
- Deployed on Vercel (Hobby/free tier)

## How to run locally

1. Clone the repo and install dependencies:
   ```bash
   git clone <your-repo-url>
   cd notice-board
   npm install
   ```

2. Create a free database (see "Database setup" below) and copy your connection string.

3. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```
   Then paste your connection string as `DATABASE_URL` in `.env`.

4. Push the schema to your database:
   ```bash
   npx prisma db push
   ```

5. (Optional) Add sample notices:
   ```bash
   node prisma/seed.js
   ```

6. Run the dev server:
   ```bash
   npm run dev
   ```
   Open http://localhost:3000

## One thing I would improve with more time

_Fill this in honestly, e.g.:_ "I'd add real image upload (to something like Cloudinary or Vercel Blob) instead of an image-URL field, and add optimistic UI updates on delete instead of waiting for the API response."

## Where and how AI was used

_Fill this in honestly._ Example: "I used Claude to scaffold the initial Next.js/Prisma project structure, the API route validation logic, and the CSS. I then reviewed, tested locally against my own database, and adjusted [specific things you changed] myself before deploying."

Be specific and accurate — this section is graded on honesty, not on minimizing AI use.
