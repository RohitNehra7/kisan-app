# Master Dockerfile for Render Mono-repo Deployment
FROM node:18-alpine

WORKDIR /usr/src/app

# Copy server package files and install
COPY server/package*.json ./server/
RUN cd server && npm install

# Copy server source code
COPY server/ ./server/

# Move into server directory
WORKDIR /usr/src/app/server

# Build-time environment placeholders (Render will override these at runtime)
ENV PORT=5000
ENV NODE_ENV=production

EXPOSE 5000

# Use array form for CMD to properly handle signals and env vars
CMD ["node", "index.js"]
