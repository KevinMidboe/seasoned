FROM node:24.13.1 AS build

# Set the working directory for the build stage
WORKDIR /app

# Install dependencies
COPY package.json yarn.lock .
RUN yarn install --frozen-lockfile

# Copy source files that the build depends on
COPY index.html .
COPY public/ public/
COPY src/ src/
COPY tsconfig.json vite.config.ts .

ARG SEASONED_API=http://localhost:31459
ENV VITE_SEASONED_API=$SEASONED_API

ARG ELASTIC_URL=http://elastic.local:9200/tmdb-movies-shows
ENV VITE_ELASTIC_URL=$ELASTIC_URL
ARG ELASTIC_API_KEY=
ENV VITE_ELASTIC_API_KEY=$ELASTIC_API_KEY

RUN yarn build

FROM caddy:2.11-alpine

COPY Caddyfile /etc/caddy/Caddyfile

# Copy static files
COPY public /usr/share/caddy

# Copy the static build from the previous stage
COPY --from=build /app/dist /usr/share/caddy

EXPOSE 8080

LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned
