# 🎓 EduBridge

### Learn. Practice. Grow.

EduBridge is an AI-powered e-learning platform designed to make quality education more accessible, simple, and engaging for students.

The platform focuses on four core subjects:

* ⚛️ Physics
* 🧪 Chemistry
* 📐 Mathematics
* 🧬 Biology

EduBridge is initially being developed as a web platform, with a mobile application planned to use the same backend and student data.

---

## 🌟 What is EduBridge?

Many students do not have access to personalized learning resources or an easy-to-use learning environment.

EduBridge aims to provide a simple digital learning platform where students can:

* Learn concepts from the basics
* Watch educational resources
* Practice questions
* Take subject tests
* Track their learning progress
* Ask an AI tutor for explanations
* Review mistakes and improve

The goal is to make learning **simple enough for anyone to understand and engaging enough to keep learning.**

---

## 🚀 Features

### 📚 Learning

* Physics
* Chemistry
* Mathematics
* Biology
* Chapter-based learning
* Lesson-based content
* Educational video resources
* Simple explanations
* Worked examples

### ✏️ Practice

Students can select:

`Subject → Chapter → Topic → Questions`

Practice includes:

* Multiple-choice questions
* Instant feedback
* Explanations
* Scores
* Retry functionality
* Difficulty levels

### 📝 Tests

EduBridge includes demo tests covering the four subjects.

The initial version includes:

* 10 demo tests
* Subject selection
* Class/level selection
* Timed tests
* Question navigation
* Automatic scoring
* Answer review
* Explanations

### 📊 Progress

Student progress is integrated directly into the Dashboard.

Students can see their progress across:

* Physics
* Chemistry
* Mathematics
* Biology

Progress is updated as students complete lessons, practice questions and tests.

### 🤖 EduBridge AI Tutor

The AI Tutor helps students understand concepts rather than simply giving them answers.

Students can ask the AI to:

* Explain a concept
* Explain it more simply
* Give another example
* Help understand a mistake
* Summarize a lesson
* Quiz the student

The AI integration is handled through the backend so API credentials are not exposed to the browser.

---

## 📖 Curriculum

The initial demo is structured around **CBSE Class 5–10 aligned educational content**.

### Subjects

| Subject        | Demo Chapters |
| -------------- | ------------: |
| ⚛️ Physics     |             5 |
| 🧪 Chemistry   |             5 |
| 📐 Mathematics |             5 |
| 🧬 Biology     |             5 |

The initial version contains:

* 4 subjects
* 20 demo chapters
* 20 primary video/resource slots
* 10 demo tests
* Practice questions across chapters

> EduBridge uses CBSE-aligned demo content and is not affiliated with or officially endorsed by CBSE.

---

## 🎨 Design

EduBridge uses a modern **liquid-glass interface** designed to feel clean, premium and welcoming.

The interface includes:

* 🫧 Liquid glass / glassmorphism
* 🌌 Educational visual background
* ✨ Dynamic glass reflections
* 🌊 Smooth animations
* 🔵 Curved floating navigation
* 📱 Responsive design
* 🖥️ Desktop and mobile-ready layouts

The main navigation contains:

```text
🏠 Dashboard
📚 Subjects
✏️ Practice
📝 Test
```

---

## 🏗️ Architecture

EduBridge is designed as a full-stack application.

```text
Frontend
   ↓
Backend API
   ↓
Authentication
   ↓
PostgreSQL Database
   ↓
Learning / Practice / Test / Progress
   ↓
AI Tutor
```

The backend is designed as a reusable API so the future mobile application can connect to the same system.

---

## 🛠️ Technology

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Node.js / Next.js API
* REST API
* Zod validation

### Database

* PostgreSQL
* Prisma ORM

### AI

* AI API integration
* Server-side API key handling
* EduBridge AI Tutor

### Testing

* Vitest
* Playwright

---

## 🔐 Environment Variables

Never commit API keys or other secrets to GitHub.

Create a local `.env` file:

```env
DATABASE_URL=your_database_url
AI_API_KEY=your_ai_api_key
AI_MODEL=your_model
SESSION_SECRET=your_random_secret
```

The `.env` file should be included in `.gitignore`.

A safe `.env.example` should be committed instead:

```env
DATABASE_URL=
AI_API_KEY=
AI_MODEL=
SESSION_SECRET=
```

---

## 📦 Installation

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/EduBridge.git
cd EduBridge
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```bash
cp .env.example .env
```

Add your environment variables to `.env`.

Run database migrations:

```bash
npx prisma migrate dev
```

Seed the demo database:

```bash
npm run seed
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## 👤 Demo Account

For development:

```text
Email: demo@student.com
Password: demo123
```

> This account is intended only for development/demo purposes and should not be used as a production credential.

---

## 🖼️ Background Asset

The main EduBridge background is stored at:

```text
public/assets/edubridge-background.png
```

It is used as the primary visual background behind the liquid-glass interface.

---

## 📱 Future Mobile App

The mobile application will connect to the same EduBridge backend.

The following will be shared:

* Authentication
* Student profiles
* Subjects
* Chapters
* Lessons
* Videos
* Practice
* Tests
* Scores
* Progress
* Notifications
* AI Tutor

The goal is to allow a student to switch between the website and mobile app without losing their learning progress.

---

## 🗺️ Roadmap

### Phase 1 — Web Platform

* [x] Project architecture
* [x] UI concept
* [x] Liquid-glass design
* [ ] Dashboard
* [ ] Subjects
* [ ] Lessons
* [ ] Practice
* [ ] Tests
* [ ] Authentication
* [ ] Database
* [ ] AI Tutor

### Phase 2 — Content

* [ ] Physics content
* [ ] Chemistry content
* [ ] Mathematics content
* [ ] Biology content
* [ ] Educational video resources
* [ ] Practice question bank
* [ ] Test question bank

### Phase 3 — Mobile

* [ ] Mobile UI
* [ ] API integration
* [ ] Authentication
* [ ] Offline-friendly learning
* [ ] Push notifications
* [ ] Shared progress

### Phase 4 — Expansion

* [ ] Personalized learning
* [ ] Advanced AI tutoring
* [ ] More subjects
* [ ] More classes
* [ ] Teacher/admin dashboard
* [ ] Content management system
* [ ] Learning analytics

---

## 🤝 Contributing

Contributions, ideas and improvements are welcome.

If you would like to contribute:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test your changes
5. Open a pull request

---

## 📄 License

Add the project's chosen license here.

---

## 🎓 EduBridge

**Learn. Practice. Grow.**

Built to make learning more accessible, understandable and engaging.
