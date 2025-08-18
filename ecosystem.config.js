
module.exports = {
  apps: [{
    name: "torch-fellowship-backend",
    script: "./server/dist/server.js",
    watch: false,
    instances: "max",
    exec_mode: "cluster",
    env: {
      "NODE_ENV": "development",
    },
    env_production: {
       "NODE_ENV": "production",
       "PORT": 8080,
       // It is highly recommended to manage secrets via your cloud provider's secrets management
       // service or environment variables set directly on the instance, rather than hardcoding them here.
       
       // Required for JWT Authentication:
       // JWT_SECRET=your_super_secret_key_for_jwt
       // JWT_EXPIRES_IN=90d
       
       // Required for MongoDB:
       // MONGODB_URI=your_mongodb_connection_string
       // DB_NAME=your_database_name
       
       // Required for Cloudinary image uploads:
       // CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
       // CLOUDINARY_API_KEY=your_cloudinary_api_key
       // CLOUDINARY_API_SECRET=your_cloudinary_api_secret

       // Required for Gemini AI:
       // API_KEY=your_google_gemini_api_key
    }
  }]
};
