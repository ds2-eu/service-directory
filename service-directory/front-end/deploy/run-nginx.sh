#!/usr/bin/env sh
cd "/usr/share/nginx/html"
envsubst < "config.json.src" > "config.json"
exec nginx -g 'daemon off;'
