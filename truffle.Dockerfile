# Node image
FROM node:latest

# Create code directory
RUN mkdir /src

# Set working directory
WORKDIR /src

# Install Truffle
RUN npm install -g truffle
    && npm config set bin-links false
