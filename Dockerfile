#pull the alpine os image from docker
FROM node:20-alpine
#set the current working directory to app folder inside container
WORKDIR /usr/app
#copy package.json file to container from current directory
COPY package.json ./
#install all the dependecies
RUN npm install
#copy all dependecies to container
COPY . .
#build the project inside container
#RUN npm run build
#copy .next folder from current folder to container
#COPY .next ./.next
#run the npm run dev command to start project
CMD ["npm", "run", "dev"]