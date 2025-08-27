import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber, entryIndex, updatedEntry } = await request.json();
    const { db } = await connectToDatabase();
    
    const vehicle = await db.collection('vehicles').findOne({ vehicleNumber });
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    if (!vehicle.entries || entryIndex >= vehicle.entries.length) {
      return NextResponse.json({ error: 'Entry not found' }, { status: 404 });
    }

    // Validate new liters input
    const newLiters = parseFloat(updatedEntry.liters);
    if (isNaN(newLiters) || newLiters <= 0) {
      return NextResponse.json({ error: 'Invalid liters value' }, { status: 400 });
    }

    // Get the old liters from the existing entry
    const oldLiters = parseFloat(vehicle.entries[entryIndex].liters) || 0;
    
    // Calculate the difference
    const litersDifference = newLiters - oldLiters;
    
    // Get current available liters (totalLiters in DB represents available liters)
    const currentAvailableLiters = vehicle.totalLiters || 0;
    
    // Calculate new available liters based on the difference
    const newAvailableLiters = currentAvailableLiters + litersDifference;

    // Update the entry at the specified index
    vehicle.entries[entryIndex] = {
      ...vehicle.entries[entryIndex], // Keep original entry structure
      driverName: updatedEntry.driverName.trim(),
      liters: newLiters,
      fillerName: updatedEntry.fillerName.trim(),
      note: updatedEntry.note ? updatedEntry.note.trim() : vehicle.entries[entryIndex].note || ''
    };
    
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
      message: 'Entry updated successfully',
      entries: vehicle.entries,
      totalLiters: newAvailableLiters
    });
  } catch (error) {
    console.error('Update entry error:', error);
    return NextResponse.json({ error: 'Failed to update entry' }, { status: 500 });
  }
}