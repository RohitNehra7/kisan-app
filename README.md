# 🌾 Kisan-App (Enterprise Mandi Tracker)

An enterprise-grade, scalable web application designed to track and notify farmers of real-time Mandi (Market) prices across India, specifically optimized for regional localization (e.g., Haryana, Punjab).

## 🏛️ Architecture Overview

The system is designed with a decoupled, microservices-oriented architecture running within a containerized Virtual Environment.

### 1. Frontend Layer (Client)
*   **Tech Stack**: React 18, TypeScript, Vanilla CSS.
*   **Features**:
    *   **PWA (Progressive Web App)**: Service worker (`service-worker.js`) implemented for offline caching. Farmers can view the latest synced prices even without an active 4G/5G connection.
    *   **Localization Engine**: Native Hindi support out-of-the-box (`translations.ts`) with seamless English toggling.
    *   **Responsive Design**: Mobile-first grid layouts for maximum accessibility on lower-end smartphones.

### 2. Backend Service Layer (Server)
*   **Tech Stack**: Node.js, Express, SQLite, Node-Cron.
*   **Features**:
    *   **Secure API Proxy**: Masks the `data.gov.in` API key from public exposure.
    *   **Historical Database**: Integrates `sqlite3` to automatically log and track historical price fluctuations locally, enabling data fallback during government API downtimes.
    *   **Notification Engine**: Utilizes `node-cron` to run scheduled background jobs (e.g., 8:00 AM daily price syncs and simulated SMS alert triggers).

### 3. DevOps & Virtual Environment
*   **Docker Orchestration**: The entire platform is containerized using `docker-compose`. 

---

## 🚀 How to Run the Virtual Environment

We have provided a complete Virtual Environment setup. New developers do not need to install Node or configure databases manually.

### Prerequisites
*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### Step 1: Configure Credentials
Navigate to `server/.env` and insert your Open Government Data API key:
```env
DATA_GOV_API_KEY=your_actual_api_key_here
PORT=5000
```

### Step 2: Launch the Cluster
Open a terminal in the root of `kisan-app` and run:
```bash
docker-compose up --build
```

*   **Frontend UI**: `http://localhost:3000`
*   **Backend API**: `http://localhost:5000`

---

## 📂 Project Structure
```text
kisan-app/
├── docker-compose.yml       # Virtual Environment Orchestrator
├── client/                  # React Frontend
│   ├── public/
│   │   ├── service-worker.js # PWA Offline Caching
│   │   └── manifest.json
│   ├── src/
│   │   ├── App.tsx          # Main UI Component
│   │   ├── App.css          # Enterprise Styles
│   │   ├── translations.ts  # Localization Dictionary
│   │   └── index.tsx        # Service Worker Registration
│   └── Dockerfile           # Client Container Config
└── server/                  # Node.js Backend
    ├── index.js             # Express API, SQLite DB, Cron Jobs
    ├── .env                 # Secrets (Do Not Commit)
    └── Dockerfile           # Server Container Config
```

---
*Managed and orchestrated autonomously via AI Project Management.*
