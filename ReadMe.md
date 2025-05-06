# Uber Backend

This is the backend service for the Uber clone application built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

- User authentication and authorization
- Driver and rider management
- Real-time location tracking
- Ride booking and management
- Payment integration
- Real-time notifications

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and add the following environment variables:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

4. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST `/api/auth/register` - Register a new user
- POST `/api/auth/login` - Login user
- GET `/api/auth/profile` - Get user profile

### Rides
- POST `/api/rides` - Create a new ride
- GET `/api/rides` - Get all rides
- GET `/api/rides/:id` - Get ride by ID
- PUT `/api/rides/:id` - Update ride status

### Drivers
- GET `/api/drivers` - Get all drivers
- GET `/api/drivers/:id` - Get driver by ID
- PUT `/api/drivers/:id` - Update driver status

## Project Structure

```
backend/
├── config/         # Configuration files
├── controllers/    # Route controllers
├── middleware/     # Custom middleware
├── models/         # Database models
├── routes/         # API routes
├── utils/          # Utility functions
├── .env           # Environment variables
├── package.json   # Project dependencies
└── server.js      # Entry point
```

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- Socket.io (for real-time features)
- Express Validator
- Bcrypt.js

## License

This project is licensed under the MIT License 

## Contact

I am srinath v (AI and Full stack Engineer)

Email: srinathvsrinathv863@gmail.com
Project Link: 
Backend :[https://github.com/Srinath991/uber-bed](https://github.com/Srinath991/uber-bed)

Frontend :[https://github.com/Srinath991/uber-fed](https://github.com/Srinath991/uber-fed)

