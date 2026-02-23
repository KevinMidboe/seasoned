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

FROM nginx:1.29.5

# Copy the static build from the previous stage
COPY index.html /usr/share/nginx/html
COPY public/ /usr/share/nginx/html
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx config file
COPY nginx.conf /etc/nginx/conf.d/default.conf.template

# Manual entrypoint after nginx substring
COPY docker-entrypoint.sh /docker-entrypoint.d/05-docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.d/05-docker-entrypoint.sh

EXPOSE 5000

LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned
