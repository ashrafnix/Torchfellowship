# Ministry Teams API 500 Error - Troubleshooting Guide

## 🔍 **Issue Analysis**
**Error**: `POST http://localhost:8080/api/ministry-teams 500 (Internal Server Error)`

## 🛠 **Fixes Applied**

### **1. Enhanced Error Handling**
- ✅ Added detailed logging to ministry team controller
- ✅ Improved field validation (now only requires `name` and `description`)
- ✅ Added debug middleware to track all requests
- ✅ Better error messages with specific details

### **2. Field Structure Updates**
Updated ministry team model to match frontend expectations:
```javascript
{
  name: String,           // Required
  description: String,    // Required  
  leaderName: String,     // Optional
  contactEmail: String,   // Optional
  imageUrl: String,       // Optional (was photoUrl)
  isActive: Boolean       // Default true
}
```

### **3. Route Configuration Verified**
- ✅ Routes properly registered at `/api/ministry-teams`
- ✅ Authentication middleware in place
- ✅ Admin-only protection for POST/PUT/DELETE operations

## 🧪 **Testing Steps**

### **Step 1: Verify Server is Running**
```bash
cd server
npm run dev
```
Look for these logs:
```
✅ Environment variables loaded from .env file
🚀 Server is running on http://localhost:8080
📡 API endpoints available at http://localhost:8080/api
```

### **Step 2: Test Public Endpoint (No Auth Required)**
Open browser or use curl:
```bash
curl http://localhost:8080/api/ministry-teams/public
```
Expected: `200 OK` with array response (might be empty)

### **Step 3: Check Server Logs for Details**
When you make the POST request, look for these logs:
```
[Ministry Teams] POST /api/ministry-teams
[Ministry Teams] Body: { name: "...", description: "..." }
[Ministry Teams] Headers: Auth header present
Creating ministry team with data: {...}
```

### **Step 4: Verify Database Connection**
Check server startup logs for:
```
🔗 Connected to MongoDB successfully
```

## 🚨 **Common Causes & Solutions**

### **Cause 1: Authentication Issues**
**Symptoms**: 500 error, no detailed logs
**Solution**: 
- Check if user is logged in as Admin
- Verify JWT token is being sent
- Check `localStorage.getItem('token')` in browser console

### **Cause 2: Database Connection Issues**
**Symptoms**: Server logs show database errors
**Solution**:
- Verify MongoDB URI in `.env` file
- Check database server is running
- Ensure collection permissions are correct

### **Cause 3: Field Validation Errors**
**Symptoms**: 500 error with validation message
**Solution**:
- Ensure `name` and `description` fields are provided
- Check field names match expected structure

### **Cause 4: Missing Collection**
**Symptoms**: MongoDB collection doesn't exist
**Solution**:
- Collection will be created automatically on first insert
- Verify database name in connection string

## 🔧 **Manual Testing**

### **Test with curl (Admin Auth Required)**
```bash
# First, get auth token by logging in through frontend
# Then use token in request:

curl -X POST http://localhost:8080/api/ministry-teams \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Test Ministry",
    "description": "Test ministry team"
  }'
```

### **Expected Response**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Test Ministry",
  "description": "Test ministry team",
  "leaderName": "",
  "contactEmail": "",
  "imageUrl": null,
  "isActive": true,
  "createdAt": "2025-01-25T10:30:00.000Z"
}
```

## 📋 **Debugging Checklist**

- [ ] Server is running on port 8080
- [ ] Database connection is successful
- [ ] User is logged in as Admin
- [ ] JWT token is being sent with request
- [ ] Request body contains required fields (`name`, `description`)
- [ ] No firewall/antivirus blocking requests
- [ ] Browser console shows detailed error logs

## 🎯 **Quick Fix Test**

1. **Restart the server**: `cd server && npm run dev`
2. **Clear browser cache**: Hard refresh (Ctrl+F5)
3. **Check browser console**: Look for detailed error messages
4. **Verify login status**: Ensure you're logged in as Admin
5. **Test public endpoint**: Visit `http://localhost:8080/api/ministry-teams/public`

## 📞 **Still Having Issues?**

If the error persists:

1. **Check server terminal** for detailed error logs
2. **Copy the full error message** from server console
3. **Verify the exact request payload** being sent
4. **Test authentication** with other admin endpoints

The enhanced error handling should now provide much more detailed information about what's causing the 500 error!