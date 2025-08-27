'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import Image from 'next/image';

export default function ClaimGift() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleNumber = searchParams.get('vehicleNumber');
  // const totalLiters = parseFloat(searchParams.get('totalLiters')) || 0;
  const queryTotalLiters = parseFloat(searchParams.get('totalLiters')) || 0;

  const [claimLiters, setClaimLiters] = useState('');
  const [fetchedTotalLiters, setFetchedTotalLiters] = useState(queryTotalLiters);
  const [giftName, setGiftName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [claims, setClaims] = useState([]);


  useEffect(() => {

    async function checkAuth() {
      const isAuth = await isAuthenticated();
      if (!isAuth) {
        router.push('/');
      } else {
        fetchTotalLiters();
      }
    }

    const fetchTotalLiters = async () => {
      try {

        // Fetch claims
        const entriesResponse = await fetch('/api/vehicle-claims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleNumber }),
        });
        const entriesData = await entriesResponse.json();
        if (entriesResponse.ok) {
          setClaims(entriesData.claims || []);
        } else {
          setError(entriesData.error || 'Failed to fetch entries');
        }

        const response = await fetch('/api/check-vehicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleNumber }),
        });
        const data = await response.json();
        if (response.ok) {
          setFetchedTotalLiters(data.totalLiters || 0);
        } else {
          setError('Failed to fetch total liters');
        }
      } catch (err) {
        setError('Something went wrong while fetching total liters');
      }
    };

    if (vehicleNumber) {
      checkAuth();
      fetchTotalLiters();
    }
  }, [router, vehicleNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const litersToClaim = parseFloat(claimLiters);
    if (!litersToClaim || litersToClaim <= 0 || !giftName) {
      setError('Please enter a valid number of liters');
      return;
    }
    if (litersToClaim > fetchedTotalLiters) {
      setError(`Cannot claim ${litersToClaim} liters. Only ${fetchedTotalLiters} liters available.`);
      return;
    }
    try {
      const response = await fetch('/api/claim-gift', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber, giftName, claimLiters: litersToClaim }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(`Gift claimed! Remaining liters: ${data.remainingLiters}`);
        setFetchedTotalLiters(data.remainingLiters);
        setClaimLiters('');
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
              className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
            >
              Home
            </button>
          </div>
        </div>
      </nav>
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Claim Gift for {vehicleNumber}</h2>
        <p className="text-center text-black mb-4">Available Liters: {fetchedTotalLiters}</p>
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="claimLiters">Liters to Claim</label>
            <input
              type="number"
              id="claimLiters"
              value={claimLiters}
              onChange={(e) => setClaimLiters(e.target.value)}
              className="w-full p-2 border rounded text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="giftName">Gift Name</label>
            <input
              type="text"
              id="giftName"
              value={giftName}
              onChange={(e) => setGiftName(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          {success && <p className="text-green-500 mb-4">{success}</p>}
          <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
            Claim Gift
          </button>
        </form>

        <h3 className="text-2xl font-bold mt-8 mb-4 text-center text-black">Claim History</h3>
        {claims.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-3 px-6 border-b text-black font-bold">S.No</th>
                  <th className="py-3 px-6 border-b text-black font-bold">Date</th>
                  <th className="py-3 px-6 border-b text-black font-bold">Liters Claimed</th>
                  <th className="py-3 px-6 border-b text-black font-bold">Gift Claimed</th>
                </tr>
              </thead>
              <tbody>
                {claims.map((claim, index) => (
                  <tr
                    key={index}
                    className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 text-center`}
                  >
                    <td className="py-3 px-6 border-b text-black">{index + 1}</td>
                    <td className="py-3 px-6 border-b text-black">
                      {/* {new Date(claim.date).toLocaleDateString()} */}
                      {new Date(claim.date).toISOString().split("T")[0].split("-").reverse().join("-")}
                    </td>
                    <td className="py-3 px-6 border-b text-black">{claim.liters}</td>
                    <td className="py-3 px-6 border-b text-black">{claim.giftName}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-black text-lg">No claim entries found for this vehicle.</p>
        )}

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push('/home')}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Home
          </button>
        </div>
      </div>
    </div>
  );
}


