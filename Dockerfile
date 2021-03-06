FROM node:buster

# Set working directory
WORKDIR /app
COPY . .

# Add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

# Install and cache app dependencies
COPY package.json /app/package.json
RUN npm install --silent
RUN npm install react-scripts@3.0.1 -g --silent
RUN npm install serve -g --silent

# Start app
CMD npm run build && serve build -s -l $PORT
