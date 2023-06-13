FROM --platform=$BUILDPLATFORM node:alpine

WORKDIR /app

COPY . .

RUN npm install

EXPOSE 8080/tcp

CMD ["npm", "run", "dev"]