import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber } = await request.json();
    const { db } = await connectToDatabase();
    const vehicle = await db.collection('vehicles').findOne({ vehicleNumber });
    if (vehicle) {
      return NextResponse.json({ entries: vehicle.entries || [] });
    } else {
      return NextResponse.json({ entries: [] });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch vehicle details' }, { status: 500 });
  }
}