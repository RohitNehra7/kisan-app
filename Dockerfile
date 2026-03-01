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

EXPOSE 5000

CMD ["node", "index.js"]
