# 🧠 ResumeAI — AI-Powered Resume Analyzer

An AI-powered resume analyzer that compares your resume against a job description and returns a match score, missing skills, keyword matches, and improvement suggestions — built with Spring Boot + React + Gemini AI.

---

## 🗺️ Task Roadmap

| # | Task | Status |
|---|------|--------|
| 1 | Project setup — Spring Boot + React boilerplate | ✅ Done |
| 2 | PDF upload + text extraction (PDFBox) | ⬜ Next |
| 3 | AI API integration (Gemini API) | ⬜ |
| 4 | Match score logic + REST APIs | ⬜ |
| 5 | React UI — upload form + results page | ⬜ |
| 6 | JWT Auth + user history | ⬜ |
| 7 | Dashboard + charts | ⬜ |
| 8 | Testing + deployment (Railway/Vercel) | ⬜ |

---

## 🗂️ Project Structure

```
resume-analyzer/
├── backend/                          # Spring Boot (Java 21)
│   ├── src/main/java/com/resumeanalyzer/
│   │   ├── ResumeAnalyzerApplication.java
│   │   ├── config/SecurityConfig.java
│   │   ├── controller/
│   │   │   ├── AuthController.java
│   │   │   ├── ResumeController.java   ← stubs for Task 2–4
│   │   │   ├── AdminController.java    ← stubs for Task 7
│   │   │   └── HealthController.java
│   │   ├── dto/
│   │   │   ├── AuthDTOs.java
│   │   │   └── AnalysisResponse.java
│   │   ├── entity/
│   │   │   ├── User.java
│   │   │   └── AnalysisHistory.java
│   │   ├── repository/
│   │   │   ├── UserRepository.java
│   │   │   └── AnalysisHistoryRepository.java
│   │   └── security/
│   │       ├── JwtUtils.java
│   │       ├── AuthTokenFilter.java
│   │       └── UserDetailsServiceImpl.java
│   └── src/main/resources/
│       ├── application.properties
│       ├── application-dev.properties   ← H2 (local dev)
│       └── application-prod.properties  ← PostgreSQL (production)
│
└── frontend/                         # React + Vite
    └── src/
        ├── api/          (client.js, auth.js, resume.js, admin.js)
        ├── context/      (AuthContext.jsx)
        ├── components/   (Navbar.jsx, ProtectedRoute.jsx)
        └── pages/        (Login, Register, Dashboard, History, Admin)
```

---

## 🚀 Local Development Setup

### Prerequisites
- Java 21+
- Maven 3.8+
- Node 18+
- (Optional) PostgreSQL for prod profile

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
# Runs on http://localhost:8080
# H2 console: http://localhost:8080/h2-console
```

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## 🔐 Environment Variables

Create `backend/src/main/resources/application-dev.properties` overrides, or set env vars:

| Variable | Description | Default |
|----------|-------------|---------|
| `GEMINI_API_KEY` | Google Gemini API key | (required for Task 3) |
| `DATABASE_URL` | PostgreSQL URL | H2 in dev |
| `DATABASE_USERNAME` | DB username | sa |
| `DATABASE_PASSWORD` | DB password | (empty) |
| `app.jwt.secret` | JWT signing secret | (set in application.properties) |

Get a free Gemini API key at: https://aistudio.google.com/app/apikey

---

## 📡 API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| POST | `/api/resume/analyze` | JWT | Analyze resume vs JD |
| GET | `/api/resume/history` | JWT | Get user's past analyses |
| GET | `/api/admin/stats` | ADMIN | Platform stats |
| GET | `/api/admin/users` | ADMIN | All users list |

---

## 🐙 Git Commit Convention

Each task gets its own commit:

```bash
git commit -m "task-1: project setup — Spring Boot + React boilerplate"
git commit -m "task-2: PDF upload and text extraction with PDFBox"
git commit -m "task-3: Gemini AI API integration"
# etc.
```
