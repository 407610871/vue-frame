FROM nginx:1.13
ENV TZ=Asia/Shanghai
RUN mkdir -p /var/static
WORKDIR /var/static

COPY dist/ ./dist
COPY nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /var/static/dist
COPY entrypoint.sh ./
ENV TIME_ZONE Asia/Shanghai
RUN mkdir -p /var/mount
ENTRYPOINT ["./entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]
