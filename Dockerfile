# Dockerfile

# Set the base image
FROM node:14

# Set the working directory in the container to /app
WORKDIR /app

# Copy the package.json and package-lock.json
COPY package*.json ./

# Install dependencies in the docker container
RUN npm install
RUN npm i bcrypt
# Copy the rest of your app's source code from your host to your image filesystem.
COPY . .

# Expose the port
EXPOSE 4742

# The command to run your application when the docker container starts
CMD [ "node", "server.js" ]
