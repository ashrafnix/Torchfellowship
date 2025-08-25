<div align="center"># Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" /># Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

</div># Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Run and deploy your AI Studio app# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

This contains everything you need to run your app locally.# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

View your app in AI Studio: https://ai.studio/apps/drive/1W1EtLnOG4U66XY915LxB7eCrD_HPIPPC# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## Run Locally# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

**Prerequisites:**  Node.js# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

1. Install dependencies:# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

   `npm install`# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

3. Run the app:# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

   `npm run dev`# Torch Fellowship - Full Stack Application

A comprehensive church/fellowship management system built with React, Node.js, and MongoDB.

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

2. **Configure Environment Variables:**
   
   **Backend Configuration (`server/.env`):**
   ```env
   PORT=8080
   NODE_ENV=development
   MONGODB_URI=your_mongodb_connection_string
   DB_NAME=torch-fellowship
   JWT_SECRET=your-super-secret-jwt-key
   JWT_EXPIRES_IN=90d
   GEMINI_API_KEY=your-gemini-api-key
   CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
   CLOUDINARY_API_KEY=your-cloudinary-api-key
   CLOUDINARY_API_SECRET=your-cloudinary-api-secret
   FRONTEND_URL=http://localhost:5173
   ```
   
   **Frontend Configuration (`.env.local`):**
   ```env
   VITE_API_BASE_URL=http://localhost:8080
   VITE_SOCKET_URL=http://localhost:8080
   ```

3. **Test Connectivity:**
   ```bash
   cd server
   npm run test
   ```

### Development

**Start both frontend and backend:**
```bash
npm run dev:all
```

**Or run separately:**
```bash
# Terminal 1 - Frontend
npm run dev

# Terminal 2 - Backend
npm run server
```

### Production

**Build the application:**
```bash
npm run build
```

**Start production server:**
```bash
npm run server:start
```

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify MongoDB URI in `server/.env`
   - Check network connectivity
   - Ensure MongoDB service is running

2. **API Endpoints Not Working**
   - Confirm backend server is running on port 8080
   - Check CORS configuration
   - Verify environment variables are loaded

3. **Authentication Issues**
   - Check JWT_SECRET is set
   - Verify token format in requests
   - Ensure user exists in database

4. **File Upload Problems**
   - Configure Cloudinary credentials
   - Check file size limits
   - Verify CORS settings

### Testing Connectivity

Run the connection test script:
```bash
cd server
node test-connection.js
```

## 📱 Features

- User Authentication & Authorization
- Admin Dashboard
- Content Management (Blog, Teachings, Events)
- Real-time Messaging
- AI Assistant Integration
- File Upload Support
- Prayer Request Management
- Leadership Directory
- Testimonies & Community Features

## 🛠 Technology Stack

**Frontend:**
- React 19 + TypeScript
- Vite
- Tailwind CSS
- React Query
- Zustand
- Socket.IO Client

**Backend:**
- Node.js + Express
- MongoDB
- Socket.IO
- JWT Authentication
- Cloudinary
- Google Gemini AI

## 📚 API Documentation

The API is available at `http://localhost:8080/api` with the following main endpoints:

- `/api/auth` - Authentication
- `/api/users` - User management
- `/api/blog` - Blog posts
- `/api/events` - Events
- `/api/teachings` - Teachings
- `/api/testimonies` - Testimonies
- `/api/prayer-requests` - Prayer requests
- `/api/messages` - Real-time messaging
- `/api/admin` - Admin operations

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

