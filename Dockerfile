FROM node:19-alpine

WORKDIR /app

COPY . .

RUN yarn install && yarn build

CMD ["yarn", "start"]
