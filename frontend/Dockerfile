# Stage 1: Build React application
FROM node:18 AS build

WORKDIR /frontendapp

COPY package.json .
RUN npm install
COPY . .

RUN ls -la /frontendapp

RUN npm run build

# Stage 2: Serve the application with Nginx
FROM nginx:alpine

COPY --from=build /frontendapp/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
