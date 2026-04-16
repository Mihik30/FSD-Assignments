# Assignment 5 - Travel Agency Website (Node.js + Express + MongoDB)

## Description

This assignment is a full-stack travel agency website built using Node.js,
Express, EJS, and MongoDB. It provides package browsing, filtering, package
detail pages, and a booking inquiry form stored in a NoSQL database.

## Features

- home page with featured travel packages
- package listing page with search, max-price filter, and sorting
- package details page with itinerary highlights and tags
- booking/contact inquiry form with server-side validation
- inquiry submissions stored in MongoDB
- reusable EJS layout partials and responsive custom styling
- package seed script for quick demo data setup

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- EJS template engine
- CSS3

## Folder Structure

```text
Assignment-5/
  config/
    db.js
  controllers/
    siteController.js
  models/
    Inquiry.js
    Package.js
  public/
    css/
      style.css
  routes/
    siteRoutes.js
  seed/
    seedPackages.js
  views/
    partials/
      end.ejs
      footer.ejs
      head.ejs
      header.ejs
    contact.ejs
    error.ejs
    home.ejs
    package-details.ejs
    packages.ejs
  .gitignore
  package.json
  server.js
```

## Setup Instructions

1. Open terminal in `Assignment-5`.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in `Assignment-5`:

   ```env
   MONGO_URI=mongodb://127.0.0.1:27017/travel_agency_db
   PORT=5000
   ```

4. Seed initial package data:

   ```bash
   npm run seed
   ```

5. Start server in development mode:

   ```bash
   npm run dev
   ```

6. Open browser:

   ```
   http://localhost:5000
   ```

## Routes

- `GET /` - home page
- `GET /packages` - list/filter packages
- `GET /packages/:id` - package detail page
- `GET /contact` - inquiry form
- `POST /contact` - submit inquiry

## Notes

- MongoDB (local or Atlas) must be available before running seed/server.
- If no data appears on pages, run `npm run seed` again.
