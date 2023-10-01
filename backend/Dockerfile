# Use the official Node.js 18 image.
FROM node:18

# Create and change to the app directory.
WORKDIR /backend

# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY package*.json ./

# Install production dependencies.
RUN npm ci

RUN npm i -g @nestjs/cli typescript ts-node

# Copy local code to the container image.
COPY . .

# Copy .env file
COPY .env ./

# Build the application
RUN npm run build

# Run the web service on container startup.
CMD [ "npm", "run", "start:prod" ]
