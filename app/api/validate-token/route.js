import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ isValid: false }, { status: 400 });
    }

    const { db } = await connectToDatabase();
    const session = await db.collection('sessions').findOne({ token });

    if (session) {
      const createdAt = new Date(session.createdAt);
      const now = new Date();
      const hoursSinceCreation = (now - createdAt) / (1000 * 60 * 60); // Convert ms to hours
      const maxSessionHours = 24; // Session expires after 24 hours

      if (hoursSinceCreation <= maxSessionHours) {
        return NextResponse.json({ isValid: true, role: session.role });
      } else {
        // Optionally delete expired token
        await db.collection('sessions').deleteOne({ token });
        return NextResponse.json({ isValid: false, error: 'Session expired' }, { status: 401 });
      }
    } else {
      return NextResponse.json({ isValid: false }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ isValid: false, error: 'Failed to validate token' }, { status: 500 });
  }
}