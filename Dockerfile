# Master Dockerfile for Render Mono-repo Deployment
FROM node:20-alpine

WORKDIR /usr/src/app

# 1. Install Dependencies
COPY server/package*.json ./server/
RUN cd server && npm install --legacy-peer-deps

# 2. Copy Source and Build
COPY server/ ./server/
RUN cd server && npm run build

# 3. Final Prep
WORKDIR /usr/src/app/server
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

# Start the compiled JavaScript
CMD ["node", "dist/index.js"]
