# Use the official Node.js image as a base image
FROM node:20

# Set the working directory in the container
WORKDIR /src

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the backend code to the container
COPY . .

# Exponer el puerto que utiliza tu aplicación Node.js
EXPOSE 3001

# Iniciar la aplicación Node.js
CMD ["npm", "run", "dev"]
