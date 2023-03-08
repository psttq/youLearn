FROM node:16-alpine as builder
# Set the working directory to /app inside the container
WORKDIR /app
# Copy app files
COPY . .
RUN npm install -g npm@9.2.0
# Install dependencies (npm ci makes sure the exact versions in the lockfile gets installed)
RUN npm ci
# Build the app
CMD ["npm", "run", "start"]

