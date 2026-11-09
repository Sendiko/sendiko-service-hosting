This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Run with Docker

Copy the example environment file and adjust the host port if needed:

```bash
cp .env.example .env
```

Build and start the production container:

```bash
docker compose up --build -d
```

Open [http://localhost:3000](http://localhost:3000). Check the container status with:

```bash
docker compose ps
```

Stop the service with:

```bash
docker compose down
```

The container listens on port `3000` and maps to the host port configured by `APP_PORT` (default: `3000`). It runs as a non-root user. Put a reverse proxy such as Caddy or Nginx in front of it when exposing the service publicly.

## Admin workspace

Open [http://localhost:3000/admin](http://localhost:3000/admin) to manage the seeded package catalog and client records. The package seed mirrors the pricing in [`PRICE.md`](./PRICE.md); client records start empty so no customer data is fabricated. Data is stored in PostgreSQL through Prisma.

For local development, copy `.env.example` to `.env`, start PostgreSQL with `docker compose up -d db`, then run `bun run db:migrate` and `bun run db:seed`. The full Docker Compose web container automatically applies migrations and seeds the catalog on startup. To create a new development migration after changing the schema, use `bun run db:migrate:dev -- --name describe-your-change`. Authentication should be added before exposing the admin route publicly.

## Getting Started

First, run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
