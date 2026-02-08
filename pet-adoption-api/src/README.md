# 🐾 Pet Adoption API

## Project Overview
**Pet Adoption API** is a backend RESTful API built with **Node.js**, **Express.js**, and **MongoDB**.  
It supports user registration and login (JWT authentication), user profile management, and full CRUD operations for pets available for adoption.

The project follows a **modular MVC-style architecture** with separate folders for routes, controllers, models, middleware, configuration, and validators.

---

## Technologies Used
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT (JSON Web Tokens)
- bcrypt (password hashing)
- Joi (validation)
- Nodemon (development)
- CORS
- dotenv (environment variables)

---

## Project Structure
pet-adoption-api/
├── src/
│ ├── config/
│ │ └── db.js
│ ├── controllers/
│ │ ├── auth.controller.js
│ │ ├── user.controller.js
│ │ └── pet.controller.js
│ ├── middleware/
│ │ ├── auth.middleware.js
│ │ ├── error.middleware.js
│ │ └── validate.middleware.js
│ ├── models/
│ │ ├── User.js
│ │ └── Pet.js
│ ├── routes/
│ │ ├── auth.routes.js
│ │ ├── user.routes.js
│ │ └── pet.routes.js
│ ├── validators/
│ │ ├── auth.validators.js
│ │ ├── user.validators.js
│ │ └── pet.validators.js
│ ├── app.js
│ └── server.js
├── package.json
├── README.md
└── .env


---

## Setup and Installation

### 1) Clone the repository
```bash
git clone <repository-url>
cd pet-adoption-api
2) Install dependencies
npm install
3) Configure environment variables
Create a .env file in the project root:

PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/pet_adoption
JWT_SECRET=super_secret_key
4) Run the server
Development mode:

npm run dev
Production mode:

npm start
Server will run at:

http://localhost:5000
API Documentation
Authentication Routes (Public)
Method	Endpoint	Access	Description
POST	/api/auth/register	Public	Register a new user (password is hashed)
POST	/api/auth/login	Public	Authenticate user and return JWT
User Routes (Private – JWT required)
Method	Endpoint	Access	Description
GET	/api/users/profile	Private	Get logged-in user profile
PUT	/api/users/profile	Private	Update logged-in user profile
Pet Routes (Private – JWT required)
Method	Endpoint	Access	Description
POST	/api/pets	Private	Create a new pet
GET	/api/pets	Private	Get all pets created by the logged-in user
GET	/api/pets/:id	Private	Get a specific pet by ID
PUT	/api/pets/:id	Private	Update a pet (only owner can update)
DELETE	/api/pets/:id	Private	Delete a pet (only owner can delete)
Authentication & Security
Passwords are hashed using bcrypt.

Authentication is done using JWT.

Private routes are protected by an auth middleware.

Users can only access and modify their own pets.

Sensitive settings are stored in environment variables.

Validation & Error Handling
Joi is used to validate request body data.

A validation middleware returns meaningful errors for invalid data.

Global error-handling middleware is used to handle server errors consistently.

Proper HTTP status codes are used (400, 401, 404, 500).

Database
MongoDB is used as the database.

Mongoose is used for schema creation and data modeling.

Collections:

User

Pet

Deployment
Live API (fill after deployment)
Add your deployed URL here after deploying to Render/Railway/Replit:

https://<your-service>.onrender.com
Deployment Notes
Use environment variables in the deployment platform (MONGO_URI, JWT_SECRET, PORT).

Make sure the deployed API is accessible and all endpoints work as expected.

Defence Notes (What to Explain)
During the defence, be ready to explain:

JWT authentication flow (register → login → token → protected routes)

Password hashing with bcrypt

Middleware usage (auth, validation, error handling)

CRUD operations for Pet

MongoDB/Mongoose schema design

Project modular structure (MVC)

