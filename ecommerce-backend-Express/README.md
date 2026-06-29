# ecommerce-backend-express

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

This project was created using `bun init` in bun v1.3.14. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.

## Added features

- JWT auth middleware in `src/middlewares/auth.ts`
- Protected routes for `/api/users`, `/api/cart`, `/api/wishlist`, and `/api/orders`
- Drizzle ORM schema and client in `src/db`
- Seed script `bun run seed` loads mock JSON into SQLite
- API route modules for auth, products, categories, cart, wishlist, orders, and newsletter

## Running the project

1. Install dependencies:

```bash
bun install
```

2. Generate the database and seed data:

```bash
bun run seed
```

3. Start the server:

```bash
bun run index.ts
```

4. Use the endpoints under `/api/*`.


## future additions
 Change the backend to a feature based structure
 use drizzle to instantiate the database
 