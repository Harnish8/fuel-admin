import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber, date, driverName, contactNumber, liters, fillerName, note, entryTime } = await request.json();
    const { db } = await connectToDatabase();

    const existingVehicle = await db.collection('vehicles').findOne({ vehicleNumber });
    let newTotalLiters = liters;

    if (existingVehicle) {
      newTotalLiters = existingVehicle.totalLiters + liters;
      await db.collection('vehicles').updateOne(
        { vehicleNumber },
        { $set: { totalLiters: newTotalLiters }, $push: { entries: { date, driverName, contactNumber, liters, fillerName, note, entryTime } } }
      );
    } else {
      await db.collection('vehicles').insertOne({
        vehicleNumber,
        totalLiters: liters,
        entries: [{ date, driverName, contactNumber, liters, fillerName, note, entryTime }],
      });
    }

    return NextResponse.json({ message: 'Fuel details saved', totalLiters: newTotalLiters });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save fuel details' }, { status: 500 });
  }
}