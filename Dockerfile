FROM node:20-alpine AS runtime
WORKDIR /app

# Install only production deps
COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

# Copy built files (assumes build done outside)
COPY dist ./dist

ENV NODE_ENV=production
EXPOSE 4000
CMD ["node", "dist/server.fg.js"]
