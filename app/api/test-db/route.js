import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function GET() {
  try {
    const { db } = await connectToDatabase();
    await db.collection('test').insertOne({ test: 'Connection successful' });
    return NextResponse.json({ message: 'Connected to MongoDB' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
  }
}