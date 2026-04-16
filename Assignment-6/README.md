# Assignment 6 - AI Ecommerce Store

Full-stack ecommerce website for discovering and requesting modern AI model stacks.

## Tech Stack

- Node.js
- Express.js
- EJS
- MongoDB with Mongoose
- Express Session

## Features

- Modern ecommerce-style landing page and catalog UI
- Product listing with search, category filter, and sorting
- Product details with related items
- Session-based shopping cart
- Checkout request form with validation
- Order records stored in MongoDB
- Seed script with latest AI model examples and bundle products

## Project Structure

```text
Assignment-6/
  config/
    db.js
  controllers/
    storeController.js
  models/
    Product.js
    Order.js
  public/
    css/
      style.css
  routes/
    storeRoutes.js
  seed/
    seedProducts.js
  views/
    partials/
    home.ejs
    products.ejs
    product-details.ejs
    cart.ejs
    checkout.ejs
    order-success.ejs
    error.ejs
  .env.example
  package.json
  server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create `.env` using `.env.example`.

3. Make sure MongoDB is running.

4. Seed products:

```bash
npm run seed
```

5. Start server:

```bash
npm run dev
```

6. Open: `http://localhost:6000`

## Notes

- `npm run dev` starts only the Express app with nodemon.
- MongoDB must be started separately unless you use a managed connection string.
