# AI Resume Optimizer with Analytics Dashboard

AI Resume Optimizer is a full-stack web application that compares a candidate's resume with a target job description using Google Gemini AI. It generates an ATS compatibility score, detects matched and missing keywords, recommends improvements, and helps authenticated users create a personalized cover letter.

The application also records authenticated resume-analysis events in MongoDB Atlas and presents personal progress through an in-app analytics dashboard. A separate Power BI dashboard supports broader reporting and portfolio demonstrations.

## Key Features

### Guest Resume Analysis

- Upload a PDF resume of up to 10 MB
- Extract selectable text from the PDF in the browser
- Paste or edit resume text manually
- Paste a target job description
- Analyze a resume without creating an account
- Generate an AI-powered ATS score from 0 to 100
- Identify matched and missing keywords
- Receive practical resume-improvement suggestions

### Authentication and User Data

- Register and sign in using email and password
- JWT-based API authentication
- Password hashing with bcrypt
- Restore and validate existing user sessions
- Protect personal history, analytics, and cover-letter endpoints
- Keep every user's stored data isolated

### Resume History

- Save analyses completed by authenticated users
- Display the latest 50 analyses
- Track job role, industry, ATS score, and completion date
- Keep guest analyses temporary and out of user history

### Cover Letter Generation

- Complete resume analysis before requesting a cover letter
- Ask guest users to sign in only when they choose to generate a letter
- Restore the pending analysis after login or registration
- Generate Professional, Enthusiastic, Formal, or Friendly letters
- Edit the generated content
- Copy the completed letter to the clipboard
- Backend support for saving, listing, viewing, and deleting cover letters

### Personal Analytics

- Protected analytics dashboard for signed-in users
- Total completed analysis count
- Average ATS score
- Best monthly average score
- Monthly ATS score trend chart
- User-scoped analytics queries to prevent cross-user access

### Power BI and MongoDB Analytics

- Store authenticated analysis events in MongoDB Atlas
- Prepare analytics data for MongoDB Atlas Charts and Power BI
- Track ATS scores over time
- Compare resume performance by job role and industry
- Explore matched and missing keyword trends
- Open the external Power BI report from the authenticated dashboard

## Application Flow

```text
Upload PDF or paste resume
          │
          ▼
Paste target job description
          │
          ▼
Gemini ATS analysis
          │
          ├── Guest user ──► View results
          │                       │
          │                       ▼
          │                Request cover letter
          │                       │
          │                       ▼
          │                  Login / Register
          │                       │
          │                       ▼
          │              Restore analysis context
          │
          └── Signed-in user ──► Save history and analytics event
                                  │
                                  ▼
                         Generate cover letter
```

## Tech Stack

### Frontend

- React 19
- TypeScript
- Vite
- React Router
- PDF.js (`pdfjs-dist`)
- jsPDF
- Native Fetch API
- CSS

### Backend

- Node.js
- Express.js 5
- TypeScript
- JSON Web Tokens
- bcrypt

### Database

- MongoDB Atlas
- Mongoose

### AI Integration

- Google Gemini AI
- `gemini-2.5-flash`
- Google Gen AI SDK

### Analytics

- In-app React analytics dashboard
- MongoDB Atlas analytics collections
- MongoDB Atlas Charts concepts
- Microsoft Power BI

## Project Structure

```text
ai-resume-optimizer/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── AnalyzeForm.tsx
│   │   │   ├── CoverLetterGenerator.tsx
│   │   │   ├── HistoryTable.tsx
│   │   │   ├── ProtectedRoute.tsx
│   │   │   └── ResultCard.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── pages/
│   │   │   ├── Analytics.tsx
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── main.tsx
│   │   └── types.ts
│   ├── .env.example
│   └── package.json
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── utils/
│   │   ├── app.ts
│   │   └── index.ts
│   ├── .env
│   ├── package.json
│   └── tsconfig.json
├── docs/
│   └── screenshots/
└── README.md
```

## Environment Variables

Create `server/.env`:

```env
PORT=5000
NODE_ENV=development

MONGODB_URI=YOUR_MONGODB_ATLAS_CONNECTION_STRING
GEMINI_API_KEY=YOUR_GEMINI_API_KEY

JWT_SECRET=REPLACE_WITH_A_LONG_RANDOM_SECRET
JWT_EXPIRES_IN=7d
```

Optionally create `client/.env` by copying `client/.env.example`:

```env
VITE_API_URL=http://localhost:5000
```

Never commit real database credentials, Gemini API keys, or JWT secrets.

## Installation and Local Development

### 1. Clone the repository

```bash
git clone https://github.com/Rashini0926/ai-resume-optimizer.git
cd ai-resume-optimizer
```

### 2. Install and run the backend

```bash
cd server
npm install
npm run dev
```

Expected output:

```text
MongoDB connected successfully
Server running on port 5000
```

### 3. Install and run the frontend

Open a second terminal:

```bash
cd client
npm install
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`
- Health check: `http://localhost:5000/api/health`

## Available Scripts

### Client

```bash
npm run dev
npm run build
npm run lint
npm run preview
```

### Server

```bash
npm run dev
npm run build
npm start
```

## API Reference

Endpoints marked **Protected** require this header:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

### Health

```http
GET /api/health
```

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
GET  /api/auth/me               # Protected
```

Register request:

```json
{
  "name": "Example User",
  "email": "user@example.com",
  "password": "secure-password",
  "confirmPassword": "secure-password"
}
```

### Resume Analysis

```http
POST /api/analyze
```

Authentication is optional. Authenticated analyses are saved to history and analytics; guest analyses only return the result.

Request:

```json
{
  "resumeText": "Resume content",
  "jobDescription": "Target job description",
  "industry": "Software Development",
  "jobRole": "Software Engineer"
}
```

Response:

```json
{
  "atsScore": 78,
  "matchedKeywords": ["React", "TypeScript", "Node.js"],
  "missingKeywords": ["Docker", "Kubernetes"],
  "suggestions": [
    "Add relevant Docker experience",
    "Include measurable project outcomes"
  ]
}
```

### Resume History

```http
GET /api/history              # Protected
```

### Personal Analytics

```http
GET /api/analytics/summary       # Protected
GET /api/analytics/trends        # Protected
GET /api/analytics/user/:userId  # Protected and owner-only
```

### Cover Letters

```http
POST   /api/cover-letter/generate  # Protected
POST   /api/cover-letter/save      # Protected
GET    /api/cover-letter           # Protected
GET    /api/cover-letter/:id       # Protected
DELETE /api/cover-letter/:id       # Protected
```

Generate request using the current analysis result:

```json
{
  "analysis": {
    "atsScore": 78,
    "matchedKeywords": ["React", "TypeScript"],
    "missingKeywords": ["Docker"],
    "suggestions": ["Add relevant Docker experience"]
  },
  "jobDescription": "Target job description",
  "tone": "Professional"
}
```

## Analytics Data Model

Authenticated analysis events are stored in the `analyticsevents` collection.

```json
{
  "userId": "USER_OBJECT_ID",
  "eventType": "resume_analysis",
  "industry": "Software Development",
  "jobRole": "Software Engineer",
  "atsScore": 78,
  "matchedKeywords": ["React", "TypeScript", "Node.js"],
  "missingKeywords": ["Docker", "Kubernetes"],
  "suggestions": ["Add relevant Docker experience"],
  "createdAt": "2026-08-27T10:30:00.000Z"
}
```

Guest analyses are not persisted in this collection.

## Analytics Dashboards

### In-App Personal Analytics

The protected React analytics page displays:

- Total analyses completed by the current user
- Average ATS score
- Best monthly average score
- Monthly ATS score trend

### MongoDB Atlas Charts

Suggested Atlas charts include:

1. Average ATS score by job role
2. ATS score trend over time
3. Analysis count by industry
4. Frequently matched keywords
5. Frequently missing keywords

### Power BI Dashboard

The Power BI report can be connected to MongoDB Atlas through the MongoDB Atlas SQL Interface or an exported analytics dataset. Recommended report visuals include:

- KPI cards for total analyses, users, and average ATS score
- ATS score trend over time
- Average ATS score by job role
- Industry-wise analysis volume
- Matched keyword frequency
- Missing keyword frequency
- Resume optimization performance
- Cover-letter generation activity

#### Power BI Overview

![Power BI dashboard overview](docs/screenshots/powerbi-dashboard-overview.png)

#### ATS Score Trends

![Power BI ATS score trends](docs/screenshots/powerbi-ats-trends.png)

#### Keyword and Job Role Analysis

![Power BI keyword and job role analysis](docs/screenshots/powerbi-keyword-analysis.png)

Add the exported Power BI screenshots to `docs/screenshots/` using the exact filenames shown above. Do not include connection strings, account details, email addresses, or other sensitive information in screenshots.

## Power BI Security Notes

- A direct report URL does not automatically grant report access.
- Power BI workspace permissions and licensing still apply.
- URL filters are not a security mechanism.
- Use Power BI Row-Level Security for user-specific embedded reports.
- Keep the current external Power BI report as an admin or portfolio dashboard unless secure embedding is configured.

## Current Limitations

- Scanned PDFs without selectable text require OCR and are not supported yet.
- Industry and job role are currently supplied by the client using default values.
- The client generates and edits cover letters, while the complete saved-letter management UI is still pending.
- The Power BI report opens externally and is not yet securely embedded in the React application.
- Automated frontend and backend tests have not yet been added.
- The PDF worker increases the production bundle size and should be lazy-loaded in a future optimization.

## Roadmap

- Add editable industry and job-role fields
- Add saved cover-letter management UI
- Add DOCX and OCR resume support
- Add resume comparison and progress reports
- Add admin role and admin analytics dashboard
- Configure secure Power BI embedding and Row-Level Security
- Add automated unit and integration tests
- Add rate limiting, request validation, and production security headers
- Add CI/CD and deployment documentation

## Author

**Rashini Wijesinghe**

BSc (Hons) Information Technology Undergraduate

- [GitHub](https://github.com/Rashini0926)
- [LinkedIn](https://www.linkedin.com/in/rashini-wijesinghe/)

## License

This project was developed for educational, research, and portfolio purposes.
