# Trackly — Issue Tracker (React + Express)
 
A modern, professional **Issue Tracking System** built as a full-stack assignment.  
Built with **React + Vite**, this system uses **Express.js** for the backend and supports full **CRUD operations**, **JWT authentication**, **search & filters**, and **CSV/JSON export** — all wrapped in a polished dark UI with smooth animations.
 
---
 
## 🚀 Features
 
- 🗂 **Full CRUD**: Create, view, edit, and delete issues with confirmation prompts.
- 📊 **Live Dashboard**: Status count cards, resolution rate chart, and critical issue alerts.
- 🔍 **Search & Filter**: Debounced search + filter by status, priority, and severity — all server-side.
- 🔐 **JWT Authentication**: Secure register/login with token-based auth and auto-logout on expiry.
- 📄 **Pagination & Sorting**: Server-driven pagination with sort by date, priority, or status.
- 📤 **Export**: Download the current issue list as `.csv` or `.json`.
- ⚡ **State Management**: Global state handled efficiently using **Zustand**.
- 🔔 **Real-time Feedback**: Instant toast notifications for every user action.
- 🎞 **Animations**: Smooth transitions and micro-interactions via **Framer Motion**.
---
 
## 🛠 Tech Stack
 
| Layer | Technology |
|---|---|
| **Frontend** | React 18 (Vite), Tailwind CSS, Framer Motion |
| **State Management** | Zustand (with devtools + persist) |
| **Routing** | React Router v6 |
| **Backend** | Node.js, Express.js |
| **Database** | MySQL / MongoDB |
| **Auth** | JWT (Bearer Token) |
 
---
 
## 📦 Setup Guide
 
### 1. Clone Repository
 
```bash
git clone https://github.com/Gihandev/issue-tracker.git
cd issue-tracker
```
 
 
## 🎥 Demo
 
Repo Link — https://github.com/Gihandev/issue-tracker.git
 
---
 
## 📂 Project Structure
 
```
src/
├── api/               ← Fetch client, auth API, issues API
├── store/             ← Zustand stores (auth + issues)
├── components/        ← UI, layout, and issue components
├── pages/             ← Dashboard, Issues, Login, Register, Profile
├── hooks/             ← useDebounce
└── utils/             ← Status / priority / severity config
```
 
---
 
## ⚠️ Notes & Trade-offs
 
- **Optimistic UI**: Updates appear instantly in the UI and roll back automatically if the API call fails.
- **Server-side filtering**: All search, filter, and pagination params are sent as query strings to the backend — no client-side filtering on the full dataset.
- **Zustand persist**: Auth token and user info are persisted in `localStorage` so sessions survive page refreshes.
- **Response flexibility**: The API client handles multiple server response shapes (`{ issue }`, `{ data }`, or plain object) for compatibility.
---
 
## 👨‍💻 Author
 
Your Name
- Portfolio: https://gihandev.vercel.app/
- GitHub: https://github.com/Gihandev
If you like this project, please give it a ⭐!
