'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import Image from 'next/image';

export default function FuelForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleNumber = searchParams.get('vehicleNumber');
  const date = searchParams.get('date');
  const totalLiters = parseFloat(searchParams.get('totalLiters')) || 0;

  const [driverName, setDriverName] = useState('');
  const [contactNumber, setContactNumber] = useState('');
  const [liters, setLiters] = useState('');
  const [fillerName, setFillerName] = useState('');
  const [note, setNote] = useState('');
  // const [cost, setCost] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [updatedTotalLiters, setUpdatedTotalLiters] = useState(totalLiters);

  const fetchTotalLiters = useCallback(async () => {
    if (!vehicleNumber) return;
    
    try {
      const response = await fetch('/api/check-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        setUpdatedTotalLiters(data.totalLiters || 0);
      } else {
        setError('Failed to fetch total liters');
      }
    } catch (err) {
      setError('Something went wrong while fetching total liters');
    }
  }, [vehicleNumber]);

  useEffect(() => {
    async function checkAuth() {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        router.push('/');
      } else {
        // Fetch fresh data after authentication
        await fetchTotalLiters();
      }
    }
    
    if (vehicleNumber) {
      checkAuth();
    }
  }, [router, vehicleNumber, fetchTotalLiters]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!driverName || !contactNumber || !liters || !fillerName || !note) {
      setError('Please fill in all fields');
      return;
    }
    try {
      // Capture IST entry time
      const entryTime = new Date().toLocaleString('en-IN', {
        timeZone: 'Asia/Kolkata',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+:\d+:\d+)/, '$3-$2-$1T$4+05:30');

      const response = await fetch('/api/submit-fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleNumber,
          date,
          driverName,
          contactNumber,
          liters: parseFloat(liters),
          fillerName,
          note,
          entryTime,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(`Fuel details saved. Total liters for ${vehicleNumber}: ${data.totalLiters}`);
        setUpdatedTotalLiters(data.totalLiters);
        setDriverName('');
        setContactNumber('');
        setLiters('');
        setFillerName('');
        setNote('');
        // setCost('');
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-blue-500 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={70} height={70} className="mr-2" />
            <h1 className="text-xl font-bold">NABH PETROLEUM</h1>
          </div>
          <h5 className='text-center font-bold'>Tumb, Bhilad-Sanjan Road, Ta-Umargam, <br></br> Dist.-Valsad, Pin-396150</h5>

          <div>
            <button
              onClick={() => router.push('/home')}
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 mr-2"
            >
              Home
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Fuel Details for {vehicleNumber}</h2>
        <p className="text-center mb-4">Total Liters Filled: {updatedTotalLiters}</p>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="driverName">Driver Name</label>
            <input
              type="text"
              id="driverName"
              value={driverName}
              onChange={(e) => setDriverName(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="contactNumber">Contact Number</label>
            <input
              type="tel"
              id="contactNumber"
              value={contactNumber}
              onChange={(e) => setContactNumber(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="liters">Liters</label>
            <input
              type="number"
              id="liters"
              value={liters}
              onChange={(e) => setLiters(e.target.value)}
              className="w-full p-2 border rounded text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="fillerName">Filler Name</label>
            <input
              type="text"
              id="fillerName"
              value={fillerName}
              onChange={(e) => setFillerName(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="note">Note</label>
            <input
              type="text"
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full p-2 border rounded text-black"
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Submit
          </button>
        </form>
        <div className="mt-4 flex justify-center space-x-4">
          <button
            onClick={() => router.push('/home')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Home
          </button>
          <button
            onClick={() => router.push(`/claim-gift?vehicleNumber=${vehicleNumber}&totalLiters=${updatedTotalLiters}`)}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
          >
            Claim Gift
          </button>
          <button
            onClick={() => router.push(`/details?vehicleNumber=${vehicleNumber}&totalLiters=${updatedTotalLiters}`)}
            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );
}