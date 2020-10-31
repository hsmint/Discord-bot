FROM node:lts-alpine

WORKDIR '/discord'

RUN apk add ffmpeg
COPY package.json .

RUN npm install

COPY . .
CMD ["node", "index.js"]
