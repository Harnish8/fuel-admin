'use client';

// import { useState } from 'react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { isAuthenticated } from '../../lib/auth';


const getTodayDate = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};


export default function Home() {
  // const [date, setDate] = useState('');
  const [date, setDate] = useState(getTodayDate());
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [userRole, setUserRole] = useState(null);

  // useEffect(() => {
  //   async function checkAuth() {
  //     const isAuth = await isAuthenticated();
  //     if (!isAuth) {
  //       router.push('/');
  //     } else {
  //       setLoading(false);
  //     }
  //   }
  //   checkAuth();
  // }, [router]);

  
  useEffect(() => {
    async function checkAuth() {
      const authData = await isAuthenticated();
      if (!authData.isValid) {
        router.push('/');
      } else {
        setUserRole(authData.role);
        if (authData.role === 'admin') {
          // Set date to today for regular admin
          const today = new Date().toISOString().split('T')[0]; // e.g., "2025-08-08"
          setDate(today);
        }
        setLoading(false);
      }
    }
    checkAuth();
  }, [router]);
  

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!date || !vehicleNumber) {
      setError('Please fill in all fields');
      return;
    }
    try {
      const response = await fetch('/api/check-vehicle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber }),
      });
      const data = await response.json();
      if (response.ok) {
        // router.push(`/fuel-form/${encodeURIComponent(vehicleNumber)}/${encodeURIComponent(date)}`);
        router.push(`/fuel-form?vehicleNumber=${vehicleNumber}&date=${date}&totalLiters=${data.totalLiters || 0}`);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-black text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-blue-500 p-4 text-white">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center">
            <Image src="/logo.png" alt="Logo" width={70} height={70} className="mr-2" />
            <h1 className="text-xl font-bold">NABH PETROLEUM</h1>
          </div>
          <h5 className='text-center font-bold'>Tumb, Bhilad-Sanjan Road, Ta-Umargam, <br></br> Dist.-Valsad, Pin-396150</h5>
          <div>
            <span className="mr-4">Logged in as: {userRole}</span>
            <button
              onClick={() => {
                localStorage.removeItem('sessionToken');
                router.push('/');
              }}
              className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="container mx-auto p-4">
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Enter Vehicle Details</h2>
        {/* <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md mx-auto"> */}
        <form onSubmit={handleSubmit} className="bg-[#e0e0e0] p-6 rounded-xl shadow-[10px_10px_20px_#bebebe,-10px_-10px_20px_#ffffff] max-w-md mx-auto
">
          {/* <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div> */}

          <div className="mb-4">
            <label className="block text-black text-lg mb-2" htmlFor="date">
              Date
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              readOnly={userRole === 'admin'} // Read-only for regular admin
              className={`w-full p-3 border rounded text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                userRole === 'admin' ? 'bg-gray-200 cursor-not-allowed' : ''
              }`}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="vehicleNumber">Vehicle Number</label>
            <input
              type="text"
              id="vehicleNumber"
              value={vehicleNumber}
              onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
              className="w-full p-2 border rounded text-black"
              required
            />
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600">
            Submit
          </button>
        </form>
      </div>
      <div className='flex justify-center'>
      <button
            onClick={() => router.push('/calculator')}
            className="bg-yellow-400 text-white px-4 font-bold py-2 rounded"
          >
            Calculator
          </button>
          </div>
    </div>
  );
}


