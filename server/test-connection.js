import dotenv from 'dotenv';
dotenv.config();

import { MongoClient } from 'mongodb';

const MONGODB_URI = process.env.MONGODB_URI;

console.log('Testing MongoDB connection...');
console.log('URI exists:', !!MONGODB_URI);
console.log('URI length:', MONGODB_URI?.length);

async function testConnection() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('✅ MongoDB connection successful');
    await client.close();
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  }
}

testConnection();