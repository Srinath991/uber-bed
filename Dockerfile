# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of your code
COPY . .

# Expose the app port
EXPOSE 3000

# Command to run the app
CMD ["node", "app.js"]
