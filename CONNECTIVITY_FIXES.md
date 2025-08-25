# Torch Fellowship - Connectivity Fixes Summary

## 🔧 Issues Fixed

### 1. Environment Configuration
- Created server environment file (`server/.env`)
- Created frontend environment file (`.env.local`)
- Added proper environment variable handling and validation
- Ensured consistent naming of environment variables

### 2. Database Connection
- Fixed circular dependencies in imports (`getDb` function)
- Improved error handling for MongoDB connection failures
- Added validation for required database parameters

### 3. Script Updates
- Added comprehensive scripts in `package.json` for development and production
- Created health check and testing utilities
- Added concurrent frontend/backend running capability
- Fixed production configuration in ecosystem.config.js

### 4. API and Connectivity
- Added Vite proxy configuration for API calls
- Fixed Socket.IO configuration to use proper URL resolution
- Improved error handling for API requests

### 5. External Services Integration
- Enhanced Gemini AI configuration with proper validation
- Added Cloudinary configuration checks
- Improved Socket.IO real-time connection error handling

## 🚀 How to Run the Project

### 1. Set Up Environment Variables

**Backend (server/.env):**
```
# Server Configuration
PORT=8080
NODE_ENV=development

# Database Configuration
# Replace with your actual MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/torch-fellowship
DB_NAME=torch-fellowship

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=90d

# Gemini AI Configuration
GEMINI_API_KEY=your-gemini-api-key-here

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

**Frontend (.env.local):**
```
# Frontend Configuration
VITE_API_BASE_URL=http://localhost:8080
VITE_SOCKET_URL=http://localhost:8080
```

### 2. Install Dependencies

```bash
# Install all dependencies (frontend and backend)
npm run install:all

# Or install separately
npm install
cd server && npm install
```

### 3. Run Health Check

```bash
# Go to server directory
cd server

# Run health check to verify configuration
npm run health-check
```

### 4. Start Development Servers

```bash
# Start both frontend and backend (from project root)
npm run dev:all

# Or start separately:
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### 5. Access the Application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8080/api

## 📋 Additional Notes

### MongoDB Setup
- Make sure you have MongoDB running locally or have a valid MongoDB Atlas connection string
- The database will be initialized automatically on first run

### External Services
- Gemini AI requires an API key from [Google AI Studio](https://makersuite.google.com/app)
- Cloudinary requires credentials from [Cloudinary Dashboard](https://cloudinary.com/console)

### Testing
- Run the test connection script with: `cd server && npm test`
- Run the health check script with: `cd server && npm run health-check`

## 🔍 Troubleshooting Common Issues

1. **"MongoDB connection failed"**
   - Verify your MongoDB connection string in `server/.env`
   - Ensure MongoDB is running locally or your Atlas cluster is accessible

2. **"Failed to fetch user from token"**
   - Check that JWT_SECRET is set consistently
   - Verify token expiration settings

3. **"AI service is not configured"**
   - Add your Gemini API key to `server/.env`

4. **"Image upload failed"**
   - Verify Cloudinary credentials in `server/.env`