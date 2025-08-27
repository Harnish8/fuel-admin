import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber } = await request.json();
    const { db } = await connectToDatabase();
    const vehicle = await db.collection('vehicles').findOne({ vehicleNumber });
    if (vehicle) {
      return NextResponse.json({ claims: vehicle.claims || [] });
    } else {
      return NextResponse.json({ claims: [] });
    }
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch claim details' }, { status: 500 });
  }
}