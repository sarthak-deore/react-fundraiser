

# Use the official Node.js image from the Docker Hub
FROM node:18-alpine


ENV NODE_OPTIONS=--openssl-legacy-provider
# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the dependencies defined in package.json
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port that your app will run on
EXPOSE 3000

# Define the command to run your application
CMD ["sh", "-c", "npm run build && npx serve -s build"]