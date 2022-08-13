FROM nginx:1.23.1
LABEL org.opencontainers.image.source https://github.com/kevinmidboe/seasoned

# RUN mkdir -p /opt/seasoned
# WORKDIR /opt/seasoned

# COPY src /opt/seasoned/src
# COPY public /opt/seasoned/public
COPY public /usr/share/nginx/html
# COPY yarn.lock /opt/seasoned
# COPY package.json /opt/seasoned
# COPY server.ts /opt/seasoned
# COPY webpack.config.js /opt/seasoned
COPY nginx.conf /etc/nginx/conf.d/default.conf
# COPY tsconfig**.json /opt/seasoned/

# RUN chown -R node:node /opt/seasoned

# USER node

# RUN yarn install

# RUN yarn build

EXPOSE 5000

# CMD ["yarn", "start"]
