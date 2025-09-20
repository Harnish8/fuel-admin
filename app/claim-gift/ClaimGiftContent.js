// 'use client';

// export const dynamic = "force-dynamic";
// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { isAuthenticated } from '../../lib/auth';
// import Image from 'next/image';

// export default function ClaimGiftContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const vehicleNumber = searchParams.get('vehicleNumber');
//   // const totalLiters = parseFloat(searchParams.get('totalLiters')) || 0;
//   const queryTotalLiters = parseFloat(searchParams.get('totalLiters')) || 0;

//   const [claimLiters, setClaimLiters] = useState('');
//   const [fetchedTotalLiters, setFetchedTotalLiters] = useState(queryTotalLiters);
//   const [giftName, setGiftName] = useState('');
//   const [receiverName, setReceiverName] = useState('');
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [claims, setClaims] = useState([]);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);


//   useEffect(() => {

//     async function checkAuth() {
//       const isAuth = await isAuthenticated();
//       if (!isAuth) {
//         router.push('/');
//       } else {
//         fetchTotalLiters();
//       }
//     }

//     const fetchTotalLiters = async () => {
//       try {

//         // Fetch claims
//         const entriesResponse = await fetch('/api/vehicle-claims', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ vehicleNumber }),
//         });
//         const entriesData = await entriesResponse.json();
//         if (entriesResponse.ok) {
//           setClaims(entriesData.claims || []);
//         } else {
//           setError(entriesData.error || 'Failed to fetch entries');
//         }

//         const response = await fetch('/api/check-vehicle', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ vehicleNumber }),
//         });
//         const data = await response.json();
//         if (response.ok) {
//           setFetchedTotalLiters(data.totalLiters || 0);
//         } else {
//           setError('Failed to fetch total liters');
//         }
//       } catch (err) {
//         setError('Something went wrong while fetching total liters');
//       }
//     };

//     if (vehicleNumber) {
//       checkAuth();
//       fetchTotalLiters();
//     }
//   }, [router, vehicleNumber]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const litersToClaim = parseFloat(claimLiters);
//     // if (!litersToClaim || litersToClaim <= 0 || !giftName) {
//     //   setError('Please enter a valid number of liters');
//     //   return;
//     // }
//     if (!litersToClaim || litersToClaim <= 0 || !giftName || !receiverName.trim()) {
//       setError('Please enter valid liters, gift name, and receiver name');
//       return;
//     }
//     if (litersToClaim > fetchedTotalLiters) {
//       setError(`Cannot claim ${litersToClaim} liters. Only ${fetchedTotalLiters} liters available.`);
//       return;
//     }
//     try {
//       const response = await fetch('/api/claim-gift', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ vehicleNumber, giftName, claimLiters: litersToClaim, receiverName: receiverName.trim() }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setSuccess(`Gift claimed! Remaining liters: ${data.remainingLiters}`);
//         setFetchedTotalLiters(data.remainingLiters);
//         setClaimLiters('');
//         setGiftName('');
//         setReceiverName('');

//          // Refresh claims list
//         const entriesResponse = await fetch('/api/vehicle-claims', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ vehicleNumber }),
//         });
//         const entriesData = await entriesResponse.json();
//         if (entriesResponse.ok) {
//           setClaims(entriesData.claims || []);
//         }

//       } else {
//         setError(data.error);
//       }
//     } catch (err) {
//       setError('Something went wrong');
//     }
//   };

//   return (
//     <div className="min-h-screen">
//       {/* <nav className="bg-blue-500 p-4 text-white">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="flex items-center">
//             <Image src="/logo.png" alt="Logo" width={70} height={70} className="mr-2" />
//             <h1 className="text-xl font-bold">NABH PETROLEUM</h1>
//           </div>
//           <h5 className='text-center font-bold'>Tumb, Bhilad-Sanjan Road, Ta-Umargam, <br></br> Dist.-Valsad, Pin-396150</h5>
          
//           <div>
//             <button
//               onClick={() => router.push('/home')}
//               className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800"
//             >
//               Home
//             </button>
//           </div>
//         </div>
//       </nav> */}

//       <nav className="bg-blue-500 p-4 text-white">
//         <div className="container mx-auto">
//           {/* Desktop Navigation */}
//           <div className="hidden md:flex justify-between items-center">
//             <div className="flex items-center">
//               <Image src="/logo.png" alt="Logo" width={70} height={70} className="mr-2" />
//               <h1 className="text-xl font-bold">NABH PETROLEUM</h1>
//             </div>
//             <div className="text-center">
//               <h5 className="font-bold text-sm lg:text-base">
//                 Tumb, Bhilad-Sanjan Road, Ta-Umargam, <br />
//                 Dist.-Valsad, Pin-396150
//               </h5>
//             </div>
//             <div>
//               <button
//                 onClick={() => router.push('/home')}
//                 className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition-colors"
//               >
//                 Home
//               </button>
//             </div>
//           </div>

//           {/* Mobile Navigation */}
//           <div className="md:hidden">
//             <div className="flex justify-between items-center">
//               <div className="flex items-center">
//                 <Image src="/logo.png" alt="Logo" width={50} height={50} className="mr-2" />
//                 <h1 className="text-lg font-bold">NABH PETROLEUM</h1>
//               </div>
//               <button
//                 onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
//                 className="text-white hover:text-gray-200 focus:outline-none"
//               >
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path
//                     strokeLinecap="round"
//                     strokeLinejoin="round"
//                     strokeWidth={2}
//                     d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
//                   />
//                 </svg>
//               </button>
//             </div>

//             {/* Mobile Menu Dropdown */}
//             {isMobileMenuOpen && (
//               <div className="mt-4 bg-blue-600 rounded-lg p-4">
//                 <div className="text-center mb-4">
//                   <h5 className="font-bold text-sm">
//                     Tumb, Bhilad-Sanjan Road, Ta-Umargam, <br />
//                     Dist.-Valsad, Pin-396150
//                   </h5>
//                 </div>
//                 <div className="text-center">
//                   <button
//                     onClick={() => {
//                       router.push('/home');
//                       setIsMobileMenuOpen(false);
//                     }}
//                     className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800 transition-colors w-full"
//                   >
//                     Home
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </nav>

//       <div className="container mx-auto p-4">
//         <h2 className="text-2xl font-bold text-black mb-4 text-center">Claim Gift for {vehicleNumber}</h2>
//         <p className="text-center text-black mb-4">Available Liters: {fetchedTotalLiters}</p>
//         <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md max-w-md mx-auto">
//           <div className="mb-4">
//             <label className="block text-black mb-2" htmlFor="claimLiters">Liters to Claim</label>
//             <input
//               type="number"
//               id="claimLiters"
//               value={claimLiters}
//               onChange={(e) => setClaimLiters(e.target.value)}
//               className="w-full p-2 border rounded text-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
//               step="0.01"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-black mb-2" htmlFor="giftName">Gift Name</label>
//             <input
//               type="text"
//               id="giftName"
//               value={giftName}
//               onChange={(e) => setGiftName(e.target.value)}
//               className="w-full p-2 border rounded text-black"
//               required
//             />
//           </div>
//           <div className="mb-4">
//             <label className="block text-black mb-2" htmlFor="receiverName">Receiver Name</label>
//             <input
//               type="text"
//               id="receiverName"
//               value={receiverName}
//               onChange={(e) => setReceiverName(e.target.value)}
//               className="w-full p-2 border rounded text-black"
//               placeholder="Enter receiver's name"
//               required
//             />
//           </div>

//           {error && <p className="text-red-500 mb-4">{error}</p>}
//           {success && <p className="text-green-500 mb-4">{success}</p>}
//           <button type="submit" className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600">
//             Claim Gift
//           </button>
//         </form>

//         <h3 className="text-2xl font-bold mt-8 mb-4 text-center text-black">Claim History</h3>
//         {claims.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="py-3 px-6 border-b text-black font-bold">S.No</th>
//                   <th className="py-3 px-6 border-b text-black font-bold">Date</th>
//                   <th className="py-3 px-6 border-b text-black font-bold">Liters Claimed</th>
//                   <th className="py-3 px-6 border-b text-black font-bold">Gift Claimed</th>
//                   <th className="py-3 px-6 border-b text-black font-bold">Receiver Name</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {claims.map((claim, index) => (
//                   <tr
//                     key={index}
//                     className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-gray-100 text-center`}
//                   >
//                     <td className="py-3 px-6 border-b text-black">{index + 1}</td>
//                     <td className="py-3 px-6 border-b text-black">
//                       {/* {new Date(claim.date).toLocaleDateString()} */}
//                       {new Date(claim.date).toISOString().split("T")[0].split("-").reverse().join("-")}
//                     </td>
//                     <td className="py-3 px-6 border-b text-black">{claim.liters}</td>
//                     <td className="py-3 px-6 border-b text-black">{claim.giftName}</td>
//                     <td className="py-3 px-6 border-b text-black">{claim.receiverName || 'N/A'}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-center text-black text-lg">No claim entries found for this vehicle.</p>
//         )}

//         <div className="mt-4 text-center">
//           <button
//             onClick={() => router.push('/home')}
//             className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
//           >
//             Home
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

export const dynamic = "force-dynamic";
import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import Image from 'next/image';

export default function ClaimGiftContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleNumber = searchParams.get('vehicleNumber');
  const queryTotalLiters = parseFloat(searchParams.get('totalLiters')) || 0;

  const [claimLiters, setClaimLiters] = useState('');
  const [fetchedTotalLiters, setFetchedTotalLiters] = useState(queryTotalLiters);
  const [giftName, setGiftName] = useState('');
  const [receiverName, setReceiverName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [claims, setClaims] = useState([]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingClaim, setEditingClaim] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [editForm, setEditForm] = useState({
    giftName: '',
    liters: '',
    receiverName: ''
  });

  useEffect(() => {
    async function checkAuth() {
      const authData = await isAuthenticated();
      if (!authData.isValid) {
        router.push('/');
      } else {
        setUserRole(authData.role);
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
          setError(entriesData.error || 'Failed to fetch claims');
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
    }
  }, [router, vehicleNumber]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const litersToClaim = parseFloat(claimLiters);
    
    if (!litersToClaim || litersToClaim <= 0 || !giftName || !receiverName.trim()) {
      setError('Please enter valid liters, gift name, and receiver name');
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
        body: JSON.stringify({ vehicleNumber, giftName, claimLiters: litersToClaim, receiverName: receiverName.trim() }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess(`Gift claimed! Remaining liters: ${data.remainingLiters}`);
        setFetchedTotalLiters(data.remainingLiters);
        setClaimLiters('');
        setGiftName('');
        setReceiverName('');

        // Refresh claims list
        const entriesResponse = await fetch('/api/vehicle-claims', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleNumber }),
        });
        const entriesData = await entriesResponse.json();
        if (entriesResponse.ok) {
          setClaims(entriesData.claims || []);
        }

      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong');
    }
  };

  const handleDelete = async (claimIndex) => {
    if (!confirm('Are you sure you want to delete this claim?')) return;

    try {
      const response = await fetch('/api/delete-gift-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber, claimIndex }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Claim deleted successfully');
        setClaims(data.claims);
        setFetchedTotalLiters(data.totalLiters);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong while deleting claim');
    }
  };

  const handleEdit = (claim, index) => {
    setEditingClaim(index);
    setEditForm({
      giftName: claim.giftName,
      liters: claim.liters,
      receiverName: claim.receiverName || ''
    });
  };

  const handleUpdate = async (claimIndex) => {
    // Validate form before sending
    if (!editForm.giftName.trim() || !editForm.receiverName.trim() || !editForm.liters) {
      setError('Please fill all required fields');
      return;
    }

    const litersValue = parseFloat(editForm.liters);
    if (isNaN(litersValue) || litersValue <= 0) {
      setError('Please enter a valid liters amount');
      return;
    }

    try {
      const response = await fetch('/api/update-gift-claim', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleNumber,
          claimIndex,
          updatedClaim: {
            ...editForm,
            liters: litersValue
          }
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Claim updated successfully');
        setClaims(data.claims);
        setFetchedTotalLiters(data.totalLiters);
        setEditingClaim(null);
        setError('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong while updating claim');
    }
  };

  const cancelEdit = () => {
    setEditingClaim(null);
    setEditForm({
      giftName: '',
      liters: '',
      receiverName: ''
    });
  };

  return (
    <div className="min-h-screen">
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
            <div className="flex items-center">
              <span className="mr-4 text-sm">Role: {userRole}</span>
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

            {/* Mobile Menu Dropdown */}
            {isMobileMenuOpen && (
              <div className="mt-4 bg-blue-600 rounded-lg p-4">
                <div className="text-center mb-4">
                  <h5 className="font-bold text-sm">
                    Tumb, Bhilad-Sanjan Road, Ta-Umargam, <br />
                    Dist.-Valsad, Pin-396150
                  </h5>
                </div>
                <div className="text-center mb-3">
                  <span className="text-sm">Role: {userRole}</span>
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
        <h2 className="text-2xl font-bold text-black mb-4 text-center">Claim Gift for {vehicleNumber}</h2>
        <p className="text-center text-black mb-4">Available Liters: {fetchedTotalLiters}</p>
        
        {/* Show access level information */}
        {userRole === 'admin' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-center text-sm">
              View-only access. Contact administrator for edit permissions.
            </p>
          </div>
        )}

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
          <div className="mb-4">
            <label className="block text-black mb-2" htmlFor="receiverName">Receiver Name</label>
            <input
              type="text"
              id="receiverName"
              value={receiverName}
              onChange={(e) => setReceiverName(e.target.value)}
              className="w-full p-2 border rounded text-black"
              placeholder="Enter receiver's name"
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
                  <th className="py-3 px-6 border-b text-black font-bold">Receiver Name</th>
                  {/* Conditionally show Actions column only for superadmin */}
                  {userRole === 'superadmin' && (
                    <th className="py-3 px-6 border-b text-black font-bold">Actions</th>
                  )}
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
                      {new Date(claim.date).toISOString().split("T")[0].split("-").reverse().join("-")}
                    </td>
                    
                    {editingClaim === index && userRole === 'superadmin' ? (
                      <>
                        <td className="py-3 px-6 border-b text-black">
                          <input
                            type="number"
                            value={editForm.liters}
                            onChange={(e) => setEditForm({ ...editForm, liters: e.target.value })}
                            className="w-20 p-1 border rounded text-black"
                            step="0.01"
                          />
                        </td>
                        <td className="py-3 px-6 border-b text-black">
                          <input
                            type="text"
                            value={editForm.giftName}
                            onChange={(e) => setEditForm({ ...editForm, giftName: e.target.value })}
                            className="w-32 p-1 border rounded text-black"
                          />
                        </td>
                        <td className="py-3 px-6 border-b text-black">
                          <input
                            type="text"
                            value={editForm.receiverName}
                            onChange={(e) => setEditForm({ ...editForm, receiverName: e.target.value })}
                            className="w-32 p-1 border rounded text-black"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-3 px-6 border-b text-black">{claim.liters}</td>
                        <td className="py-3 px-6 border-b text-black">{claim.giftName}</td>
                        <td className="py-3 px-6 border-b text-black">{claim.receiverName || 'N/A'}</td>
                      </>
                    )}

                    {/* Conditionally render Actions column only for superadmin */}
                    {userRole === 'superadmin' && (
                      <td className="py-3 px-6 border-b text-black">
                        {editingClaim === index ? (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleUpdate(index)}
                              className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
                            >
                              Save
                            </button>
                            <button
                              onClick={cancelEdit}
                              className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEdit(claim, index)}
                              className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(index)}
                              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </td>
                    )}
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
