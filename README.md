# StudyPulse

### AI-Based Study Productivity & Planning Platform

StudyPulse is a full-stack student productivity platform designed to help university students build consistent study habits, track their learning activity, understand productivity patterns, and make better study-planning decisions.

It combines study-session tracking, productivity analytics, goal management, study planning, Pomodoro sessions, and an AI Study Advisor into a single platform.

---

## 📌 Overview

University students often find it difficult to maintain consistent study routines and understand where their study time is being spent.

StudyPulse addresses this problem by collecting study activity and transforming it into useful insights such as:

* Study time trends
* Subject-wise performance
* Productivity scores
* Study streaks
* Goals and progress
* Recommended study times
* Personalized study advice

---

## ✨ Key Features

### 📊 Smart Dashboard

* Daily and weekly study statistics
* Productivity score
* Study streak tracking
* Quick overview of current goals and activity

### ⏱️ Study Session Tracking

* Record individual study sessions
* Select subjects
* Record duration and productivity
* Add notes to study sessions
* Review previous study activity

### 🍅 Pomodoro Timer

Built-in Pomodoro timer with configurable study/break intervals:

* 25 / 5
* 50 / 10
* 90 / 20

Completed Pomodoro sessions can be saved directly as study sessions.

### 🎯 Goal Management

* Create subject-specific study goals
* Set target study minutes
* Monitor goal progress
* Mark completed goals

### 📈 Productivity Analytics

* Weekly study activity visualization
* Subject-wise performance
* Productivity trends
* Study pattern analysis

### 🤖 AI Study Advisor

The AI Study Advisor analyzes available study-performance data and provides personalized recommendations, including:

* Recommended study periods
* Subject allocation suggestions
* Productivity-based advice
* Actionable study recommendations

### 🔐 Authentication & Authorization

* User registration and login
* JWT-based authentication
* Protected routes
* Role-based access
* Student and Admin roles

---

## 🏗️ System Architecture

StudyPulse follows a **Client-Server architecture**.

```text
┌──────────────────────┐
│      React SPA       │
│      Frontend        │
└──────────┬───────────┘
           │
           │ REST API
           ▼
┌──────────────────────┐
│   Spring Boot API    │
│                      │
│ Controller            │
│      ↓               │
│ Service               │
│      ↓               │
│ Repository            │
│      ↓               │
│ Entity                │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│        MySQL         │
│       Database       │
└──────────────────────┘
```

The backend uses a layered architecture:

**Controller → Service → Repository → Entity**

The React frontend communicates with the Spring Boot backend through RESTful APIs.

---

## 🛠️ Technologies

### Frontend

* React
* Vite
* Tailwind CSS
* React Router DOM
* Axios
* Recharts
* Lucide React

### Backend

* Java 21
* Spring Boot 3.4
* Spring Security
* JWT
* Spring Data JPA
* Bean Validation
* MySQL

---

## 📂 Project Structure

```text
StudyPulse/
│
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   └── resources/
│   │   └── test/
│   ├── pom.xml
│   └── .env.example
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── context/
│   │   ├── layouts/
│   │   ├── pages/
│   │   ├── routes/
│   │   └── services/
│   ├── package.json
│   └── .env.example
│
├── .gitignore
└── README.md
```

---

## 🔌 API Overview

The backend exposes RESTful endpoints for the main application features.

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Dashboard

```text
GET /api/dashboard/summary
```

### Study Sessions

```text
POST /api/study-sessions
GET /api/study-sessions
```

### Subjects

```text
POST /api/subjects
GET /api/subjects
```

### Goals

```text
POST /api/goals
GET /api/goals
PUT /api/goals/{id}/complete
```

### AI Study Advisor

```text
GET /api/ai/study-advice
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

* Java 21+
* Node.js 18+
* MySQL 8+
* Git

---

## 🔐 Environment Configuration

### Backend

Create a `.env` file inside the `backend` directory using the provided `.env.example` as a reference.

Example:

```properties
DB_URL=jdbc:mysql://localhost:3306/studypulse
DB_USERNAME=root
DB_PASSWORD=your_database_password
JWT_SECRET=your_secure_jwt_secret
AI_API_KEY=your_ai_api_key
```

**Never commit your real `.env` file or API keys to GitHub.**

### Frontend

Create a `.env` file inside the `frontend` directory:

```env
VITE_API_URL=http://localhost:8080/api
```

---

## 🚀 Running the Backend

1. Open a terminal inside the `backend` directory.
2. Create a MySQL database named:

```sql
CREATE DATABASE studypulse;
```

3. Configure the backend environment variables.
4. Start the Spring Boot application:

```bash
./mvnw spring-boot:run
```

On Windows:

```powershell
.\mvnw.cmd spring-boot:run
```

The backend will run at:

```text
http://localhost:8080
```

---

## 💻 Running the Frontend

Open another terminal inside the `frontend` directory.

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

```text
http://localhost:5173
```

---

## 🧪 Testing

Backend tests can be executed using:

```bash
./mvnw test
```

On Windows:

```powershell
.\mvnw.cmd test
```

---

## 📸 Screenshots

Screenshots of the application will be added here to demonstrate the main user interface and functionality.

Suggested screenshots:

* Dashboard
* Analytics
* Study Sessions
* Goals
* Study Plans
* AI Study Advisor
* Pomodoro Timer

---

## 🔮 Future Improvements

Planned improvements include:

* Integration with a production AI API for the AI Study Advisor
* Full calendar-based study planning
* Email notifications for upcoming or overdue goals
* Advanced Admin analytics
* More detailed productivity prediction
* Deployment of the frontend and backend
* Interactive API documentation with Swagger/OpenAPI

---

## 🎓 Project Purpose

StudyPulse was developed as a full-stack Software Engineering portfolio project to demonstrate practical experience with:

* Frontend development
* Backend development
* REST API design
* Database management
* Authentication and authorization
* Data visualization
* AI-assisted functionality
* Software architecture

---

## 👨‍💻 Author

**Dinuri Senara**

A full-stack student project focused on applying Software Engineering concepts to a practical productivity problem.
