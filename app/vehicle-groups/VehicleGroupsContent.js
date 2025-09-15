'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import Image from 'next/image';

export default function VehicleGroupsContent() {
  const router = useRouter();
  const [vehicles, setVehicles] = useState([]);
  const [groupStats, setGroupStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('all');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Define liter groups
  const literGroups = {
    'all': { name: 'All Vehicles', color: 'bg-gray-50 border-gray-200' },
    'group1': { name: '0-100 Liters', color: 'bg-red-50 border-red-200' },
    'group2': { name: '101-200 Liters', color: 'bg-orange-50 border-orange-200' },
    'group3': { name: '201-500 Liters', color: 'bg-yellow-50 border-yellow-200' },
    'group4': { name: '501-1000 Liters', color: 'bg-green-50 border-green-200' },
    'group5': { name: '1001-1500 Liters', color: 'bg-blue-50 border-blue-200' },
    'group6': { name: '1501-3000 Liters', color: 'bg-purple-50 border-purple-200' },
    'group7': { name: '3001-5000 Liters', color: 'bg-pink-50 border-pink-200' },
    'group8': { name: '5001-10000 Liters', color: 'bg-orange-50 border-orange-200' },
    'group9': { name: '10001-15000 Liters', color: 'bg-yellow-50 border-yellow-200' },
    'group10': { name: '15001-20000 Liters', color: 'bg-green-50 border-green-200' },
    'group11': { name: '20000+ Liters', color: 'bg-blue-50 border-blue-200' }
  };

  const fetchVehicleGroups = useCallback(async () => {
    setLoading(true);
    try {
      const groupParam = selectedGroup === 'all' ? '' : `?group=${selectedGroup}`;
      const response = await fetch(`/api/vehicle-groups${groupParam}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        setVehicles(data.vehicles || []);
        setGroupStats(data.groupStats || {});
      } else {
        setError('Failed to fetch vehicle groups');
      }
    } catch (err) {
      setError('Something went wrong while fetching vehicle groups');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, [selectedGroup]);

  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        router.push('/');
      } else {
        await fetchVehicleGroups();
      }
    }
    checkAuth();
  }, [router, fetchVehicleGroups]);

  const handleGroupChange = (group) => {
    setSelectedGroup(group);
  };

  // Format date for display
  const formatDate = (dateStr) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading vehicle groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-blue-500 p-4 text-white">
        <div className="container mx-auto">
          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between items-center">
            <div className="flex items-center">
              <Image src="/logo.png" alt="Logo" width={70} height={70} className="mr-2" />
              <h1 className="text-xl font-bold">NABH PETROLEUM</h1>
            </div>
            <div className="text-center">
              <h5 className="font-bold text-sm lg:text-base">
                Tumb, Bhilad-Sanjan Road, Ta-Umargam, <br />
                Dist.-Valsad, Pin-396150
              </h5>
            </div>
            <div>
              <button
                onClick={() => router.push('/home')}
                className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition-colors"
              >
                Home
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Image src="/logo.png" alt="Logo" width={50} height={50} className="mr-2" />
                <h1 className="text-lg font-bold">NABH PETROLEUM</h1>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-white hover:text-gray-200 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                  />
                </svg>
              </button>
            </div>

            {isMobileMenuOpen && (
              <div className="mt-4 bg-blue-600 rounded-lg p-4">
                <div className="text-center mb-4">
                  <h5 className="font-bold text-sm">
                    Tumb, Bhilad-Sanjan Road, Ta-Umargam, <br />
                    Dist.-Valsad, Pin-396150
                  </h5>
                </div>
                <div className="text-center">
                  <button
                    onClick={() => {
                      router.push('/home');
                      setIsMobileMenuOpen(false);
                    }}
                    className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition-colors w-full"
                  >
                    Home
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-black mb-6 text-center">Vehicle Groups by Total Liters</h2>

        {/* Group Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
          {Object.entries(literGroups).map(([groupKey, group]) => {
            const stats = groupStats[groupKey] || { count: 0, totalLiters: 0 };
            const isSelected = selectedGroup === groupKey;
            
            return (
              <div
                key={groupKey}
                onClick={() => handleGroupChange(groupKey)}
                className={`${group.color} ${isSelected ? 'ring-2 ring-blue-500' : ''} 
                  border-2 rounded-lg p-3 cursor-pointer hover:shadow-md transition-all text-center`}
              >
                <h3 className="font-semibold text-xs mb-1 text-gray-800">{group.name}</h3>
                <p className="text-lg font-bold text-gray-900">{groupKey === 'all' ? vehicles.length : stats.count}</p>
                <p className="text-xs text-gray-600">
                  {groupKey === 'all' 
                    ? `${vehicles.reduce((sum, v) => sum + v.totalLiters, 0)}L`
                    : `${stats.totalLiters}L`
                  }
                </p>
              </div>
            );
          })}
        </div>

        {/* Current Filter Display */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center">
            <div>
              <h3 className="text-lg font-semibold text-black">
                Currently Showing: {literGroups[selectedGroup].name}
              </h3>
              <p className="text-gray-600">
                Total Vehicles: {vehicles.length} | 
                Total Liters: {vehicles.reduce((sum, vehicle) => sum + vehicle.totalLiters, 0)}L
              </p>
            </div>
            <button
              onClick={() => handleGroupChange('all')}
              className="mt-2 md:mt-0 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
            >
              Show All Groups
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Vehicles Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {vehicles.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-3 px-4 border-b text-black text-left">S.No</th>
                    <th className="py-3 px-4 border-b text-black text-left">Vehicle Number</th>
                    <th className="py-3 px-4 border-b text-black text-left">Total Liters</th>
                    <th className="py-3 px-4 border-b text-black text-left">Driver Name</th>
                    <th className="py-3 px-4 border-b text-black text-left">Contact Number</th>
                    <th className="py-3 px-4 border-b text-black text-left">Total Entries</th>
                    {/* <th className="py-3 px-4 border-b text-black text-left">Last Entry Date</th> */}
                  </tr>
                </thead>
                <tbody>
                  {vehicles.map((vehicle, index) => (
                    <tr key={vehicle.vehicleNumber} className="hover:bg-gray-50">
                      <td className="py-3 px-4 border-b text-black">{index + 1}</td>
                      <td className="py-3 px-4 border-b text-black font-medium">
                        {vehicle.vehicleNumber}
                      </td>
                      <td className="py-3 px-4 border-b text-black">
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm font-medium">
                          {vehicle.totalLiters}L
                        </span>
                      </td>
                      <td className="py-3 px-4 border-b text-black">{vehicle.driverName}</td>
                      <td className="py-3 px-4 border-b text-black">{vehicle.contactNumber}</td>
                      <td className="py-3 px-4 border-b text-black text-center">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
                          {vehicle.totalEntries}
                        </span>
                      </td>
                      {/* <td className="py-3 px-4 border-b text-black">{formatDate(vehicle.lastEntryDate)}</td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No vehicles found</h3>
              <p className="text-gray-500">No vehicles match the selected group criteria.</p>
            </div>
          )}
        </div>

        {/* Back to Home Button */}
        <div className="mt-6 text-center">
          <button
            onClick={() => router.push('/home')}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition-colors font-medium"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
}