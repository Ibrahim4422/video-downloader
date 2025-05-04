# Stage 1: Build the Next.js frontend
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code and build the app
COPY . .
RUN npm run build

# Stage 2: Run the production server
FROM node:18-alpine AS runner

WORKDIR /app

# Copy only what's needed for production
COPY package*.json ./
RUN npm install --omit=dev

# Copy the built app and static assets
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/package.json ./package.json

EXPOSE 3000

CMD ["npm", "start"]
