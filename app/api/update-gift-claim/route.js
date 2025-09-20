import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function POST(request) {
  try {
    const { vehicleNumber, claimIndex, updatedClaim } = await request.json();
    const { db } = await connectToDatabase();
    
    const vehicle = await db.collection('vehicles').findOne({ vehicleNumber });
    if (!vehicle) {
      return NextResponse.json({ error: 'Vehicle not found' }, { status: 404 });
    }

    if (!vehicle.claims || claimIndex >= vehicle.claims.length) {
      return NextResponse.json({ error: 'Claim not found' }, { status: 404 });
    }

    // Validate new liters input
    const newLiters = parseFloat(updatedClaim.liters);
    if (isNaN(newLiters) || newLiters <= 0) {
      return NextResponse.json({ error: 'Invalid liters value' }, { status: 400 });
    }

    // Get the old liters from the existing claim
    const oldLiters = parseFloat(vehicle.claims[claimIndex].liters) || 0;
    
    // Calculate the difference
    const litersDifference = oldLiters - newLiters; // Note: reversed because claims reduce available liters
    
    // Get current available liters
    const currentAvailableLiters = vehicle.totalLiters || 0;
    
    // Calculate new available liters (if claim liters decrease, available liters increase)
    const newAvailableLiters = currentAvailableLiters + litersDifference;

    // Check if we have enough liters for the new claim amount
    if (newLiters > oldLiters && (newLiters - oldLiters) > currentAvailableLiters) {
      return NextResponse.json({ 
        error: `Cannot increase claim to ${newLiters} liters. Only ${currentAvailableLiters + oldLiters} liters available.` 
      }, { status: 400 });
    }

    // Update the claim at the specified index
    vehicle.claims[claimIndex] = {
      ...vehicle.claims[claimIndex], // Keep original claim structure
      giftName: updatedClaim.giftName.trim(),
      liters: newLiters,
      receiverName: updatedClaim.receiverName.trim()
    };
    
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
      message: 'Claim updated successfully',
      claims: vehicle.claims,
      totalLiters: newAvailableLiters
    });
  } catch (error) {
    console.error('Update claim error:', error);
    return NextResponse.json({ error: 'Failed to update claim' }, { status: 500 });
  }
}