# Assignment 7 - PCCOE Event Review Platform

Full-stack web application for reviewing PCCOE club and institute events.

## Stack

- React (Vite)
- Express.js
- MongoDB (Mongoose)
- Recharts

## Features

- Event feedback submission form
- Club and event listing from MongoDB
- Admin dashboard with filters, pagination, and delete review action
- Analytics charts:
  - Ratings breakdown
  - Reviews by club
  - Monthly trend
- Seed data with verified PCCOE club names and mixed official/synthetic recent events

## Project Structure

```text
Assignment-7/
  client/
  server/
    config/
    controllers/
    models/
    routes/
    seed/
```

## Run Backend

1. Open terminal in `Assignment-7/server`
2. Install dependencies: `npm install`
3. Create `.env` from `.env.example`
4. Seed data: `npm run seed`
5. Start API: `npm run dev`

Backend URL: `http://localhost:7000`

## Run Frontend

1. Open terminal in `Assignment-7/client`
2. Install dependencies: `npm install`
3. Optional env file:

```env
VITE_API_BASE=http://localhost:7000/api
```

4. Start app: `npm run dev`

Frontend URL: `http://localhost:5173`
