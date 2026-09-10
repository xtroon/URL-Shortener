# URL Shortener | GitHub | TypeScript, Express, PostgreSQL, Redis, Nginx, Docker

A full-stack URL shortener with a TypeScript API, PostgreSQL persistence, Redis caching, and a small React frontend.

## Highlights

- Architected a scalable URL shortening service with compact Base62 conversion and indexed URL resolution, delivering an estimated 1–5ms average latency for Redis-cached redirects.
- Implemented a Redis caching layer with 24-hour TTLs and cache-first redirect resolution, targeting 5,000+ requests/sec for cached traffic while reducing database load.
- Orchestrated containerized deployment with Nginx as a reverse proxy and load balancer, using least-connections routing across 3 application instances for horizontal scaling and improved traffic distribution.

## Features

- Creates compact Base62 short codes from database IDs.
- Redirects short links with HTTP `302` responses.
- Tracks click counts and creation timestamps.
- Uses Redis to cache redirect lookups.
- Provides a simple browser UI for shortening, copying, and reviewing links.

## Tech Stack

### Backend

- TypeScript
- Node.js
- Express 5
- PostgreSQL with `pg`
- Redis with `ioredis`
- `tsx` for running TypeScript

### Frontend

- React 19
- TypeScript
- Vite
- Tailwind CSS 4
- Lucide React icons

### Deployment

- Docker
- Nginx
- Docker Compose configuration for the application and Redis cache

## Project Structure

```text
URL Shortner/
├── server.ts                 # Backend entry point
├── src/
│   ├── app.ts                # Express app configuration
│   ├── config/
│   │   ├── db.ts             # PostgreSQL connection
│   │   └── redis.ts          # Redis connection
│   ├── controller/
│   │   └── url.controller.ts # URL creation, redirect, and stats handlers
│   ├── models/
│   │   └── url.model.ts      # Database queries and URL model
│   ├── routes/
│   │   └── url.routes.ts     # API and redirect routes
│   ├── schema/
│   │   └── migrate.ts        # Database migration script
│   └── utils/
│       └── base62.ts         # Base62 encoding utility
├── web/
│   ├── src/
│   │   ├── App.tsx           # React UI
│   │   ├── index.css         # Tailwind entry stylesheet
│   │   └── main.tsx          # Frontend entry point
│   ├── index.html
│   ├── package.json
│   ├── vite.config.ts        # Vite and Tailwind configuration
│   └── Dockerfile            # Frontend production image
├── nginx/
│   └── nginx.conf            # Reverse proxy configuration
├── Dockerfile                # Backend production image
├── docker-compose.yml        # Container orchestration configuration
├── package.json              # Backend dependencies and scripts
└── Readme.md
```

## API

### Create a short URL

```http
POST /api/shorten
Content-Type: application/json
```

```json
{
  "originalUrl": "https://example.com/long-path"
}
```

Response:

```json
{
  "shortCode": "b",
  "originalUrl": "https://example.com/long-path",
  "shortUrl": "http://localhost:3000/b"
}
```

### Redirect to the original URL

```http
GET /:shortCode
```

Returns a `302` redirect and increments the link click count.

### Get link statistics

```http
GET /api/stats/:shortCode
```

## Local Development

### Prerequisites

- Node.js 22 or newer
- PostgreSQL
- Redis

### Backend

Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/url_shortener
REDIS_URL=redis://localhost:6379
PUBLIC_BASE_URL=http://localhost:3000
```

Install dependencies, run the migration, and start the API:

```bash
npm install
npm run db:init
npm start
```

The API runs at `http://localhost:3000`.

### Frontend

In a second terminal:

```bash
cd web
npm install
npm run dev
```

The Vite development server runs at `http://localhost:5173` and proxies `/api` requests to the backend.

To create a production build:

```bash
npm run build
```

## Docker Deployment

### Prerequisites

- Docker and Docker Compose

### Setup

Create a `.env` file in the project root:

```env
DATABASE_URL=postgresql://username:password@host:5432/url_shortener?sslmode=require
REDIS_URL=redis://localhost:6379
```

### Start

```bash
docker-compose up -d --build
```

This spins up:
- **3 backend instances** (`app1`, `app2`, `app3`) for horizontal scaling
- **Redis** for caching with 24-hour TTLs
- **Nginx** as a reverse proxy with least-connections load balancing on port 80
- **Web builder** to compile the React frontend

The app is available at `http://localhost`.

### Stop

```bash
docker-compose down
```

### View Logs

```bash
docker-compose logs -f
```

## Free Hosting Deployment

Deploy the full stack for free using Vercel (frontend), Render (backend), and Upstash (Redis).

### 1. Frontend → Vercel

1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com) and import your repo
3. Set **Root Directory** to `web/`
4. Framework: **Vite**
5. Add environment variable:
   - `VITE_API_URL` = your Render backend URL (e.g., `https://url-shortener-api.onrender.com`)
6. Deploy

### 2. Backend → Render

1. Go to [render.com](https://render.com) and create a new **Web Service**
2. Connect your GitHub repo
3. Runtime: **Docker**
4. Set environment variables:
   - `DATABASE_URL` = your Neon connection string
   - `REDIS_URL` = your Upstash Redis URL
   - `CORS_ORIGINS` = your Vercel frontend URL (e.g., `https://your-app.vercel.app`)
   - `PORT` = `3000`
5. Deploy

### 3. Redis → Upstash

1. Go to [upstash.com](https://upstash.com) and create a Redis database (free tier)
2. Copy the `REDIS_URL` from the dashboard
3. Paste into Render environment variables

### 4. Run Database Migration

After Render deploys, run the migration once:

```bash
# Connect to your Render service via SSH or use the Render shell
npm run db:init
```

### Environment Variables Summary

| Service | Variable | Where to set |
|---------|----------|--------------|
| Frontend | `VITE_API_URL` | Vercel |
| Backend | `DATABASE_URL` | Render |
| Backend | `REDIS_URL` | Render (from Upstash) |
| Backend | `CORS_ORIGINS` | Render |
| Backend | `PORT` | Render |