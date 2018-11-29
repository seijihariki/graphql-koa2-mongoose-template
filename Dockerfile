# Use official Node's alpine image as a base
FROM node:10.5-alpine

# Create an environment variable for our default installation path
ENV INSTALL_PATH /usr/src/api

# Set INSTALL_PATH as the work directory
WORKDIR $INSTALL_PATH

# Copy files that define dependencies
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn

# Copy remaining source code
COPY . .

# Run in development mode
CMD yarn run dev