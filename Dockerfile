FROM georgjung/nginx-brotli@sha256:46b8f1eeee2df8e7ed61cd9be97b02d2d18d9af8defefe10bfe09c822bc01e2f
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
