# AI Resume Optimizer — Client

This is the React + TypeScript front end for the AI Resume Optimizer project.
It is built with Vite and provides the user interface for submitting:

- resume text
- job description text

The app sends analysis requests to the backend API at `http://localhost:5000/api/analyze`.

## Setup

Install dependencies:

- `npm install`

Run in development mode:

- `npm run dev`

Build for production:

- `npm run build`

Preview the production build:

- `npm run preview`

## Key files

- `src/main.tsx` — application entry point
- `src/App.tsx` — page layout, client state, and API call
- `src/components/AnalyzeForm.tsx` — resume/job input form
- `src/components/ResultCard.tsx` — analysis result display
- `src/types.ts` — shared TypeScript types

## Notes

- The frontend expects the backend to run on `http://localhost:5000`.
- If you change the backend port, update the fetch URL in `src/App.tsx`.
- This client currently uses plain fetch and does not include auth UI yet.
