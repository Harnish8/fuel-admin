import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber, entryIndex } = await request.json();
    const { db } = await connectToDatabase();
    
    const vehicle = await db.collection('vehicles').findOne({ vehicleNumber });
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    if (!vehicle.entries || entryIndex >= vehicle.entries.length) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Get the liters from the entry being deleted
    const deletedEntryLiters = parseFloat(vehicle.entries[entryIndex].liters) || 0;
    
    // Remove the entry at the specified index
    vehicle.entries.splice(entryIndex, 1);
    
    // Get current available liters (totalLiters in DB represents available liters)
    const currentAvailableLiters = vehicle.totalLiters || 0;
    
    // Subtract the deleted entry's liters from available liters
    const newAvailableLiters = currentAvailableLiters - deletedEntryLiters;
    
    // Update the database
    await db.collection('vehicles').updateOne(
      { vehicleNumber },
      { 
        $set: { 
          entries: vehicle.entries,
          totalLiters: newAvailableLiters
        }
      }
    );

    return NextResponse.json({ 
      message: 'Entry deleted successfully',
      entries: vehicle.entries,
      totalLiters: newAvailableLiters
    });
  } catch (error) {
    console.error('Delete entry error:', error);
    return NextResponse.json({ error: 'Failed to delete entry' }, { status: 500 });
  }
}