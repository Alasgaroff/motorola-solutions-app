
# My Motorola Solutions Application

## Overview

This project is a full-stack application for managing orders and products. It uses a React frontend and an Express backend, both containerized with Docker. This README provides setup instructions, Docker configurations, and an overview of the project structure.

## Table of Contents

- [Getting Started](#getting-started)
- [Folder Structure](#folder-structure)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Styling and Functionality](#styling-and-functionality)
- [Contributing](#contributing)

## Getting Started

To get started with this project, follow these steps:

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Alasgaroff/motorola-solutions-app.git
   cd motorola-solutions-api
   ```

2. **Install Dependencies**
   Ensure you have Docker and Docker Compose installed. You can get Docker from [Docker's official website](https://www.docker.com/products/docker-desktop).

## Folder Structure

Here is the main folder structure of the project:

```
.
├── backend
│   ├── Dockerfile
│   ├── index.js
│   ├── models
│   ├── routes
├── frontend
│   ├── Dockerfile
│   ├── public
│   ├── src
├── docker-compose.yml
└── nginx.conf
```

### Key Folders and Files

- **`backend`**: Contains the Express backend application.
  - `Dockerfile`: Defines the backend Docker image.
  - `index.js`: The main entry point of the backend application.
  - `models/`: Contains database models.
  - `routes/`: Contains API route handlers.

- **`frontend`**: Contains the React frontend application.
  - `Dockerfile`: Defines the frontend Docker image.
  - `public/`: Static assets and configuration files.
  - `src/`: Source code for React components and application logic.

- **`docker-compose.yml`**: Defines the Docker Compose configuration for managing multi-container Docker applications.

- **`nginx.conf`**: Nginx configuration file for serving the frontend.

## Docker Setup

### Build and Run Docker Containers

1. **Build and Run the Containers**
   ```bash
   docker compose up --build
   docker compose build --no-cache
   ```

   **Build without cache and Run the Containers**
   ```bash
   docker compose build --no-cache
   docker compose up
   ```

2. **Stop and Remove Containers**
   ```bash
   docker compose down
   ```
## Test

### Run Tests with Docker Compose

   ```bash
   docker compose run test
   ```


### Important Docker-Specific Configurations

- **Volume Mappings**: Ensure persistent data is handled properly by configuring volume mappings in the `docker-compose.yml` file if needed.
- **Network Configurations**: The `docker-compose.yml` file handles network configurations to allow communication between frontend and backend services.

## API Documentation

### Endpoints

- **Login**
  - `POST /login`: Authenticates a user and returns a JWT token.
  - Request Body: `{ "username": "string", "password": "string" }`
  - Response: `{ "token": "string" }`

- **Orders**
  - `GET /orders`: Fetches all orders.
  - `POST /orders`: Creates a new order.
  - Request Body: `{ "customerName": "string", "products": [{ "productId": "number", "quantity": "number" }], "destination": "string" }`

- **Products**
  - `GET /products`: Fetches all products.
  - `POST /products`: Creates a new product.
  - Request Body: `{ "name": "string", "price": "number" }`

## Styling and Functionality

### App Component

- Displays navigation buttons for different pages.
- Requires login before accessing other functionalities.
- Once logged in, all navigation buttons become visible.

### Authentication Handling

The application includes functionality to manage authentication states, hide or show navigation buttons based on the login status, and display appropriate messages.

