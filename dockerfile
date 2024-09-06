FROM node:18-bullseye-slim

# Create app directory
WORKDIR /usr/api/app/

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

# If you are building your code for dev
RUN npm install

# If you are building your code for production
# RUN npm ci --omit=dev

# Bundle app source
COPY . .

# Port Enviroment Variable
ENV PORT=3000

# exposing docker to localhost
EXPOSE 1337

# Running the app in dev
CMD [ "npm", "run","dev" ]

# Running the app in prod
# CMD [ "npm", "run","start" ]

# To build Image
# docker build -t API:1.0.0 .

# To use the docker
# docker run -p 127.0.0.1:1337:3000 -t API:1.0.0