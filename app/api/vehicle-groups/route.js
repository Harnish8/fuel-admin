import { NextResponse } from 'next/server';
import connectToDatabase from '../../../lib/mongodb';

export async function GET(request) {
  try {
    const { db } = await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const groupFilter = searchParams.get('group');
    
    // Fetch all vehicles with their data
    const vehicles = await db.collection('vehicles').find({}).toArray();
    
    // Process vehicles and group them by total liters
    const processedVehicles = vehicles.map(vehicle => {
      const totalLiters = vehicle.totalLiters || 0;
      const firstEntry = vehicle.entries && vehicle.entries.length > 0 ? vehicle.entries[0] : null;
      
      return {
        vehicleNumber: vehicle.vehicleNumber,
        totalLiters: totalLiters,
        driverName: firstEntry ? firstEntry.driverName : 'N/A',
        contactNumber: firstEntry ? firstEntry.contactNumber : 'N/A',
        totalEntries: vehicle.entries ? vehicle.entries.length : 0,
        lastEntryDate: firstEntry ? firstEntry.date : null,
        entries: vehicle.entries || []
      };
    });

    // Define liter groups
    const literGroups = {
      'group1': { min: 0, max: 100, name: '0-100 Liters' },
      'group2': { min: 101, max: 200, name: '101-200 Liters' },
      'group3': { min: 201, max: 500, name: '201-500 Liters' },
      'group4': { min: 501, max: 1000, name: '501-1000 Liters' },
      'group5': { min: 1001, max: 1500, name: '1001-1500 Liters' },
      'group6': { min: 1501, max: 3000, name: '1501-3000 Liters' },
      'group7': { min: 3001, max: Infinity, name: '3000+ Liters' }
    };

    // Filter vehicles by group if specified
    let filteredVehicles = processedVehicles;
    if (groupFilter && literGroups[groupFilter]) {
      const group = literGroups[groupFilter];
      filteredVehicles = processedVehicles.filter(vehicle => 
        vehicle.totalLiters >= group.min && vehicle.totalLiters <= group.max
      );
    }

    // Sort by total liters descending
    filteredVehicles.sort((a, b) => b.totalLiters - a.totalLiters);

    // Calculate group statistics
    const groupStats = {};
    Object.keys(literGroups).forEach(groupKey => {
      const group = literGroups[groupKey];
      const groupVehicles = processedVehicles.filter(vehicle => 
        vehicle.totalLiters >= group.min && vehicle.totalLiters <= group.max
      );
      groupStats[groupKey] = {
        name: group.name,
        count: groupVehicles.length,
        totalLiters: groupVehicles.reduce((sum, vehicle) => sum + vehicle.totalLiters, 0)
      };
    });

    return NextResponse.json({
      success: true,
      vehicles: filteredVehicles,
      groupStats: groupStats,
      totalVehicles: filteredVehicles.length,
      appliedFilter: groupFilter || 'all'
    });

  } catch (error) {
    console.error('Error fetching vehicle groups:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch vehicle groups',
        vehicles: [],
        groupStats: {}
      },
      { status: 500 }
    );
  }
}