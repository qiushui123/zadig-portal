FROM arm64v8/nginx

WORKDIR /zadig-portal

ADD dist/ /zadig-portal/

ADD zadig-nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
