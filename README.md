# Taskie

Taskie is a full-stack web application for efficient task management. It features a React-based frontend for a smooth user experience and a Node.js backend API for robust data management and authentication.

## Features

- User authentication (register, login)
- Create, read, update, and delete tasks
- Task filtering and sorting
- Responsive design for mobile and desktop
- JWT-based authorization
- RESTful API
- MongoDB database for data persistence

## Tech Stack

### Frontend
- React.js
- Axios for API requests
- Tailwind CSS for styling

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose ORM
- JSON Web Tokens (JWT) for authentication
- bcrypt for password hashing

## Prerequisites

Before you begin, ensure you have met the following requirements:
- Node.js (v14.0.0 or later)
- npm (v6.0.0 or later)
- MongoDB (v4.0 or later)

## Installation and Setup

### Clone the Repository

```bash
git https://github.com/Aman7097/taskie.git
```

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the backend directory with the following contents:
   ```
   PORT=7097
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRE=30d
   GOOGLE_CLIENT_ID=your_google_client_it
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
   ```
   Replace `your_mongodb_connection_string` and `your_jwt_secret` etc. with your actual MongoDB URI and a secure random string.

4. Start the backend server:
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:7097`.

### Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the frontend directory with the following content:
   ```
   VITE_APP_BACKEND_URL=http://localhost:5000/api
   ```

4. Start the frontend development server:
   ```bash
   npm start
   ```

The frontend will be available at `http://localhost:5173`.

## Usage

After starting both the backend and frontend servers, you can access the application by navigating to `http://localhost:3000` in your web browser.

1. Sign up for a new account or log in if you already have one.
2. Once logged in, you can create, view, edit, and delete tasks.
3. Use the filter and sort options to organize your tasks.

## API Endpoints

### Authentication
- `POST /api/auth/register`: Create a new user account
- `POST /api/auth/login`: Login and receive a JWT
- `POST /api/auth/goolge`: Login via Google Token
- `GET /api/auth/me`: Get the current user's profile (requires authentication)

### Tasks
- `GET /api/tasks/getAll`: Get all tasks for the authenticated user
- `POST /api/tasks/create`: Create a new task
- `GET /api/tasks/:id`: Get a specific task
- `PUT /api/tasks/update/:id`: Update a task
- `DELETE /api/tasks/delete/:id`: Delete a task

## Testing

### Backend Tests
Navigate to the backend directory and run:
```bash
npm test
```

### Frontend Tests
Navigate to the frontend directory and run:
```bash
npm test
```


## Contact

amandeeppos@gmail.com
