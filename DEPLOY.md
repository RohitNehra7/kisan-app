# 🚀 Kisan-App Production Deployment Guide

Follow these steps to deploy the enterprise-grade platform for free.

## 1. Backend Deployment (Render.com)
1.  **Create Account**: Sign up at [Render.com](https://render.com).
2.  **New Web Service**: Click `New +` -> `Web Service`.
3.  **Connect GitHub**: Select your repository.
4.  **Configuration**:
    *   **Runtime**: `Node`
    *   **Build Command**: `cd server && npm install && npm run build`
    *   **Start Command**: `cd server && npm start`
5.  **Environment Variables**: Add these in the Render Dashboard:
    *   `DATABASE_URL`: Your Supabase connection string.
    *   `SUPABASE_URL`: Your Supabase Project URL.
    *   `SUPABASE_KEY`: Your Supabase API Key (service_role recommended for metadata discovery).
    *   `DATA_GOV_API_KEY`: Your OGD India API Key.
    *   `GEMINI_KEY`: Your Google Gemini API Key.
    *   `PORT`: `5000`

## 2. Frontend Deployment (Vercel.com)
1.  **Create Account**: Sign up at [Vercel.com](https://vercel.com).
2.  **New Project**: Click `Add New` -> `Project`.
3.  **Connect GitHub**: Select the same repository.
4.  **Configuration**:
    *   **Root Directory**: `client`
    *   **Framework Preset**: `Create React App`
5.  **Environment Variables**:
    *   `REACT_APP_API_URL`: The URL provided by Render (e.g., `https://kisan-api.onrender.com`).

## 3. Post-Deployment Verification
1.  Check that `https://your-app.vercel.app` loads the UI.
2.  Verify the Weather widget and Fav icons.
3.  Click `📈 View Trends` to ensure the Supabase cloud connection is active.

---
*Note: The PWA features will automatically activate once the app is served over HTTPS (standard on Vercel).*
