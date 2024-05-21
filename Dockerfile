# Import OS for docker [cached]
FROM node:20-alpine3.16

# Create working directory [cached]
WORKDIR /app

# Copy package.json contents [cached]
COPY package*.json .

# Install packages [cached]
RUN npm install

# Copy all contents in the project root directory into the app directory
COPY . .

FROM base as production

ENV NODE_PATH=./build

RUN npm run build

# Expose port to external connection
EXPOSE 3000

# Run command to start the application
CMD ["npm", "start"]