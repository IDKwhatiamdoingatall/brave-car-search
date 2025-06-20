# Use an official Node.js runtime
FROM node:18

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of your app
COPY . .

# Expose port
EXPOSE 3000

# Start the app
CMD [ "npm", "start" ]
