# Use Node 20.19+ to satisfy Nuxt/modern engines, ok for Express too
FROM node:20.19-alpine

WORKDIR /app

COPY package.json package-lock.json* /app/
RUN npm ci --omit=dev

COPY . /app

EXPOSE 4000
CMD ["npm", "start"]
