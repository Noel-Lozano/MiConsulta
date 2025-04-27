# 1. Base image
FROM node:20

# 2. Set working directory inside the container
WORKDIR /app

ENV NODE_OPTIONS=--openssl-legacy-provider

# 3. Copy only package.json and package-lock.json first (better for caching Docker layers)
COPY package*.json ./

# 4. Install dependencies
RUN npm install

# 5. Now copy the rest of the app
COPY . .

# 6. Build optimized static files (this generates /build)
RUN npm run build

# 7. Install a simple static server
RUN npm install -g serve

# 8. Default command when container starts: Serve the built site
CMD ["serve", "-s", "build", "-l", "3000"]
