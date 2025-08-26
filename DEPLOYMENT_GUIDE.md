# 🚀 Deployment Guide: Netlify + AWS Elastic Beanstalk

This guide walks you through deploying your Torch Fellowship application with:
- **Frontend**: Netlify (connected to GitHub)
- **Backend**: AWS Elastic Beanstalk

## 📋 Prerequisites

### Required Accounts & Services
- [x] GitHub account
- [x] Netlify account 
- [x] AWS account
- [x] MongoDB Atlas account (database)
- [x] Cloudinary account (image hosting)
- [x] Google Cloud account (Gemini AI)

### Required Tools
- [x] AWS CLI installed and configured
- [x] EB CLI (Elastic Beanstalk CLI) installed
- [x] Git configured
- [x] Node.js 18+ installed

---

## 🌐 Part 1: Frontend Deployment to Netlify

### Step 1: Prepare Your GitHub Repository

1. **Push your code to GitHub** (if not already done):
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Verify netlify.toml exists** in your root directory (✅ already created)

### Step 2: Deploy to Netlify

1. **Go to [Netlify](https://netlify.com)** and sign in
2. **Click "Add new site" → "Import an existing project"**
3. **Connect to GitHub** and select your repository
4. **Configure build settings**:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Base directory**: (leave empty)

5. **Click "Deploy site"**

### Step 3: Configure Environment Variables

1. **Go to Site Settings → Environment variables**
2. **Add the following variable**:
   ```
   Key: VITE_API_BASE_URL
   Value: https://your-backend-url.elasticbeanstalk.com
   ```
   ⚠️ **Note**: You'll get the backend URL after deploying to Elastic Beanstalk

3. **Trigger a new deployment** after setting the environment variable

### Step 4: Configure Custom Domain (Optional)

1. **Go to Domain settings**
2. **Add your custom domain**
3. **Configure DNS settings** as instructed by Netlify

---

## ☁️ Part 2: Backend Deployment to AWS Elastic Beanstalk

### Step 1: Install AWS CLI and EB CLI

```bash
# Install AWS CLI (if not installed)
# Windows: Download from AWS website
# macOS: brew install awscli
# Linux: Follow AWS documentation

# Install EB CLI
pip install awsebcli

# Verify installations
aws --version
eb --version
```

### Step 2: Configure AWS Credentials

```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key  
# Enter your default region (e.g., us-east-1)
# Enter default output format (json)
```

### Step 3: Prepare Backend for Deployment

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Initialize Elastic Beanstalk application**:
   ```bash
   eb init
   ```
   - Select your region
   - Choose "Create new application"
   - Enter application name: `torch-fellowship-backend`
   - Choose platform: `Node.js`
   - Choose platform version: `Node.js 18`
   - Do not set up SSH for now

3. **Create environment**:
   ```bash
   eb create torch-fellowship-prod
   ```
   - This will create and deploy your application

### Step 4: Configure Environment Variables in EB

1. **Set environment variables** using EB CLI:
   ```bash
   eb setenv NODE_ENV=production
   eb setenv PORT=5000
   eb setenv MONGODB_URI="your_mongodb_connection_string"
   eb setenv DB_NAME="torch-fellowship"
   eb setenv JWT_SECRET="your_super_secure_jwt_secret"
   eb setenv JWT_EXPIRES_IN="90d"
   eb setenv CLOUDINARY_CLOUD_NAME="your_cloudinary_name"
   eb setenv CLOUDINARY_API_KEY="your_cloudinary_key"
   eb setenv CLOUDINARY_API_SECRET="your_cloudinary_secret"
   eb setenv GEMINI_API_KEY="your_gemini_api_key"
   ```

2. **Alternative: Use AWS Console**:
   - Go to [AWS Elastic Beanstalk Console](https://console.aws.amazon.com/elasticbeanstalk/)
   - Select your application → Environment
   - Configuration → Software → Environment properties
   - Add all environment variables from the template

### Step 5: Deploy Backend

```bash
# Deploy the application
eb deploy

# Check status
eb status

# View logs if needed
eb logs
```

### Step 6: Get Your Backend URL

```bash
# Get the application URL
eb status
```

The URL will look like: `https://torch-fellowship-prod.us-east-1.elasticbeanstalk.com`

---

## 🔄 Part 3: Connect Frontend to Backend

### Step 1: Update Frontend Environment Variable

1. **Go back to Netlify dashboard**
2. **Update the VITE_API_BASE_URL** with your Elastic Beanstalk URL:
   ```
   Key: VITE_API_BASE_URL
   Value: https://torch-fellowship-prod.us-east-1.elasticbeanstalk.com
   ```

3. **Trigger a new deployment**

### Step 2: Update CORS Configuration

1. **Update server/server.js** (✅ already done):
   - Replace `'https://your-app-name.netlify.app'` with your actual Netlify URL
   - Replace `'https://your-custom-domain.com'` with your custom domain (if any)

2. **Deploy the updated backend**:
   ```bash
   cd server
   eb deploy
   ```

---

## ✅ Part 4: Testing and Verification

### Step 1: Test Backend Health

Visit: `https://your-backend-url.elasticbeanstalk.com/api/health`

Should return:
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2024-08-25T..."
}
```

### Step 2: Test Frontend

1. **Visit your Netlify site**
2. **Check browser console** for any CORS errors
3. **Test user registration/login**
4. **Test API interactions**

### Step 3: Monitor Applications

#### Netlify Monitoring:
- **Functions tab**: Check for function errors
- **Deploys tab**: Monitor deployment status
- **Analytics**: Monitor site performance

#### AWS Monitoring:
- **EB Health Dashboard**: Monitor application health
- **CloudWatch Logs**: View application logs
- **Monitoring tab**: Check metrics

---

## 🔧 Part 5: Environment Configuration

### Required Environment Variables

#### Frontend (Netlify):
```bash
VITE_API_BASE_URL=https://your-backend-url.elasticbeanstalk.com
```

#### Backend (Elastic Beanstalk):
```bash
NODE_ENV=production
PORT=8080
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/
DB_NAME=torch-fellowship
JWT_SECRET=your_super_secure_jwt_secret_minimum_32_chars
JWT_EXPIRES_IN=90d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
GEMINI_API_KEY=your_gemini_api_key
```

---

## 🚨 Troubleshooting

### Common Issues

#### Frontend Issues:
1. **Build fails on Netlify**:
   - Check Node.js version in netlify.toml
   - Verify all dependencies are in package.json

2. **API calls fail**:
   - Check CORS configuration
   - Verify VITE_API_BASE_URL is correct
   - Check browser network tab for error details

#### Backend Issues:
1. **Application won't start**:
   - Check EB logs: `eb logs`
   - Verify environment variables are set
   - Check health endpoint

2. **Database connection fails**:
   - Verify MONGODB_URI is correct
   - Check MongoDB Atlas IP whitelist (allow 0.0.0.0/0 for EB)
   - Test connection using health-check script

3. **CORS errors**:
   - Update corsOrigins array in server.js
   - Redeploy backend after CORS changes

### Useful Commands

```bash
# Frontend (Netlify)
npm run build          # Test build locally
npm run preview        # Preview production build

# Backend (EB)
eb status              # Check application status
eb logs                # View application logs  
eb deploy              # Deploy changes
eb terminate           # Terminate environment (be careful!)
eb health              # Check environment health

# Database
node server/test-connection.js    # Test DB connection
node server/health-check.js       # Full health check
```

---

## 🔐 Security Checklist

- [x] JWT_SECRET is secure (32+ characters)
- [x] Environment variables are not in source code
- [x] CORS is configured for specific domains
- [x] HTTPS is enabled on both frontend and backend
- [x] Database credentials are secure
- [x] API rate limiting is enabled
- [x] Security headers are configured (Helmet.js)

---

## 📈 Performance Optimization

### Frontend (Netlify):
- [x] Static asset caching configured in netlify.toml
- [x] Gzip compression enabled
- [x] Images optimized
- [x] Bundle size monitoring

### Backend (Elastic Beanstalk):
- [x] Auto-scaling configured
- [x] Load balancer configured
- [x] CloudWatch monitoring enabled
- [x] Log rotation configured

---

## 🎯 Next Steps

1. **Set up CI/CD Pipeline**:
   - Configure automatic deployments on GitHub push
   - Set up staging environments

2. **Monitoring & Alerts**:
   - Set up CloudWatch alarms
   - Configure Netlify notifications
   - Implement error tracking (Sentry)

3. **Backup Strategy**:
   - MongoDB Atlas backups
   - Cloudinary asset backups
   - Code repository backups

4. **Custom Domain**:
   - Configure custom domain on Netlify
   - Set up SSL certificates
   - Configure DNS properly

---

## 📞 Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review AWS CloudWatch logs
3. Check Netlify deploy logs
4. Test components individually

**Key Files Created/Modified**:
- `netlify.toml` - Netlify configuration
- `.env.production.template` - Frontend environment template
- `server/.ebextensions/` - EB configuration files
- `server/.env.elasticbeanstalk.template` - Backend environment template
- `server/server.js` - Updated CORS configuration

Good luck with your deployment! 🚀