# URL Shortener

A full-stack URL shortener with a TypeScript API, PostgreSQL persistence, Redis caching, and a small React frontend.

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