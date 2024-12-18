FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
RUN apt-get update && apt-get install -y postgresql-client

COPY . .

EXPOSE 3000
CMD ["npm", "run", "dev"]
