# Use a base image with Node.js and Python
FROM node:18-bullseye

# Install system dependencies
RUN apt-get update && \
    apt-get install -y python3.9 python3.9-distutils python3-pip && \
    python3.9 -m pip install --upgrade pip
# Set the working directory
WORKDIR /app

# Copy application files
COPY . .

# Install Python dependencies
RUN pip3 install --no-cache-dir -r requirements.txt

# Install Node.js dependencies
RUN npm install --legacy-peer-deps

# Ensure the uploads directory exists
RUN mkdir -p uploads && chmod -R 755 uploads

# Expose the application port
EXPOSE 4000

# Start the application
CMD ["npm", "start"]
