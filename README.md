# StudyPulse

AI-Based Study Productivity Analyzer

## Overview
StudyPulse is a modern student productivity platform that helps university students track study sessions, analyze productivity, monitor subject-wise performance, identify productive hours, and receive personalized study recommendations.

## Problem
University students often struggle to maintain consistent study habits, track their productivity effectively, and understand which subjects need more focus. Traditional methods lack insightful analytics and personalized feedback.

## Solution
StudyPulse provides a comprehensive SaaS-like dashboard to manage study sessions, set goals, plan schedules, and visualize productivity trends. It incorporates an AI Study Advisor to give actionable recommendations based on the student's actual performance data.

## Features
- **Modern Dashboard:** View daily/weekly study time, productivity scores, and streaks.
- **Study Session Tracker:** Log study times with productivity ratings and notes.
- **Pomodoro Timer:** Built-in timer with customizable work/break intervals (25/5, 50/10, 90/20) that can be saved directly as study sessions.
- **Goal Management:** Set target minutes for specific subjects and track progress.
- **Analytics:** Visualize weekly activity and subject-wise performance using Recharts.
- **AI Study Advisor:** Analyzes study patterns to recommend optimal study times and subject allocations.
- **Role-Based Access:** Secure JWT authentication separating Student and Admin roles.

## Technologies
### Frontend
- React (Vite)
- Tailwind CSS
- React Router DOM
- Axios
- Recharts
- Lucide React (Icons)

### Backend
- Java 21
- Spring Boot 3.4
- Spring Security (JWT)
- Spring Data JPA
- Bean Validation
- MySQL

## System Architecture
The application follows a standard Client-Server architecture. The frontend is a Single Page Application (SPA) built with React, communicating via RESTful APIs with the Spring Boot backend. The backend uses a layered architecture (Controller -> Service -> Repository -> Entity) and persists data in a MySQL database.

## API Documentation
The API provides endpoints for:
- `POST /api/auth/register`, `POST /api/auth/login`
- `GET /api/dashboard/summary`
- `POST /api/study-sessions`, `GET /api/study-sessions`
- `POST /api/subjects`, `GET /api/subjects`
- `POST /api/goals`, `GET /api/goals`, `PUT /api/goals/{id}/complete`
- `GET /api/ai/study-advice`

*(Swagger UI can be configured by adding `springdoc-openapi-starter-webmvc-ui` dependency to view the full interactive documentation at `/swagger-ui.html`)*

## Installation
Ensure you have the following installed:
- Java 21+
- Node.js 18+
- MySQL 8+

## Environment Variables
Create a `.env` file in the `backend` directory based on `.env.example`:
```properties
DB_URL=jdbc:mysql://localhost:3306/studypulse
DB_USERNAME=root
DB_PASSWORD=yourpassword
JWT_SECRET=83f982136975a596041a84f55562719c8f2206bf2dcbc0f719b0aa90c88bc625
AI_API_KEY=your_ai_api_key_here
```

Create a `.env` file in the `frontend` directory based on `.env.example`:
```env
VITE_API_URL=http://localhost:8080/api
```

## Running Backend
1. Open a terminal in the `backend` directory.
2. Create a MySQL database named `studypulse`.
3. Run the application using the Maven wrapper:
   ```bash
   ./mvnw spring-boot:run
   ```
   *The backend will run on http://localhost:8080*

## Running Frontend
1. Open a terminal in the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   *The frontend will be available at http://localhost:5173*

## Testing
Run backend tests using:
```bash
./mvnw test
```

## Future Improvements
- Integrate OpenAI API for the AI Advisor (currently mocked).
- Add full calendar view for Study Plans.
- Add email notifications for overdue goals.
- Implement comprehensive admin dashboard analytics.

## Author
Built as a comprehensive full-stack portfolio project.
