FROM nginx:1.23

COPY public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf.template
COPY docker-entrypoint.sh /docker-entrypoint.d/05-docker-entrypoint.sh

RUN chmod +x /docker-entrypoint.d/05-docker-entrypoint.sh

EXPOSE 5000

LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned
