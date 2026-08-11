# AI Resume Optimizer — Server

This is the Express + TypeScript backend for AI Resume Optimizer.
It exposes API endpoints for resume analysis, authentication, and analytics.

## Setup

1. Install dependencies:

   - `npm install`

2. Create a `.env` file in the `server/` folder.

## Required Environment Variables

- `GEMINI_API_KEY` — Google Gemini API key used by the `@google/genai` client
- `JWT_SECRET` — secret key for signing JSON Web Tokens
- `MONGODB_URI` — MongoDB connection string (optional)
- `PORT` — server port (optional, default `5000`)

## Run Locally

- `npm run dev`

This runs `ts-node-dev --respawn --transpile-only src/index.ts`.

## Build

- `npm run build`

This compiles the TypeScript files into `dist/`.

## API Endpoints

- `POST /api/analyze`
  - Body: `{ resumeText, jobDescription, userId?, industry?, jobRole? }`
  - Returns: ATS score, matched keywords, missing keywords, suggestions

- `POST /api/auth/register`
  - Body: `{ name, email, password }`
  - Returns: JWT token and user info

- `POST /api/auth/login`
  - Body: `{ email, password }`
  - Returns: JWT token and user info

- `GET /api/analytics/summary`
- `GET /api/analytics/trends`
- `GET /api/analytics/user/:userId`

## Notes

- The backend will still start if MongoDB is unavailable, but database features
  will not work properly.
- The client currently calls the analyze endpoint at `http://localhost:5000/api/analyze`.
