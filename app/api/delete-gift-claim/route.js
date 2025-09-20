import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber, claimIndex } = await request.json();
    const { db } = await connectToDatabase();
    
    const vehicle = await db.collection('vehicles').findOne({ vehicleNumber });
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    if (!vehicle.claims || claimIndex >= vehicle.claims.length) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    // Get the liters from the claim being deleted
    const deletedClaimLiters = parseFloat(vehicle.claims[claimIndex].liters) || 0;
    
    // Remove the claim at the specified index
    vehicle.claims.splice(claimIndex, 1);
    
    // Get current available liters
    const currentAvailableLiters = vehicle.totalLiters || 0;
    
    // Add back the deleted claim's liters to available liters
    const newAvailableLiters = currentAvailableLiters + deletedClaimLiters;
    
    // Update the database
    await db.collection('vehicles').updateOne(
      { vehicleNumber },
      { 
        $set: { 
          claims: vehicle.claims,
          totalLiters: newAvailableLiters
        }
      }
    );

    return NextResponse.json({ 
      message: 'Claim deleted successfully',
      claims: vehicle.claims,
      totalLiters: newAvailableLiters
    });
  } catch (error) {
    console.error('Delete claim error:', error);
    return NextResponse.json({ error: 'Failed to delete claim' }, { status: 500 });
  }
}