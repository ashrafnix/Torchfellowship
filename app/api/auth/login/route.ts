import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminDb, adminAuth } from '@/lib/firebase/admin';
import { apiError } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return apiError('Please provide email and password', 400);
    }

    const snap = await adminDb
      .collection('users')
      .where('email', '==', email.toLowerCase())
      .limit(1)
      .get();

    if (snap.empty) {
      return apiError('Incorrect email or password', 401);
    }

    const userDoc = snap.docs[0];
    const userData = userDoc.data();

    const passwordMatch = await bcrypt.compare(password, userData.password || '');
    if (!passwordMatch) {
      return apiError('Incorrect email or password', 401);
    }

    const token = jwt.sign(
      { id: userDoc.id },
      process.env.JWT_SECRET!,
      { expiresIn: process.env.JWT_EXPIRES_IN || '90d' } as jwt.SignOptions
    );

    // Mint a Firebase custom token so the client SDK can call
    // signInWithCustomToken() and satisfy Firestore security rules.
    let firebaseToken: string | null = null;
    try {
      firebaseToken = await adminAuth.createCustomToken(userDoc.id, {
        role: userData.role,
      });
    } catch (fbErr) {
      console.warn('Could not create Firebase custom token:', fbErr);
      // Non-fatal — direct Firestore client access just won't work
    }

    return NextResponse.json({
      status: 'success',
      token,
      firebaseToken,
      user: {
        id: userDoc.id,
        email: userData.email,
        fullName: userData.fullName ?? null,
        role: userData.role,
        avatarUrl: userData.avatarUrl ?? null,
        createdAt: userData.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return apiError('An error occurred during login.');
  }
}
