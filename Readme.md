# URL Shortener API

A lightweight, scalable URL shortening service built with TypeScript, Node.js, Express, and PostgreSQL.

It maps long URLs to Base62-encoded short keys, tracks visit analytics, and issues HTTP 302 redirects.

---

## Features

- **Base62 Short Code Encoding**: Encodes database auto-increment IDs into compact alphanumeric keys (`0-9`, `a-z`, `A-Z`).
- **302 Temporary Redirects**: Ensures incoming requests hit the server to record analytics accurately.
- **Analytics & Metadata**: Tracks click counts and creation timestamps.
- **Concurrency Safety**: Prevents key collisions on simultaneous URL insertion requests.

---

## Tech Stack

- **Language**: TypeScript
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL (`pg` pool driver)
- **Execution Engine**: `tsx`

---

## Project Structure

```
URL Shortner/
├── server.ts             # Application entry point
├── src/
│   ├── app.ts            # Express setup and middleware
│   ├── config/           # Database connection pool
│   ├── controller/       # Request and response logic
│   ├── models/           # Database queries & interfaces
│   ├── routes/           # Express router definitions
│   ├── schema/           # Database migration scripts
│   └── utils/            # Base62 encoding utility
└── package.json
```

---

## API Reference

### Create Short URL

- **URL**: `/api/shorten`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "originalUrl": "https://example.com/long-path"
  }
  ```
- **Response** (`201 Created`):
  ```json
  {
    "shortCode": "b",
    "originalUrl": "https://example.com/long-path",
    "shortUrl": "http://localhost:3000/b"
  }
  ```

---

### Redirect to Destination

- **URL**: `/:shortCode`
- **Method**: `GET`
- **Response**: `302 Found` (Redirects to original URL and increments click counter)

---

### Fetch Link Analytics

- **URL**: `/api/stats/:shortCode`
- **Method**: `GET`
- **Response** (`200 OK`):
  ```json
  {
    "shortCode": "b",
    "originalUrl": "https://example.com/long-path",
    "clicks": 1,
    "createdAt": "2026-08-21T14:00:00.000Z"
  }
  ```

---

## Getting Started

### 1. Prerequisites
Ensure PostgreSQL and Node.js are installed and running.

### 2. Environment Configuration
Create a `.env` file in the project root:

```env
PORT=3000
DATABASE_URL=postgresql://username:password@localhost:5432/url_shortener
```

### 3. Installation & Migration
```bash
npm install
npm run db:init
```

### 4. Run Server
```bash
npm start
```
Server runs on `http://localhost:3000`.