// 'use client';

// import { useState, useEffect } from 'react';
// import { useRouter, useSearchParams } from 'next/navigation';
// import { isAuthenticated } from '../../lib/auth';
// import Image from 'next/image';

// export default function DetailsContent() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const vehicleNumber = searchParams.get('vehicleNumber');
//   const queryTotalLiters = parseFloat(searchParams.get('totalLiters')) || 0;

//   const [entries, setEntries] = useState([]);
//   const [fetchedTotalLiters, setFetchedTotalLiters] = useState(queryTotalLiters);
//   const [error, setError] = useState('');
//   const [success, setSuccess] = useState('');
//   const [editingEntry, setEditingEntry] = useState(null);
//   const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
//   const [editForm, setEditForm] = useState({
//     driverName: '',
//     liters: '',
//     fillerName: '',
//     note: ''
//   });

//   useEffect(() => {
//     async function checkAuth() {
//       const isAuth = await isAuthenticated();
//       if (!isAuth) {
//         router.push('/');
//       } else {
//         fetchDetails();
//       }
//     }

//     const fetchDetails = async () => {
//       try {
//         // Fetch entries
//         const entriesResponse = await fetch('/api/vehicle-details', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ vehicleNumber }),
//         });
//         const entriesData = await entriesResponse.json();
//         if (entriesResponse.ok) {
//           setEntries(entriesData.entries || []);
//         } else {
//           setError(entriesData.error || 'Failed to fetch entries');
//         }

//         // Fetch total liters
//         const totalResponse = await fetch('/api/check-vehicle', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ vehicleNumber }),
//         });
//         const totalData = await totalResponse.json();
//         if (totalResponse.ok) {
//           setFetchedTotalLiters(totalData.totalLiters || 0);
//         } else {
//           setError(totalData.error || 'Failed to fetch total liters');
//         }
//       } catch (err) {
//         setError('Something went wrong while fetching details');
//       }
//     };

//     if (vehicleNumber) {
//       checkAuth();
//     }
//   }, [router, vehicleNumber]);

//   const handleDelete = async (entryIndex) => {
//     if (!confirm('Are you sure you want to delete this entry?')) return;

//     try {
//       const response = await fetch('/api/delete-entry', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ vehicleNumber, entryIndex }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setSuccess('Entry deleted successfully');
//         setEntries(data.entries);
//         setFetchedTotalLiters(data.totalLiters);
//         setTimeout(() => setSuccess(''), 3000);
//       } else {
//         setError(data.error);
//       }
//     } catch (err) {
//       setError('Something went wrong while deleting entry');
//     }
//   };

//   const handleEdit = (entry, index) => {
//     setEditingEntry(index);
//     setEditForm({
//       driverName: entry.driverName,
//       liters: entry.liters,
//       fillerName: entry.fillerName,
//       note: entry.note || ''
//     });
//   };

//   // const handleUpdate = async (entryIndex) => {
//   //   try {
//   //     const response = await fetch('/api/update-entry', {
//   //       method: 'POST',
//   //       headers: { 'Content-Type': 'application/json' },
//   //       body: JSON.stringify({ 
//   //         vehicleNumber, 
//   //         entryIndex,
//   //         updatedEntry: editForm
//   //       }),
//   //     });
//   //     const data = await response.json();
//   //     if (response.ok) {
//   //       setSuccess('Entry updated successfully');
//   //       setEntries(data.entries);
//   //       setFetchedTotalLiters(data.totalLiters);
//   //       setEditingEntry(null);
//   //       setTimeout(() => setSuccess(''), 3000);
//   //     } else {
//   //       setError(data.error);
//   //     }
//   //   } catch (err) {
//   //     setError('Something went wrong while updating entry');
//   //   }
//   // };

//   const handleUpdate = async (entryIndex) => {
//     // Validate form before sending
//     if (!editForm.driverName.trim() || !editForm.fillerName.trim() || !editForm.liters) {
//       setError('Please fill all required fields');
//       return;
//     }

//     const litersValue = parseFloat(editForm.liters);
//     if (isNaN(litersValue) || litersValue <= 0) {
//       setError('Please enter a valid liters amount');
//       return;
//     }

//     try {
//       const response = await fetch('/api/update-entry', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           vehicleNumber,
//           entryIndex,
//           updatedEntry: {
//             ...editForm,
//             liters: litersValue // Ensure it's a number
//           }
//         }),
//       });
//       const data = await response.json();
//       if (response.ok) {
//         setSuccess('Entry updated successfully');
//         setEntries(data.entries);
//         setFetchedTotalLiters(data.totalLiters);
//         setEditingEntry(null);
//         setError(''); // Clear any previous errors
//         setTimeout(() => setSuccess(''), 3000);
//       } else {
//         setError(data.error);
//       }
//     } catch (err) {
//       setError('Something went wrong while updating entry');
//     }
//   };


//   const cancelEdit = () => {
//     setEditingEntry(null);
//     setEditForm({
//       driverName: '',
//       liters: '',
//       fillerName: '',
//       note: ''
//     });
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
//         <h2 className="text-2xl font-bold mb-4 text-center text-black">
//           Fuel Entries for {vehicleNumber}
//         </h2>
//         <p className="text-center mb-4 text-black">Total Liters Available: {fetchedTotalLiters}</p>
//         {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
//         {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

//         {entries.length > 0 ? (
//           <div className="overflow-x-auto">
//             <table className="min-w-full bg-white border rounded shadow-md">
//               <thead>
//                 <tr className="bg-gray-100">
//                   <th className="py-2 px-4 border-b text-black">S.No</th>
//                   <th className="py-2 px-4 border-b text-black">Date</th>
//                   <th className="py-2 px-4 border-b text-black">Liters</th>
//                   <th className="py-2 px-4 border-b text-black">Driver Name</th>
//                   <th className="py-2 px-4 border-b text-black">Filler Name</th>
//                   <th className="py-2 px-4 border-b text-black">Time</th>
//                   <th className="py-2 px-4 border-b text-black">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {entries.map((entry, index) => (
//                   <tr key={index} className="hover:bg-gray-50 text-center">
//                     <td className="py-2 px-4 border-b text-black">{index + 1}</td>
//                     <td className="py-2 px-4 border-b text-black">
//                       {(() => {
//                         const d = new Date(entry.date);
//                         const day = String(d.getDate()).padStart(2, "0");
//                         const month = String(d.getMonth() + 1).padStart(2, "0");
//                         const year = d.getFullYear();
//                         return `${day}-${month}-${year}`;
//                       })()}
//                     </td>

//                     {editingEntry === index ? (
//                       <>
//                         <td className="py-2 px-4 border-b text-black">
//                           <input
//                             type="number"
//                             value={editForm.liters}
//                             onChange={(e) => setEditForm({ ...editForm, liters: e.target.value })}
//                             className="w-20 p-1 border rounded text-black"
//                             step="0.01"
//                           />
//                         </td>
//                         <td className="py-2 px-4 border-b text-black">
//                           <input
//                             type="text"
//                             value={editForm.driverName}
//                             onChange={(e) => setEditForm({ ...editForm, driverName: e.target.value })}
//                             className="w-32 p-1 border rounded text-black"
//                           />
//                         </td>
//                         <td className="py-2 px-4 border-b text-black">
//                           <input
//                             type="text"
//                             value={editForm.fillerName}
//                             onChange={(e) => setEditForm({ ...editForm, fillerName: e.target.value })}
//                             className="w-32 p-1 border rounded text-black"
//                           />
//                         </td>
//                       </>
//                     ) : (
//                       <>
//                         <td className="py-2 px-4 border-b text-black">{entry.liters}</td>
//                         <td className="py-2 px-4 border-b text-black">{entry.driverName}</td>
//                         <td className="py-2 px-4 border-b text-black">{entry.fillerName}</td>
//                       </>
//                     )}

//                     <td className="py-2 px-4 border-b text-black">
//                       {entry.entryTime
//                         ? new Date(entry.entryTime).toLocaleString('en-IN', {
//                           timeZone: 'Asia/Kolkata',
//                           hour: '2-digit',
//                           minute: '2-digit',
//                           hour12: true,
//                         })
//                         : 'N/A'}
//                     </td>

//                     <td className="py-2 px-4 border-b text-black">
//                       {editingEntry === index ? (
//                         <div className="flex gap-2 justify-center">
//                           <button
//                             onClick={() => handleUpdate(index)}
//                             className="bg-green-500 text-white px-2 py-1 rounded text-xs hover:bg-green-600"
//                           >
//                             Save
//                           </button>
//                           <button
//                             onClick={cancelEdit}
//                             className="bg-gray-500 text-white px-2 py-1 rounded text-xs hover:bg-gray-600"
//                           >
//                             Cancel
//                           </button>
//                         </div>
//                       ) : (
//                         <div className="flex gap-2 justify-center">
//                           <button
//                             onClick={() => handleEdit(entry, index)}
//                             className="bg-blue-500 text-white px-2 py-1 rounded text-xs hover:bg-blue-600"
//                           >
//                             Edit
//                           </button>
//                           <button
//                             onClick={() => handleDelete(index)}
//                             className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
//                           >
//                             Delete
//                           </button>
//                         </div>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <p className="text-center text-black">No entries found for this vehicle.</p>
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

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';
import Image from 'next/image';

export default function DetailsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const vehicleNumber = searchParams.get('vehicleNumber');
  const queryTotalLiters = parseFloat(searchParams.get('totalLiters')) || 0;

  const [entries, setEntries] = useState([]);
  const [fetchedTotalLiters, setFetchedTotalLiters] = useState(queryTotalLiters);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingEntry, setEditingEntry] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState(null); // Add userRole state
  const [editForm, setEditForm] = useState({
    driverName: '',
    liters: '',
    fillerName: '',
    note: ''
  });

  useEffect(() => {
    async function checkAuth() {
      const authData = await isAuthenticated();
      if (!authData.isValid) {
        router.push('/');
      } else {
        setUserRole(authData.role); // Set the user role
        fetchDetails();
      }
    }

    const fetchDetails = async () => {
      try {
        // Fetch entries
        const entriesResponse = await fetch('/api/vehicle-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleNumber }),
        });
        const entriesData = await entriesResponse.json();
        if (entriesResponse.ok) {
          setEntries(entriesData.entries || []);
        } else {
          setError(entriesData.error || 'Failed to fetch entries');
        }

        // Fetch total liters
        const totalResponse = await fetch('/api/check-vehicle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ vehicleNumber }),
        });
        const totalData = await totalResponse.json();
        if (totalResponse.ok) {
          setFetchedTotalLiters(totalData.totalLiters || 0);
        } else {
          setError(totalData.error || 'Failed to fetch total liters');
        }
      } catch (err) {
        setError('Something went wrong while fetching details');
      }
    };

    if (vehicleNumber) {
      checkAuth();
    }
  }, [router, vehicleNumber]);

  const handleDelete = async (entryIndex) => {
    if (!confirm('Are you sure you want to delete this entry?')) return;

    try {
      const response = await fetch('/api/delete-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ vehicleNumber, entryIndex }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Entry deleted successfully');
        setEntries(data.entries);
        setFetchedTotalLiters(data.totalLiters);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong while deleting entry');
    }
  };

  const handleEdit = (entry, index) => {
    setEditingEntry(index);
    setEditForm({
      driverName: entry.driverName,
      liters: entry.liters,
      fillerName: entry.fillerName,
      note: entry.note || ''
    });
  };

  const handleUpdate = async (entryIndex) => {
    // Validate form before sending
    if (!editForm.driverName.trim() || !editForm.fillerName.trim() || !editForm.liters) {
      setError('Please fill all required fields');
      return;
    }

    const litersValue = parseFloat(editForm.liters);
    if (isNaN(litersValue) || litersValue <= 0) {
      setError('Please enter a valid liters amount');
      return;
    }

    try {
      const response = await fetch('/api/update-entry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          vehicleNumber,
          entryIndex,
          updatedEntry: {
            ...editForm,
            liters: litersValue // Ensure it's a number
          }
        }),
      });
      const data = await response.json();
      if (response.ok) {
        setSuccess('Entry updated successfully');
        setEntries(data.entries);
        setFetchedTotalLiters(data.totalLiters);
        setEditingEntry(null);
        setError(''); // Clear any previous errors
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error);
      }
    } catch (err) {
      setError('Something went wrong while updating entry');
    }
  };

  const cancelEdit = () => {
    setEditingEntry(null);
    setEditForm({
      driverName: '',
      liters: '',
      fillerName: '',
      note: ''
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
              {/* Show user role in navigation */}
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
        <h2 className="text-2xl font-bold mb-4 text-center text-black">
          Fuel Entries for {vehicleNumber}
        </h2>
        <p className="text-center mb-4 text-black">Total Liters Available: {fetchedTotalLiters}</p>
        
        {/* Show access level information */}
        {userRole === 'admin' && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p className="text-yellow-800 text-center text-sm">
              View-only access. Contact administrator for edit permissions.
            </p>
          </div>
        )}
        
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        {success && <p className="text-green-500 mb-4 text-center">{success}</p>}

        {entries.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border rounded shadow-md">
              <thead>
                <tr className="bg-gray-100">
                  <th className="py-2 px-4 border-b text-black">S.No</th>
                  <th className="py-2 px-4 border-b text-black">Date</th>
                  <th className="py-2 px-4 border-b text-black">Liters</th>
                  <th className="py-2 px-4 border-b text-black">Driver Name</th>
                  <th className="py-2 px-4 border-b text-black">Filler Name</th>
                  <th className="py-2 px-4 border-b text-black">Time</th>
                  {/* Conditionally show Actions column only for superadmin */}
                  {userRole === 'superadmin' && (
                    <th className="py-2 px-4 border-b text-black">Actions</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index} className="hover:bg-gray-50 text-center">
                    <td className="py-2 px-4 border-b text-black">{index + 1}</td>
                    <td className="py-2 px-4 border-b text-black">
                      {(() => {
                        const d = new Date(entry.date);
                        const day = String(d.getDate()).padStart(2, "0");
                        const month = String(d.getMonth() + 1).padStart(2, "0");
                        const year = d.getFullYear();
                        return `${day}-${month}-${year}`;
                      })()}
                    </td>

                    {editingEntry === index && userRole === 'superadmin' ? (
                      <>
                        <td className="py-2 px-4 border-b text-black">
                          <input
                            type="number"
                            value={editForm.liters}
                            onChange={(e) => setEditForm({ ...editForm, liters: e.target.value })}
                            className="w-20 p-1 border rounded text-black"
                            step="0.01"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-black">
                          <input
                            type="text"
                            value={editForm.driverName}
                            onChange={(e) => setEditForm({ ...editForm, driverName: e.target.value })}
                            className="w-32 p-1 border rounded text-black"
                          />
                        </td>
                        <td className="py-2 px-4 border-b text-black">
                          <input
                            type="text"
                            value={editForm.fillerName}
                            onChange={(e) => setEditForm({ ...editForm, fillerName: e.target.value })}
                            className="w-32 p-1 border rounded text-black"
                          />
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="py-2 px-4 border-b text-black">{entry.liters}</td>
                        <td className="py-2 px-4 border-b text-black">{entry.driverName}</td>
                        <td className="py-2 px-4 border-b text-black">{entry.fillerName}</td>
                      </>
                    )}

                    <td className="py-2 px-4 border-b text-black">
                      {entry.entryTime
                        ? new Date(entry.entryTime).toLocaleString('en-IN', {
                          timeZone: 'Asia/Kolkata',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true,
                        })
                        : 'N/A'}
                    </td>

                    {/* Conditionally render Actions column only for superadmin */}
                    {userRole === 'superadmin' && (
                      <td className="py-2 px-4 border-b text-black">
                        {editingEntry === index ? (
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
                              onClick={() => handleEdit(entry, index)}
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
          <p className="text-center text-black">No entries found for this vehicle.</p>
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