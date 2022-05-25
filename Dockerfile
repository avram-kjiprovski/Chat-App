FROM node:16-alpine3.15
WORKDIR /src

COPY package*.json .
RUN npm install

EXPOSE 8000

CMD ["node", "server.ts"]

