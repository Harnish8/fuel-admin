import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber } = await request.json();
    const { db } = await connectToDatabase();
    const vehicle = await db.collection('vehicles').findOne({ vehicleNumber });
    if (vehicle) {
      return NextResponse.json({ totalLiters: vehicle.totalLiters || 0 });
    } else {
      return NextResponse.json({ totalLiters: 0 });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to check vehicle' }, { status: 500 });
  }
}