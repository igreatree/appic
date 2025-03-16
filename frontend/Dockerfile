FROM node:23

WORKDIR /app/frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

RUN npm install --global serve

CMD ["serve", "dist", "-l", "80"]