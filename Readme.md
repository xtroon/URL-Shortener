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
