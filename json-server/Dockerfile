FROM node:16-alpine

WORKDIR /data

RUN npm install -g json-server

COPY entrypoint.sh /entrypoint.sh
COPY default-db.json /default-db.json
RUN chmod +x /entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]