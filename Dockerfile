FROM georgjung/nginx-brotli@sha256:5496e5664a0c1beaab8b1c0e16af42fa8cd8a9e592a63093beb911c0c6ca464f
LABEL org.opencontainers.image.source=https://github.com/MatthiasKunnen/gino

COPY ./nginx.conf /etc/nginx/nginx.conf

ARG REVISION
ENV REVISION=$REVISION
LABEL org.opencontainers.image.revision=$REVISION

LABEL org.opencontainers.image.title="Gino website"

WORKDIR /usr/share/nginx/html

COPY ./build ./

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
