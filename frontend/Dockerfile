# Use Node image
FROM node:18

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Default command (will be overridden by docker-compose)
CMD ["npm", "start"]

