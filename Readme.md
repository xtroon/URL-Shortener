# URL Shortener

A URL shortener built with TypeScript, Express, PostgreSQL, and Prisma.

This project is being built to learn backend development and system design concepts such as database design, caching, rate limiting, and scalability.

## Tech Stack

- TypeScript
- Node.js
- Express
- PostgreSQL
- Prisma

## Architecture

Currently:

Client → Express → PostgreSQL

Planned:

Client → Load Balancer → Backend Servers → Redis → PostgreSQL

## Project Status

Currently in development.

## Running Locally

```bash
npm install
npm run dev