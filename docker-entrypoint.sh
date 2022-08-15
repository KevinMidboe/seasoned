#!/bin/sh
set -eu

export SEASONED_API=${SEASONED_API:-http://localhost:31459}
export SEASONED_DOMAIN=${SEASONED_DOMAIN:-localhost}

envsubst '$SEASONED_API,$SEASONED_DOMAIN' < /etc/nginx/conf.d/default.conf.template > /etc/nginx/conf.d/default.conf

exec "$@"
