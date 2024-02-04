FROM node:18.16.0-alpine

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install -g http-server
RUN npm install
COPY . .

RUN npm run build:bundle

EXPOSE 8585

CMD ["http-server", "--port", "8585", "--cors", "bundle.js"]
