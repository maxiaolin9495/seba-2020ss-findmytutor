# build environment
FROM node:alpine as build

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH

ARG BACKEND_URI
ENV BACKEND_URI=${BACKEND_URI}

# install app dependencies
COPY package.json ./
# COPY package-lock.json ./
RUN npm install 
# --silent

# build app
COPY . ./
RUN npm run build

# production environment
FROM nginx:stable-alpine
COPY --from=build /app/dist /usr/share/nginx/html
# nginx with react-router configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]