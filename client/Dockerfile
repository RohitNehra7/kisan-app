FROM node:20-alpine

WORKDIR /usr/src/app

COPY package*.json ./
# Use .npmrc if available or explicitly use legacy-peer-deps
RUN npm install --legacy-peer-deps

COPY . .

# Build the app for production
RUN npm run build

EXPOSE 3000

# We use a simple server to serve the build in production, 
# or keep npm start if it's for dev within docker
CMD ["npm", "start"]
