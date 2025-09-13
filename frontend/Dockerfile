# Multi-stage build for Nuxt 3
FROM node:20.19-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* /app/
RUN npm ci

FROM node:20.19-alpine AS build
WORKDIR /app
COPY --from=deps /app/node_modules /app/node_modules
COPY . /app
# Accept proxy target during build so nuxt.config.ts can read it
ARG NUXT_PROXY_TARGET
ENV NUXT_PROXY_TARGET=${NUXT_PROXY_TARGET}
RUN npm run build

FROM node:20.19-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
# Keep proxy target available at runtime (not strictly required if baked)
ARG NUXT_PROXY_TARGET
ENV NUXT_PROXY_TARGET=${NUXT_PROXY_TARGET}
# Copy only necessary files
COPY --from=build /app/.output /app/.output
# Expose port used by Nitro server
EXPOSE 3000
# The Nitro server entry
CMD ["node", ".output/server/index.mjs"]
