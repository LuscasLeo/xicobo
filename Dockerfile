FROM node:14-alpine


WORKDIR /home/app

COPY . .


RUN npm install

RUN npm run build

ENTRYPOINT [ "npm", "start" ]