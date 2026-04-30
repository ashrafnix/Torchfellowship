import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminDb } from '@/lib/firebase/admin';
import { apiError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { fullName, email, password } = await req.json();

    if (!email || !password || !fullName) {
      return apiError('Please provide full name, email, and password', 400);
    }

    // Check if user already exists
    const existingSnap = await adminDb
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (!existingSnap.empty) {
      return apiError('An account with this email already exists.', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const now = new Date().toISOString();

    // Check if this is the very first user to register
    const anyUserSnap = await adminDb.collection('users').limit(1).get();
    const isFirstUser = anyUserSnap.empty;

    const newUser = {
      fullName,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: isFirstUser ? 'Super-Admin' : 'User',
      avatarUrl: null,
      createdAt: now,
    };

    const docRef = await adminDb.collection('users').add(newUser);

    const token = jwt.sign(
      { id: docRef.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '90d' } as jwt.SignOptions
    );

    return NextResponse.json(
      {
        status: 'success',
        token,
        user: {
          id: docRef.id,
          email: newUser.email,
          fullName: newUser.fullName,
          role: newUser.role,
          avatarUrl: null,
          createdAt: now,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Register error:', error);
    return apiError('An error occurred during registration.');
  }
}
