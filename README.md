# AI Resume Optimizer

An AI-powered resume analysis tool that compares a resume against a job
description to provide an ATS score, match/missing keyword feedback, and
suggestions for improvement.

This workspace is split into two main parts:

- `client/` — React + TypeScript front end built with Vite
- `server/` — Express + TypeScript backend with MongoDB support and Gemini AI integration

## Tech Stack

| Layer      | Technology                         |
|------------|-------------------------------------|
| Frontend   | React + TypeScript + Vite           |
| Backend    | Node.js + Express + TypeScript      |
| Database   | MongoDB                            |
| AI         | Google Gemini via `@google/genai`   |
| Auth       | JWT-based authentication           |
| Dev         | npm / ts-node-dev                   |

## Repository Layout

- `client/` — front-end app, entry point `client/src/main.tsx`
- `server/` — backend API, entry point `server/src/index.ts`
- `server/src/routes/` — API route definitions
- `server/src/controllers/` — request handlers
- `server/src/config/` — database and AI configuration

## Setup

1. Install dependencies:

   - `cd client && npm install`
   - `cd server && npm install`

2. Create a `.env` file in `server/` with the required variables.

## Environment Variables

The backend requires:

- `GEMINI_API_KEY` — Google Gemini API key for resume analysis
- `JWT_SECRET` — secret key used for signing auth tokens
- `MONGODB_URI` — MongoDB connection string (optional, default is `mongodb://localhost:27017/ai-resume-optimizer`)
- `PORT` — optional server port (default `5000`)

## Run Locally

Start the backend:

- `cd server && npm run dev`

Start the frontend:

- `cd client && npm run dev`

The client expects the backend API at `http://localhost:5000` by default.

## Build Commands

- Frontend build: `cd client && npm run build`
- Backend build: `cd server && npm run build`

## Backend API Endpoints

- `POST /api/analyze` — analyze resume + job description
- `POST /api/auth/register` — register a new user
- `POST /api/auth/login` — login and receive JWT
- `GET /api/analytics/summary` — analytics summary
- `GET /api/analytics/trends` — analytics trends
- `GET /api/analytics/user/:userId` — analytics by user

## Notes

- The backend will still start if MongoDB is unavailable, but database
  features will be disabled.
- The client currently sends resume analysis requests to the backend
  at `http://localhost:5000/api/analyze`.

## Status

- Core resume analysis flow exists
- Server and client structure are in place
- Additional auth, analytics, and deployment work remains
