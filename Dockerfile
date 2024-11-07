# Frontend Dockerfile

FROM node:18

WORKDIR /app

COPY package*.json ./

# Install with the --legacy-peer-deps flag to bypass dependency conflicts
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
