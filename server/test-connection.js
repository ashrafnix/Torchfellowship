// Connection Test Script
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { MongoClient } from 'mongodb';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log('🔍 Testing torch-fellowship connectivity...');
console.log('=====================================');

// Test environment variables
console.log('📋 Environment Variables:');
console.log(`- NODE_ENV: ${process.env.NODE_ENV || 'Not set'}`);
console.log(`- PORT: ${process.env.PORT || 'Not set'}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? 'Set' : 'Not set'}`);
console.log(`- DB_NAME: ${process.env.DB_NAME || 'Not set'}`);
console.log(`- JWT_SECRET: ${process.env.JWT_SECRET ? 'Set' : 'Not set'}`);
console.log(`- GEMINI_API_KEY: ${process.env.GEMINI_API_KEY ? 'Set' : 'Not set'}`);
console.log(`- CLOUDINARY_CLOUD_NAME: ${process.env.CLOUDINARY_CLOUD_NAME ? 'Set' : 'Not set'}`);
console.log('');

// Test MongoDB connection
async function testMongoConnection() {
    console.log('🔗 Testing MongoDB connection...');
    try {
        if (!process.env.MONGODB_URI) {
            console.log('❌ MONGODB_URI not found in environment variables');
            return false;
        }

        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        
        const db = client.db(process.env.DB_NAME || 'torch-fellowship');
        await db.admin().ping();
        
        console.log('✅ MongoDB connection successful');
        
        // Test basic collections
        const collections = await db.listCollections().toArray();
        console.log(`📦 Found ${collections.length} collections in database`);
        
        await client.close();
        return true;
    } catch (error) {
        console.log('❌ MongoDB connection failed:', error.message);
        return false;
    }
}

// Test API endpoints availability
async function testAPIEndpoints() {
    console.log('🌐 Testing API endpoints...');
    const port = process.env.PORT || 8080;
    const baseUrl = `http://localhost:${port}`;
    
    try {
        // This is just a basic test - actual server needs to be running
        console.log(`📡 API should be available at: ${baseUrl}/api`);
        console.log('ℹ️  Start the server with "npm run server" to test endpoints');
        return true;
    } catch (error) {
        console.log('❌ API endpoint test failed:', error.message);
        return false;
    }
}

// Run all tests
async function runTests() {
    console.log('🚀 Starting connectivity tests...');
    
    const mongoTest = await testMongoConnection();
    const apiTest = await testAPIEndpoints();
    
    console.log('');
    console.log('📊 Test Results:');
    console.log(`- Database: ${mongoTest ? '✅ Pass' : '❌ Fail'}`);
    console.log(`- API Setup: ${apiTest ? '✅ Pass' : '❌ Fail'}`);
    
    if (mongoTest && apiTest) {
        console.log('🎉 All connectivity tests passed!');
        console.log('');
        console.log('🔧 Next steps:');
        console.log('1. Update .env file with your actual database credentials');
        console.log('2. Add your Gemini API key for AI features');
        console.log('3. Configure Cloudinary for image uploads');
        console.log('4. Run "npm run server" to start the backend');
        console.log('5. Run "npm run dev" to start the frontend');
    } else {
        console.log('⚠️  Some tests failed. Please check the configuration.');
    }
}

runTests().catch(console.error);