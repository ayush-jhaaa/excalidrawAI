# 1. Base image
FROM node:18-alpine

# 2. Create app directory
WORKDIR /app

# 3. Install dependencies
COPY package*.json ./
RUN npm install

# 4. Copy source code
COPY . .

# 5. Build TypeScript → JavaScript
RUN npm run build

# 6. Run the compiled app
CMD ["node", "dist/server.js"]

# Optional: expose port (change if needed)
EXPOSE 3000
