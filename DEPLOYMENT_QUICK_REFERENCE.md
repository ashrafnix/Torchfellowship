# 🚀 Quick Deployment Reference

## Essential Commands

### Frontend (Netlify)
```bash
# Test build locally
npm run build
npm run preview

# Deploy via GitHub
git add .
git commit -m "Deploy to production"
git push origin main
```

### Backend (Elastic Beanstalk)
```bash
# Initial setup
cd server
eb init
eb create torch-fellowship-prod

# Deploy changes
eb deploy

# Check status
eb status
eb logs

# Set environment variables
eb setenv NODE_ENV=production
eb setenv MONGODB_URI="your_connection_string"
eb setenv JWT_SECRET="your_secret"
```

## Required Environment Variables

### Netlify
```
VITE_API_BASE_URL=https://your-backend.elasticbeanstalk.com
```

### Elastic Beanstalk
```
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://...
DB_NAME=torch-fellowship
JWT_SECRET=your_secure_secret
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
GEMINI_API_KEY=your_key
```

## Health Checks
- **Frontend**: Check Netlify deploy logs
- **Backend**: `https://your-backend.elasticbeanstalk.com/api/health`

## Troubleshooting
```bash
# Backend logs
eb logs

# Test database locally
node server/health-check.js

# Test build locally
npm run build
```

## Important URLs
- **Netlify Dashboard**: https://app.netlify.com/
- **AWS EB Console**: https://console.aws.amazon.com/elasticbeanstalk/
- **MongoDB Atlas**: https://cloud.mongodb.com/