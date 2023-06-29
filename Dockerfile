FROM node

WORKDIR /app

COPY . .

RUN npm install

COPY .env.production .env

EXPOSE 3000

CMD ["npm", "run", "start" ]