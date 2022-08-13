FROM nginx:1.23.1

COPY public /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 5000

LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned
