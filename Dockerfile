FROM node

WORKDIR /app

COPY . .

RUN npm install

COPY .env.development .env

EXPOSE 3000

CMD ["npm", "run", "start:dev" ]