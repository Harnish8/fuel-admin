'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import Image from 'next/image';

export default function EntriesContent() {
  const router = useRouter();
  const [entries, setEntries] = useState([]);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Filter states
  const [filterType, setFilterType] = useState('today');
  const [selectedDate, setSelectedDate] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [driverName, setDriverName] = useState('');
  const [fillerName, setFillerName] = useState('');

  // Get today's date in YYYY-MM-DD format
  const getTodayDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const fetchAllEntries = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/get-all-entries', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      
      if (response.ok) {
        const data = await response.json();
        setEntries(data.entries || []);
        // Initially show today's entries
        filterTodayEntries(data.entries || []);
      } else {
        setError('Failed to fetch entries');
      }
    } catch (err) {
      setError('Something went wrong while fetching entries');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterTodayEntries = (allEntries) => {
    const today = getTodayDate();
    const todayEntries = allEntries.filter(entry => entry.date === today);
    setFilteredEntries(todayEntries);
  };

  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        router.push('/');
      } else {
        await fetchAllEntries();
      }
    }
    checkAuth();
  }, [router, fetchAllEntries]);

  // Apply filters
  const applyFilters = () => {
    let filtered = [...entries];

    // Date filters
    if (filterType === 'today') {
      const today = getTodayDate();
      filtered = filtered.filter(entry => entry.date === today);
    } else if (filterType === 'date' && selectedDate) {
      filtered = filtered.filter(entry => entry.date === selectedDate);
    } else if (filterType === 'range' && startDate && endDate) {
      filtered = filtered.filter(entry => 
        entry.date >= startDate && entry.date <= endDate
      );
    }

    // Vehicle number filter
    if (vehicleNumber.trim()) {
      filtered = filtered.filter(entry => 
        entry.vehicleNumber.toLowerCase().includes(vehicleNumber.toLowerCase())
      );
    }

    // Driver name filter
    if (driverName.trim()) {
      filtered = filtered.filter(entry => 
        entry.driverName.toLowerCase().includes(driverName.toLowerCase())
      );
    }

    // Filler name filter
    if (fillerName.trim()) {
      filtered = filtered.filter(entry => 
        entry.fillerName.toLowerCase().includes(fillerName.toLowerCase())
      );
    }

    setFilteredEntries(filtered);
  };

  // Reset filters
  const resetFilters = () => {
    setFilterType('today');
    setSelectedDate('');
    setStartDate('');
    setEndDate('');
    setVehicleNumber('');
    setDriverName('');
    setFillerName('');
    filterTodayEntries(entries);
  };

  // Calculate total liters for filtered entries
  const getTotalLiters = () => {
    return filteredEntries.reduce((total, entry) => total + entry.liters, 0);
  };

  // Format date for display (DD-MM-YYYY)
  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  // Format entry time for display
  const formatEntryTime = (entryTime) => {
    if (!entryTime) return 'N/A';
    try {
      const date = new Date(entryTime);
      return date.toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        hour12: true,
      });
    } catch (error) {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Loading entries...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation - Same as your existing pattern */}
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
        <h2 className="text-2xl font-bold text-black mb-4 text-center">All Fuel Entries</h2>

        {/* Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-lg font-semibold text-black mb-4">Filters</h3>
          
          {/* Filter Type Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Filter Type</label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              >
                <option value="today">Today</option>
                <option value="date">Specific Date</option>
                <option value="range">Date Range</option>
                <option value="all">All Entries</option>
              </select>
            </div>

            {/* Specific Date Filter */}
            {filterType === 'date' && (
              <div>
                <label className="block text-sm font-medium text-black mb-2">Select Date</label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                />
              </div>
            )}

            {/* Date Range Filter */}
            {filterType === 'range' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">Start Date</label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-black mb-2">End Date</label>
                  <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
                  />
                </div>
              </>
            )}
          </div>

          {/* Additional Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-black mb-2">Vehicle Number</label>
              <input
                type="text"
                value={vehicleNumber}
                onChange={(e) => setVehicleNumber(e.target.value)}
                placeholder="Enter vehicle number"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Driver Name</label>
              <input
                type="text"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                placeholder="Enter driver name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-black mb-2">Filler Name</label>
              <input
                type="text"
                value={fillerName}
                onChange={(e) => setFillerName(e.target.value)}
                placeholder="Enter filler name"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 text-black"
              />
            </div>
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap gap-4">
            <button
              onClick={applyFilters}
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={resetFilters}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Summary Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-blue-800">Total Entries</h4>
              <p className="text-2xl font-bold text-blue-600">{filteredEntries.length}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-green-800">Total Liters</h4>
              <p className="text-2xl font-bold text-green-600">{getTotalLiters().toFixed(2)}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="text-lg font-semibold text-purple-800">Unique Vehicles</h4>
              <p className="text-2xl font-bold text-purple-600">
                {new Set(filteredEntries.map(entry => entry.vehicleNumber)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Entries Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {filteredEntries.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="py-2 px-4 border-b text-black text-left">S.No</th>
                    <th className="py-2 px-4 border-b text-black text-left">Date</th>
                    <th className="py-2 px-4 border-b text-black text-left">Vehicle Number</th>
                    <th className="py-2 px-4 border-b text-black text-left">Driver Name</th>
                    <th className="py-2 px-4 border-b text-black text-left">Contact</th>
                    <th className="py-2 px-4 border-b text-black text-left">Liters</th>
                    <th className="py-2 px-4 border-b text-black text-left">Filler Name</th>
                    <th className="py-2 px-4 border-b text-black text-left">Note</th>
                    <th className="py-2 px-4 border-b text-black text-left">Entry Time</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredEntries.map((entry, index) => (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b text-black">{index + 1}</td>
                      <td className="py-2 px-4 border-b text-black">{formatDate(entry.date)}</td>
                      <td className="py-2 px-4 border-b text-black font-medium">{entry.vehicleNumber}</td>
                      <td className="py-2 px-4 border-b text-black">{entry.driverName}</td>
                      <td className="py-2 px-4 border-b text-black">{entry.contactNumber}</td>
                      <td className="py-2 px-4 border-b text-black">{entry.liters}L</td>
                      <td className="py-2 px-4 border-b text-black">{entry.fillerName}</td>
                      <td className="py-2 px-4 border-b text-black">{entry.note || 'N/A'}</td>
                      <td className="py-2 px-4 border-b text-black">{formatEntryTime(entry.entryTime)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No entries found</h3>
              <p className="text-gray-500">Try adjusting your filters to see more results.</p>
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