# 🌾 KisanNiti (किसान नीति) - Enterprise Mandi Engine

KisanNiti is a high-performance, data-driven decision engine for Indian farmers. It provides real-time Mandi (market) price tracking, AI-powered "Sell or Hold" advisory, and localized weather intelligence.

## 🏛️ Enterprise Architecture

The system follows a **Modular Monorepo** pattern, built for high availability and low-connectivity environments.

### 1. Frontend & Mobile (client/)
*   **Tech Stack**: React (TypeScript), Framer Motion, Recharts.
*   **Mobile Bridge**: [Capacitor](https://capacitorjs.com/) for native Android deployment.
*   **Intelligence**: Localized hierarchical filtering (State -> Mandi -> Crop).
*   **Visuals**: Premium design with MSP (Minimum Support Price) comparison badges.

### 2. Backend API (server/)
*   **Tech Stack**: Node.js, Express, TypeScript.
*   **Architecture**: Modular Service-Controller-Route pattern.
*   **AI Engine**: Powered by Google Gemini (Multi-model fallback chain).
*   **Data Sync**: Autonomous Discovery Engine syncing 5,000+ records from `data.gov.in`.
*   **Persistence**: Supabase Cloud (PostgreSQL).

---

## 📱 The App-Based Approach

KisanNiti uses a **Web-to-Native** bridge. 99% of the code is shared between the web app and the mobile app.

### Development Workflow
1.  **Code**: Work in `client/src`.
2.  **Web Build**: `cd client && npm run build`.
3.  **Mobile Sync**: `npx cap sync android` (pushes web build to the Android project).
4.  **Native Build**: Use Android Studio to generate the `.apk`.

---

## 🏗 Project Structure

```text
kisan-app/
├── client/              # React Web Application
│   ├── src/             # Shared UI & Decision Logic
│   └── android/         # Native Android Shell (Managed by Capacitor)
├── server/              # TypeScript Backend API
│   ├── src/services/    # Independent Logic Layers (Mandi, Weather, AI)
│   ├── src/controllers/ # API Request Handlers
│   └── src/routes/      # Endpoint Definitions
└── .github/             # Enterprise CI/CD Pipeline
```

---

## 🚀 Deployment

### Backend (Render)
*   Build: `cd server && npm install && npm run build`
*   Start: `cd server && npm start`

### Frontend (Vercel)
*   Root Directory: `client`
*   Framework: `Create React App`

---
*Managed and orchestrated with Staff Engineering rigor via Gemini CLI.*
