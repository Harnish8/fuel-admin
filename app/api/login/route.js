// import { NextResponse } from 'next/server';

// export async function POST(request) {
//   const { username, password } = await request.json();
//   if (username === 'admin' && password === 'password123') {
//     return NextResponse.json({ message: 'Login successful' });
//   } else {
//     return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
//   }
// }

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request) {
  try {
    const { username, password } = await request.json();
    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne({ username, password });
    if (user) {
      const token = uuidv4();
      await db.collection('sessions').insertOne({ token, username, role: user.role, createdAt: new Date() });
      return NextResponse.json({ message: 'Login successful', token });
    } else {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 });
  }
}