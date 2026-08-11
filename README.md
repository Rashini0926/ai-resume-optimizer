# AI Resume Optimizer with Analytics Dashboard

## Project Overview

AI Resume Optimizer is a full-stack web application that analyzes resumes against job descriptions using Google Gemini AI and provides ATS (Applicant Tracking System) optimization insights.

The system evaluates resume content, identifies matching and missing keywords, calculates ATS scores, and generates improvement suggestions. Additionally, it includes an Analytics Layer built with MongoDB Atlas Charts and Power BI concepts to visualize resume analysis trends and user behavior.

---

## Features

### Resume Analysis
- Upload or paste resume content
- Paste target job description
- AI-powered ATS score generation
- Keyword matching analysis
- Missing skill identification
- Personalized improvement suggestions

### Analytics Tracking
- Store resume analysis events in MongoDB Atlas
- Track ATS scores over time
- Monitor job-role-based performance
- Analyze keyword matching trends
- Generate analytics dashboards

### Authentication
- JWT Authentication
- Secure API endpoints
- User session management

---

## Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Axios

### Backend
- Node.js
- Express.js
- TypeScript

### Database
- MongoDB Atlas
- Mongoose

### AI Integration
- Google Gemini AI

### Analytics
- MongoDB Atlas Charts
- Power BI Dashboard Concepts

---

## Project Structure

```text
ai-resume-optimizer/
│
├── client/
│   ├── src/
│   ├── components/
│   ├── services/
│   └── pages/
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   └── index.ts
│   │
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000
NODE_ENV=development

GEMINI_API_KEY=YOUR_GEMINI_API_KEY

MONGODB_URI=mongodb://USERNAME:PASSWORD@HOST1:27017,HOST2:27017,HOST3:27017/ai-resume-optimizer?ssl=true&replicaSet=atlas-1020mw-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster0
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/Rashini0926/ai-resume-optimizer.git
cd ai-resume-optimizer
```

### Backend Setup

```bash
cd server

npm install

npm run dev
```

Expected Output:

```bash
MongoDB connected successfully
Server running on port 5000
```

### Frontend Setup

```bash
cd client

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:5173
```

Backend runs on:

```text
http://localhost:5000
```

---

## API Endpoints

### Analyze Resume

**POST**

```http
/api/analyze
```

Request:

```json
{
  "resumeText": "Resume Content",
  "jobDescription": "Job Description"
}
```

Response:

```json
{
  "atsScore": 67,
  "matchedKeywords": [],
  "missingKeywords": [],
  "suggestions": []
}
```

---

## Analytics Data Model

Collection:

```text
analyticsevents
```

Example Document:

```json
{
  "userId": "user-1",
  "eventType": "resume_analysis",
  "industry": "Software Development",
  "jobRole": "Software Engineer",
  "atsScore": 67,
  "matchedKeywords": [
    "React",
    "TypeScript",
    "Node.js"
  ],
  "missingKeywords": [
    "Docker",
    "Kubernetes"
  ],
  "suggestions": [
    "Add Docker experience",
    "Mention CI/CD workflows"
  ],
  "createdAt": "2026-08-11T17:55:05.989Z"
}
```

---

## MongoDB Atlas Charts

Implemented Dashboards:

### 1. Average ATS Score by Job Role

Purpose:

- Compare ATS performance across job roles
- Identify high-performing resume categories

Metrics:

- X-Axis → Job Role
- Y-Axis → Average ATS Score

---

### 2. ATS Score Trend Over Time

Purpose:

- Track ATS score improvements
- Monitor optimization progress

Metrics:

- X-Axis → Created Date
- Y-Axis → Average ATS Score

---

### 3. Keyword Match Analysis

Purpose:

- Analyze keyword matching effectiveness
- Identify frequently matched technologies

Metrics:

- X-Axis → Industry
- Y-Axis → Count of Matched Keywords

---

## Power BI Integration Concept

The analytics layer is designed for Power BI integration through MongoDB Atlas data exports.

Potential Power BI Dashboards:

- ATS Score Trends
- User Growth Metrics
- Resume Optimization Performance
- Keyword Match Analytics
- Industry-wise Resume Analysis

---

## Future Improvements

- User authentication dashboard
- Resume history tracking
- Power BI live integration
- Predictive ATS scoring
- PDF resume upload support
- Admin analytics dashboard
- Real-time reporting

---

## Sample Technologies Analyzed

- React
- TypeScript
- Node.js
- Express.js
- MongoDB Atlas
- Google Gemini AI
- JWT
- REST APIs
- Power BI
- Power Apps

---

## Author

**Rashini Wijesinghe**

BSc (Hons) Information Technology Undergraduate

GitHub:
https://github.com/Rashini0926

LinkedIn:
https://www.linkedin.com/in/rashini-wijesinghe/

---

## License

This project was developed for educational, research, and portfolio purposes.
