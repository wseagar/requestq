# Use the official Node.js image as the base image
FROM node:16-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application code into the container
COPY . .

# Compile TypeScript code
RUN npm run build

# Expose the port the app runs on
ENV PORT=3888
EXPOSE 3888

# Start the app
CMD ["npm", "start"]