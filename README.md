# UCC Reservation System - Backend

This is the backend server for my first-year school project, **UCC Reservation System**. The system handles reservation functionalities for a university campus context and implements all HTTP methods (CRUD operations) using a RESTful API approach.

This backend is a part of a full-stack web application and is my **FIRST ATTEMPT** at building a REST API using Node.js, Express, and MongoDB.

## 🚀 Project Goal

To develop a backend system that allows users to:
- **Create** new reservations
- **Read** (fetch) existing reservations
- **Update** reservation details
- **Delete** reservations
- Handle full HTTP method operations (GET, POST, PUT/PATCH, DELETE)

## ✅ Goal Achieved 
I’ve successfully learned how to build RESTful APIs using Node.js, Express, MongoDB, and Mongoose. The backend is now fully functional and supports all CRUD operations.

## 🎯 New Goal:
Implement authentication to secure the system. This includes:

- User registration and login
- Password hashing
- Protected routes
- Role-based access control (optional stretch)


## 🛠️ Built With

- **Node.js** – JavaScript runtime
- **Express.js** – Web application framework
- **MongoDB** – NoSQL database
- **Mongoose** – MongoDB object modeling for Node.js

## 🧠 What I’ve Learned So Far
- Structuring a backend project
- Creating and managing routes, controllers, and models
- Connecting and interacting with MongoDB via Mongoose
- Using environment variables for secure development
- Designing RESTful APIs

## 🧩 What I’m Learning Next
- Authentication using JSON Web Tokens (JWT)
- Secure password management with bcrypt
- Connecting and interacting with MongoDB via Mongoose
- Middleware for route protection
- Best practices for handling user data

# Reservation Endpoints

| Method | Endpoint              | Description                           |
| ------ | --------------------- | ------------------------------------- |
| POST   | `/api/reservation`    | Add a new reservation                 |
| PUT    | `/api/reservation/:id`| Update an existing reservation        |
| GET    | `/api/reservation`    | Get all reservations info             |
| DELETE | `/api/reservation/:id`| Delete an existing reservation(Admin) |


# 🎯 GOAL Auth Endpoints
The authentication system uses JWT (JSON Web Tokens) to securely manage user sessions. Below are the routes used for authentication:

| Method | Endpoint             | Description                           |
| ------ | -------------------- | ------------------------------------- |
| POST   | `/api/auth/signup`   | Register a new user                   |
| POST   | `/api/auth/login`    | Login and receive JWT token           |
| GET    | `/api/auth/profile`  | Get logged-in user's info (Protected) |

