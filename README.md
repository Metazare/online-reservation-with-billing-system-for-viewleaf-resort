# MERN Stack Web Application Template

This is a template for building web applications using the MERN (MongoDB, Express.js, React, Node.js) stack. It provides a starting point for your project with the basic folder structure and setup.

## Tech Stack

- **MongoDB:** A NoSQL database to store your application's data.
- **Express.js:** A Node.js web application framework for building the backend API.
- **React:** A JavaScript library for building user interfaces.
- **Node.js:** A server-side runtime environment to run your web application.

## Getting Started

Follow these steps to get your MERN stack application up and running:

1. **Clone this repository to your local machine:**
  ```shell
  git clone https://github.com/Metazare/Template-MERN-Web-Application
  ```

2. **Setup client side development:**

    2.2. Navigate to the project folder:
    ```shell
      cd client
    ```
    2.3. Install client dependencies:
    ```shell
      npm install
    ```
    2.4. Create a .env file in the client root and configure your environment variables:
    ```env
      REACT_APP_API_URL = your-server-url
    ```
    2.5. Start the client development servers:
    ```shell
      npm start
    ```  

2. **Setup server side development:**

    2.2. Navigate to the project folder:
    ```shell
      cd server
    ```
    2.3. Install server dependencies:
    ```shell
      npm install
    ```
    2.4. Create a .env file in the server root and configure your environment variables:
    ```env
      CORS_ORIGIN = your-client-url
      MONGO_URI = your-mongodb-connection-string
      JWT_ACCESS = your-secret-key
      JWT_REFRESH = your-secret-key
      EMAIL = admin@example.com
      NODEMAILER_EMAIL = admin@example.com
      NODEMAILER_PASSWORD = admin123
      NODE_ENV = development
      PASSWORD = admin
      USERNAME = admin
      SEMAPHORE_KEY = Semaphore Secret API Key
      SEMAPHORE_SENDER = Semaphore Sender Name
      PAYMONGO_SECRET = Paymongo Secret Key
    ```
    2.5. Start the server development servers:
    ```shell
      npm run dev
    ```