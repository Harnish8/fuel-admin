import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber, giftName, claimLiters } = await request.json();
    const { db } = await connectToDatabase();
    const vehicle = await db.collection('vehicles').findOne({ vehicleNumber });

    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    if (claimLiters > vehicle.totalLiters) {
      return NextResponse.json({ error: 'Not enough liters to claim' }, { status: 400 });
    }

    const newTotalLiters = vehicle.totalLiters - claimLiters;
    await db.collection('vehicles').updateOne(
      { vehicleNumber },
      { $set: { totalLiters: newTotalLiters }, $push: { claims: { date: new Date(), liters: claimLiters, giftName: giftName } } }
    );

    return NextResponse.json({ message: 'Gift claimed', remainingLiters: newTotalLiters });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to claim gift' }, { status: 500 });
  }
}