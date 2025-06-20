# Use Node.js 18 as base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Start the server
CMD ["node", "server.js"]
