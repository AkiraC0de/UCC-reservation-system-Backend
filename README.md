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
- I’ve successfully learned how to build RESTful APIs using Node.js, Express, MongoDB, and Mongoose. The backend is now fully functional and supports all CRUD operations.
- I’ve successfully learned and implemented authentication using JSON Web Tokens (JWT), secure password handling with bcrypt, and route protection through middleware. I also connected the backend to MongoDB using Mongoose and followed best practices for managing user data securely.


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
- Implementing authentication with JSON Web Tokens (JWT)
- Managing passwords securely using bcrypt
- Connecting to and working with MongoDB using Mongoose
- Protecting routes with middleware
- Following best practices for handling and securing user data

## 🚧 What I’m Working On Next
Now that authentication for reservation routes is in place, my next goal is to add User type. Where i will implement three users(Admin, Student, Faculty). This require to update all routes and JWT authenticaton code.


# GOAL Reservation Endpoints

| Method | Endpoint               | Description                                   |
| ------ | ---------------------- | --------------------------------------------- |
| POST   | `/api/reservation`     | Add a new reservation (Auth required)         |
| PUT    | `/api/reservation/:id` | Update an existing reservation (Auth)         |
| GET    | `/api/reservation`     | Get all reservations of logged in user (Auth) |
| DELETE | `/api/reservation/:id` | Delete reservation (Admin only)               |


# Auth Endpoints
The authentication system uses JWT (JSON Web Tokens) to securely manage user sessions. Below are the routes used for authentication:

| Method | Endpoint                | Description                                  |
| ------ | --------------------    | -------------------------------------------- |
| POST   | `/api/auth/signup`      | Register a new user                          |
| POST   | `/api/auth/login`       | Login and receive JWT token                  |

