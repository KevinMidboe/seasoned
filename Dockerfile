FROM node:18-alpine3.15
LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned

RUN apk update && apk add curl && apk add nginx

RUN mkdir -p /opt/seasoned/node_modules
WORKDIR /opt/seasoned

COPY src /opt/seasoned/src
COPY public /opt/seasoned/public
COPY yarn.lock /opt/seasoned
COPY package.json /opt/seasoned
COPY server.ts /opt/seasoned
COPY webpack.config.js /opt/seasoned
COPY nginx.conf /etc/nginx/http.d/default.conf
COPY tsconfig**.json /opt/seasoned/

RUN chown -R node:node /opt/seasoned

USER node

RUN yarn install

RUN yarn build

EXPOSE 5000

CMD ["yarn", "start"]
