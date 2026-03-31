# 🎥 StreamHQ - Secure Video Streaming & Analysis Platform

A full-stack MERN application that enables secure video uploads, real-time content sensitivity analysis, and adaptive video streaming. This project features a multi-tenant architecture with role-based access control and a premium, responsive UI.

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

---

## 📸 Application Screenshots

### 1. Video Playing Output
The secure entry point featuring a cyberpunk-inspired glassmorphism UI. Users can register or login to their specific workspace.
<img width="100%" alt="Active Dashboard" src="https://github.com/user-attachments/assets/ebb31073-adec-4915-9a59-505a4c2aada7">

### 2. Content Library (Dashboard)
The main interface displaying the grid of uploaded videos. Features include status badges (Safe/Flagged), real-time processing indicators, and hover animations.
<img width="100%" alt="Login Screen" src="https://github.com/user-attachments/assets/a766d4cd-f729-43fd-b46a-5f9a897dc5d4">

### 3. Empty State & Upload
The initial view for new workspaces, featuring the drag-and-drop upload zone and a clean zero-data state.
<img width="100%" alt="Empty Dashboard" src="https://github.com/user-attachments/assets/d20a3c98-db32-4883-9427-70055700e314">

---

## ✨ Features

### 🚀 Core Functionality
* **Video Management:** Secure upload and storage of video content.
* **Real-Time Processing:** Live progress updates during video analysis using Socket.io.
* **Sensitivity Analysis:** Automated simulation that flags content as "Safe" or "Flagged" based on sensitivity.
* **Adaptive Streaming:** Seamless playback using HTTP Range Requests (206 Partial Content).
* **Multi-Tenancy:** Data isolation where users only see videos belonging to their Organization/Workspace.

### 🎨 User Interface
* **Modern Design:** High-end "Glassmorphism" aesthetic using Tailwind CSS.
* **Interactive UI:** Drag-and-drop uploads, animated cards, and ambient lighting effects.
* **Responsive:** Fully optimized for desktop and mobile devices.

### 🛡️ Security
* **RBAC (Role-Based Access Control):** Differentiates between Viewers and Admins.
* **JWT Authentication:** Secure stateless authentication.
* **Content Locking:** Automatically locks playback for flagged content for non-admin users.
* **Admin Console:** Workspace admins can inspect members and adjust viewer/editor/admin roles directly from the dashboard.

---

## 🛠️ Tech Stack

### Frontend
* **React (Vite):** Fast, modern UI library.
* **Tailwind CSS:** Utility-first styling with custom animations.
* **Socket.io-client:** Real-time bi-directional communication.
* **Axios:** HTTP client with global interceptors for auth.

### Backend
* **Node.js & Express:** Scalable server-side runtime.
* **MongoDB & Mongoose:** NoSQL database for flexible data modeling.
* **Socket.io:** Real-time event handling.
* **Multer:** Middleware for handling `multipart/form-data`.
* **JWT:** JSON Web Tokens for secure transmission of information.

---
##Frontend Setup
cd client

# Install dependencies
npm install

# Start the development server
npm run dev

##Backend Setup
cd server

# Install dependencies
npm install

# Create uploads directory (if not exists)
mkdir uploads

# Start the server
# (Ensure MongoDB is running locally or set MONGO_URI in a .env file)
npm run dev
# OR
node server.js

---
---

## 📂 Project Structure

```bash
video-streaming-app/
├── server/                 # Backend (Node/Express)
│   ├── config/             # DB and File configurations
│   ├── controllers/        # Logic for Auth and Videos
│   ├── middleware/         # Auth & Error Middleware
│   ├── models/             # Mongoose Schemas (User, Video)
│   ├── services/           # Video Processing Simulation
│   ├── uploads/            # Local video storage
│   └── server.js           # Entry point
│
└── client/                 # Frontend (React/Vite)
    ├── src/
    │   ├── components/     # Reusable UI (UploadForm, Player)
    │   ├── context/        # Auth & Global State
    │   ├── pages/          # Login & Dashboard Views
    │   └── main.jsx        # App Entry
    └── tailwind.config.js  # Styling Configuration

---

## ✅ Manual Verification Checklist

1. **Auth & Access Control**
   - Start MongoDB and run `npm start` inside `server/`.
   - Register a new account at `http://localhost:5174` (client) with an Organization ID, then log in; confirm tokens are stored in `localStorage`.
2. **Video Upload & Processing**
   - Upload a small MP4 via the dashboard.
   - Watch Socket.io toasts/logs update progress in ~20% increments until classification flips to Safe/Flagged.
3. **Filtering & Library**
   - Use the dashboard filters (status, sensitivity, search) to narrow the list; ensure the query string sent to `/api/videos` contains the expected params.
4. **Streaming**
   - Open a completed + safe video card, click **Watch Secure Stream**, and confirm playback issues HTTP 206 responses (check DevTools Network tab).
   - Attempt to stream a flagged video as a non-admin user; the API should return `403 Content flagged as sensitive`.
5. **Health Check**
   - Run `curl http://localhost:5001/api/auth/health` after restarting the backend to verify the service is online.

## 🧪 Testing

Backend smoke tests cover auth, RBAC upload restrictions, and admin management flows. Run them from the `server/` directory:

```bash
cd server
npm test
```

## 📡 API Reference

| Endpoint | Method | Description | Auth | Roles |
| --- | --- | --- | --- | --- |
| `/api/auth/register` | POST | Create a new user with `{ username, password, organizationId, role }`. | Public | — |
| `/api/auth/login` | POST | Exchange credentials for a JWT (returned along with user profile). | Public | — |
| `/api/videos/upload` | POST | Upload a video (`multipart/form-data` with `video` + `title`). | Bearer token | editor, admin |
| `/api/videos` | GET | List organization videos. Accepts `status`, `sensitivity`, `search` query params. | Bearer token | viewer, editor, admin |
| `/api/videos/stream/:id` | GET | HTTP range-enabled streaming of a processed video (adds `token` query fall back for `<video>` tag). | Bearer token | viewer (safe only), editor (safe only), admin (all) |
| `/api/admin/users` | GET | List members of the caller’s organization. | Bearer token | admin |
| `/api/admin/users/:id` | PATCH | Update a member’s role (`viewer/editor/admin`). | Bearer token | admin |
| `/api/auth/health` | GET | Lightweight health probe. | Public | — |

## 👤 User Manual

1. **Sign Up / Login**
   - Open the client (default Vite dev server on `http://localhost:5174`).
   - Register with username, password, organization ID, and a role (viewer/editor/admin). Log in with the same credentials; tokens persist in `localStorage`.
2. **Dashboard Overview**
   - Header shows your organization and role chip. Viewer accounts get a read-only notice; editors/admins see the upload module; admins additionally see the organization member panel.
3. **Uploading**
   - Drag-and-drop or click to select a video, enter a title, and hit “Upload Content.” Progress indicators disable the button until completion. Each successful upload triggers the processing pipeline automatically.
4. **Processing Feedback**
   - Watch the grid cards for progress bars and Socket.io driven updates. “Processing” cards show the current percentage; completed cards get Safe/Flagged badges.
5. **Review & Streaming**
   - Use the filters (status, sensitivity, search) to locate assets. Safe videos expose “Watch Stream,” opening the secure player with HTTP 206 streaming. Flagged videos stay locked unless you’re an admin.
6. **Admin Management**
   - Admins can scroll to the “Organization Members” panel to inspect users and change their roles via the inline select boxes. Updates happen instantly through the admin API.

## 🏗️ Architecture Overview

- **Frontend (client/):** React + Vite single-page app with context-based auth, Axios for API calls, Socket.io client for real-time updates, and role-driven conditional rendering.
- **Backend (server/):** Express REST API organized into controllers/middleware/routes, Mongoose models for Users and Videos, and a simulated sensitivity-processing service that broadcasts Socket.io events.
- **Real-Time Layer:** Socket.io (HTTP upgrade on the same Node server) informs clients about processing progress and sensitivity outcomes; each user joins a private room keyed by user ID.
- **Storage & Data:** MongoDB (Atlas or local) holds users/videos. Binary uploads live on disk (`server/uploads`) with sanitized filenames; streaming leverages HTTP range requests for efficient playback.
- **Security:** JWT auth, role-based middleware for uploads/admin endpoints, tenant checks on every query, bcrypt password hashing, and `.env` driven configuration so secrets stay out of version control.

## 📌 Assumptions & Design Decisions

- **Sensitivity Engine:** The current implementation simulates AI classification with deterministic progress updates and a random safe/flagged outcome (30% chance). It’s structured so a real ML service can replace `services/videoProcessor.js`.
- **Local File Storage:** Videos are stored on the server filesystem for simplicity. In production you’d map the Multer destination to object storage (S3, GCS) but the code isolates the storage layer for easy swaps.
- **Role Defaults:** New users default to `editor` unless they explicitly choose another role. Admin creation is allowed at signup for bootstrap purposes; production deployments should gate this (e.g., invite codes).
- **Tenant Isolation:** All queries filter by `organizationId` taken from the JWT, assuming users belong to exactly one workspace. Cross-org collaboration is out of scope.
- **Streaming Authorization:** Download URLs require either an `Authorization` header or a `token` query param (used only by the HTML `<video>` tag). Tokens are short-lived (1 day) and refreshed on login.
- **Testing Scope:** Jest-based tests focus on critical auth/RBAC flows. UI tests and load testing are intentionally deferred but the structure accommodates additional suites if needed.
