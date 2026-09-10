FROM nginx:stable-alpine3.17

COPY ./dist /usr/share/nginx/html

COPY ./deploy/run-nginx.sh /etc/nginx/run-nginx.sh 
COPY ./deploy/site.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
WORKDIR /etc/nginx
RUN ["chmod", "+x", "./run-nginx.sh"]
CMD ["./run-nginx.sh"]
