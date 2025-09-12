import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb'; // Updated import to match your pattern

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    
    // Fetch all vehicles with their entries
    const vehicles = await db.collection('vehicles').find({}).toArray();
    
    // Flatten all entries from all vehicles
    const allEntries = [];
    
    vehicles.forEach(vehicle => {
      if (vehicle.entries && vehicle.entries.length > 0) {
        vehicle.entries.forEach(entry => {
          allEntries.push({
            vehicleNumber: vehicle.vehicleNumber,
            date: entry.date,
            driverName: entry.driverName,
            contactNumber: entry.contactNumber,
            liters: entry.liters,
            fillerName: entry.fillerName,
            note: entry.note || '',
            cost: entry.cost || 0,
            entryTime: entry.entryTime || null
          });
        });
      }
    });

    // Sort entries by date (newest first) and then by entry time
    allEntries.sort((a, b) => {
      const dateCompare = new Date(b.date) - new Date(a.date);
      if (dateCompare === 0 && a.entryTime && b.entryTime) {
        return new Date(b.entryTime) - new Date(a.entryTime);
      }
      return dateCompare;
    });

    return NextResponse.json({
      success: true,
      entries: allEntries,
      total: allEntries.length
    });

  } catch (error) {
    console.error('Error fetching entries:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch entries',
        entries: []
      },
      { status: 500 }
    );
  }
}