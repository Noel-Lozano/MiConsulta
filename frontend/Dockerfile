# Use an official Node image
FROM node:23-slim

# Set working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first (for caching installs)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the code
COPY . .

# Build the app for production
RUN npm run build

# Use a simple static server to serve it
RUN npm install -g serve

# Expose port 3000
EXPOSE 3000

# Start the app
CMD ["serve", "-s", "build", "-l", "3000"]
