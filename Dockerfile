FROM caddy@sha256:b4e3952384eb9524a887633ce65c752dd7c71314d2c2acf98cd5c715aaa534f0

LABEL org.opencontainers.image.source=https://github.com/MatthiasKunnen/gino

COPY caddyfile.json /etc/caddy/caddyfile.json

ARG REVISION
ENV REVISION=$REVISION
LABEL org.opencontainers.image.revision=$REVISION

LABEL org.opencontainers.image.title="Gino website"

COPY build /srv

CMD ["caddy", "run", "--config", "/etc/caddy/caddyfile.json"]
