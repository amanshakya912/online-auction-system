# Use a base image with Node.js and Python
FROM node:16-bullseye

# Install Python dependencies
RUN apt-get update && \
    apt-get install -y python3 python3-pip && \
    pip3 install numpy joblib

# Set the working directory in the container
WORKDIR /app

# Copy application files
COPY . .

# Install Node.js dependencies
RUN npm install

# Expose the application port
EXPOSE 3000

# Start the application
CMD ["npm", "start"]
