FROM node:20.12.2-buster-slim
WORKDIR /app
COPY package*.json ./
RUN npm install --legacy-peer-deps && npm audit fix --force
COPY . ./
EXPOSE 3000
CMD ["npm", "run", "start"]
