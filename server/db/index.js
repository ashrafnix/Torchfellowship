
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import { UserRole } from '../utils/constants.js';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'torch-fellowship';

let db;

async function seedSuperAdmin() {
    const usersCollection = db.collection('users');
    const adminEmail = 'nexusintelligencesystems@gmail.com';
    const existingAdmin = await usersCollection.findOne({ email: adminEmail });

    if (!existingAdmin) {
        console.log('Super-Admin user not found, creating one...');
        const hashedPassword = await bcrypt.hash('SuperAdmin123!', 10);
        await usersCollection.insertOne({
            email: adminEmail,
            password: hashedPassword,
            fullName: 'Super Admin',
            role: UserRole.SUPER_ADMIN,
            avatarUrl: null,
            createdAt: new Date().toISOString()
        });
        console.log('Super-Admin user created successfully.');
    }
}

async function createIndexes() {
    console.log('Applying database indexes...');
    try {
        await db.collection('users').createIndex({ email: 1 }, { unique: true });
        await db.collection('blog_posts').createIndex({ slug: 1 }, { unique: true });
        await db.collection('messages').createIndex({ authorId: 1 });
        await db.collection('messages').createIndex({ recipientId: 1 });
        await db.collection('messages').createIndex({ created_at: 1 });
        await db.collection('teachings').createIndex({ preached_at: -1 });
        console.log('Database indexes applied successfully.');
    } catch (error) {
        console.error('Error applying database indexes:', error);
    }
}

export const connectToDatabase = async () => {
    if (db) {
        return db;
    }
    try {
        const client = new MongoClient(MONGODB_URI);
        await client.connect();
        db = client.db(DB_NAME);
        console.log('Successfully connected to MongoDB.');
        
        await seedSuperAdmin();
        await createIndexes();

        return db;
    } catch (error) {
        console.error('Could not connect to MongoDB', error);
    }
};

export const getDb = () => {
    if (!db) {
        throw new Error('Database not initialized! Call connectToDatabase first.');
    }
    return db;
};