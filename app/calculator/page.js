// 'use client'
// import { useState } from 'react'
// import { useRouter, useSearchParams } from 'next/navigation';
// import { isAuthenticated } from '../../lib/auth';

// export default function DetailsPage() {
//   // const router = useRouter();
//   // Petrol cards
//   const [petrolCards, setPetrolCards] = useState([
//     { field1: '', field2: '', field3: '', result: 0 },
//     { field1: '', field2: '', field3: '', result: 0 },
//     { field1: '', field2: '', field3: '', result: 0 },
//     { field1: '', field2: '', field3: '', result: 0 }
//   ])
  
//   // Diesel cards
//   const [dieselCards, setDieselCards] = useState([
//     { field1: '', field2: '', field3: '', result: 0 },
//     { field1: '', field2: '', field3: '', result: 0 },
//     { field1: '', field2: '', field3: '', result: 0 },
//     { field1: '', field2: '', field3: '', result: 0 }
//   ])
  
//   const [petrolMultiplier, setPetrolMultiplier] = useState('')
//   const [dieselMultiplier, setDieselMultiplier] = useState('')

//   const calculateResult = (field1, field2, field3) => {
//     const num1 = parseFloat(field1) || 0
//     const num2 = parseFloat(field2) || 0
//     const num3 = parseFloat(field3) || 0
//     return num1 - num2 - num3
//   }

//   const handleInputChange = (cardIndex, fieldName, value, fuelType) => {
//     if (fuelType === 'petrol') {
//       const updatedCards = [...petrolCards]
//       updatedCards[cardIndex][fieldName] = value
      
//       const { field1, field2, field3 } = updatedCards[cardIndex]
//       updatedCards[cardIndex].result = calculateResult(field1, field2, field3)
      
//       setPetrolCards(updatedCards)
//     } else {
//       const updatedCards = [...dieselCards]
//       updatedCards[cardIndex][fieldName] = value
      
//       const { field1, field2, field3 } = updatedCards[cardIndex]
//       updatedCards[cardIndex].result = calculateResult(field1, field2, field3)
      
//       setDieselCards(updatedCards)
//     }
//   }

//   const getTotalSum = (cards) => {
//     return cards.reduce((sum, card) => sum + card.result, 0)
//   }

//   const getFinalResult = (cards, multiplier) => {
//     const totalSum = getTotalSum(cards)
//     const multiplierValue = parseFloat(multiplier) || 0
//     return totalSum * multiplierValue
//   }

//   const getGrandTotal = () => {
//     const petrolFinal = getFinalResult(petrolCards, petrolMultiplier)
//     const dieselFinal = getFinalResult(dieselCards, dieselMultiplier)
//     return petrolFinal + dieselFinal
//   }

//   const renderFuelSection = (cards, fuelType, multiplier, setMultiplier, color, fname) => (
//     <div className="mb-12">
//       <h2 className={`text-3xl font-bold text-center mb-6 text-${color}-800 uppercase`}>
//         {fuelType}  ({fname})
//       </h2>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
//         {cards.map((card, index) => (
//           <div key={index} className={`bg-white rounded-lg shadow-lg p-6 border-2 border-${color}-200`}>
//             <h3 className={`text-lg font-semibold mb-4 text-${color}-700`}>
//               {fuelType} nozzle {index + 1}
//             </h3>
            
//             <div className="flex p-5 flex-col gap-3 mb-4">
//               <input
//                 type="number"
//                 placeholder="New Reading Number"
//                 value={card.field1}
//                 onChange={(e) => handleInputChange(index, 'field1', e.target.value, fuelType)}
//                 className={`w-50 px-3 py-2 border-2 border-${color}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${color}-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//               />
              
//               <span className="text-xl font-bold text-gray-600">-</span>
              
//               <input
//                 type="number"
//                 placeholder="Old Reading Number"
//                 value={card.field2}
//                 onChange={(e) => handleInputChange(index, 'field2', e.target.value, fuelType)}
//                 className={`w-50 px-3 py-2 border-2 border-${color}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${color}-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//               />
              
//               <span className="text-xl font-bold text-gray-600">-</span>
              
//               <input
//                 type="number"
//                 placeholder="Testing"
//                 value={card.field3}
//                 onChange={(e) => handleInputChange(index, 'field3', e.target.value, fuelType)}
//                 className={`w-20 px-3 py-2 border-2 border-${color}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${color}-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//               />
              
//               <span className="text-xl font-bold text-gray-600">=</span>
              
//               <div className={`bg-${color}-100 px-4 py-2 rounded-md min-w-[60px] font-bold text-${color}-800`}>
//                 {card.result}
//               </div>
//             </div>
            
//             <div className="text-sm text-gray-600">
//               {card.field1 || '0'} - {card.field2 || '0'} - {card.field3 || '0'} = {card.result}
//             </div>
//           </div>
//         ))}
//       </div>
      
//       {/* Sum Section */}
//       <div className={`bg-${color}-50 rounded-lg shadow-lg p-6 border-2 border-${color}-200 mb-6`}>
//         <h3 className={`text-xl font-bold mb-4 text-${color}-800`}>
//           {fuelType} Sum of All Results
//         </h3>
        
//         <div className="flex items-center justify-center gap-3 mb-4">
//           {cards.map((card, index) => (
//             <span key={index} className="flex items-center gap-2">
//               <span className={`bg-${color}-100 px-3 py-1 rounded text-${color}-800 font-semibold`}>
//                 {card.result}
//               </span>
//               {index < cards.length - 1 && (
//                 <span className={`text-${color}-600 font-bold`}>+</span>
//               )}
//             </span>
//           ))}
          
//           <span className={`text-2xl font-bold text-${color}-600 mx-3`}>=</span>
          
//           <div className={`bg-${color}-200 px-6 py-3 rounded-lg font-bold text-2xl text-${color}-800`}>
//             {getTotalSum(cards)}
//           </div>
//         </div>
//       </div>

//       {/* Final Calculation Section */}
//       <div className={`bg-${color}-100 rounded-lg shadow-lg p-6 border-2 border-${color}-300`}>
//         <h3 className={`text-xl font-bold mb-4 text-${color}-800`}>
//           {fuelType} Final Calculation
//         </h3>
        
//         <div className="flex items-center justify-center gap-4 mb-4">
//           <div className={`bg-${color}-200 px-4 py-2 rounded-lg font-bold text-${color}-800`}>
//             {getTotalSum(cards)}
//           </div>
          
//           <span className={`text-2xl font-bold text-${color}-600`}>×</span>
          
//           <input
//             type="number"
//             placeholder="Enter multiplier"
//             value={multiplier}
//             onChange={(e) => setMultiplier(e.target.value)}
//             className={`w-32 px-4 py-2 border-2 border-${color}-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-${color}-500 text-center font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
//           />
          
//           <span className={`text-2xl font-bold text-${color}-600`}>=</span>
          
//           <div className={`bg-${color}-400 px-6 py-3 rounded-lg font-bold text-2xl text-${color}-900 min-w-[100px] text-center`}>
//             {getFinalResult(cards, multiplier)}
//           </div>
//         </div>
        
//         <div className={`text-center text-${color}-700`}>
//           {fuelType} Final: {getTotalSum(cards)} × {multiplier || '0'} = {getFinalResult(cards, multiplier)}
//         </div>
//       </div>
//     </div>
//   )

//   return (
//     <div className="max-w-6xl mx-auto p-6 bg-gray-50 min-h-screen">
//       <h1 className="text-4xl font-bold text-center mb-12 text-gray-800">
//         Fuel Calculator - Petrol & Diesel
//       </h1>
      
//       {/* Petrol Section */}
//       {renderFuelSection(petrolCards, 'petrol', petrolMultiplier, setPetrolMultiplier, 'blue', 'Motor Spirit')}
      
//       {/* Diesel Section */}
//       {renderFuelSection(dieselCards, 'diesel', dieselMultiplier, setDieselMultiplier, 'orange', 'High Speed Diesel')}
      
//       {/* Grand Total Section */}
//       <div className="bg-red-50 rounded-lg shadow-lg p-8 border-2 border-red-200">
//         <h2 className="text-3xl font-bold mb-6 text-red-800 text-center">GRAND TOTAL</h2>
        
//         <div className="flex items-center justify-center gap-6 mb-6">
//           <div className="text-center">
//             <div className="text-sm text-blue-600 font-semibold mb-2">Petrol Final</div>
//             <div className="bg-blue-200 px-6 py-3 rounded-lg font-bold text-xl text-blue-800">
//               {getFinalResult(petrolCards, petrolMultiplier)}
//             </div>
//           </div>
          
//           <span className="text-3xl font-bold text-red-600">+</span>
          
//           <div className="text-center">
//             <div className="text-sm text-orange-600 font-semibold mb-2">Diesel Final</div>
//             <div className="bg-orange-200 px-6 py-3 rounded-lg font-bold text-xl text-orange-800">
//               {getFinalResult(dieselCards, dieselMultiplier)}
//             </div>
//           </div>
          
//           <span className="text-3xl font-bold text-red-600">=</span>
          
//           <div className="text-center">
//             <div className="text-sm text-red-600 font-semibold mb-2">Grand Total</div>
//             <div className="bg-red-300 px-8 py-4 rounded-lg font-bold text-3xl text-red-900">
//               {getGrandTotal()}
//             </div>
//           </div>
//         </div>
        
//         <div className="text-center text-red-700 text-lg">
//           <div className="mb-2">
//             Petrol: {getFinalResult(petrolCards, petrolMultiplier)} + Diesel: {getFinalResult(dieselCards, dieselMultiplier)}
//           </div>
//           <div className="font-bold text-xl">
//             = {getGrandTotal()}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'
import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation';
import { isAuthenticated } from '../../lib/auth';

export default function DetailsPage() {
  // const router = useRouter();
  // Petrol cards
  const [petrolCards, setPetrolCards] = useState([
    { field1: '', field2: '', field3: '', result: 0 },
    { field1: '', field2: '', field3: '', result: 0 },
    { field1: '', field2: '', field3: '', result: 0 },
    { field1: '', field2: '', field3: '', result: 0 }
  ])
  
  // Diesel cards
  const [dieselCards, setDieselCards] = useState([
    { field1: '', field2: '', field3: '', result: 0 },
    { field1: '', field2: '', field3: '', result: 0 },
    { field1: '', field2: '', field3: '', result: 0 },
    { field1: '', field2: '', field3: '', result: 0 }
  ])
  
  const [petrolMultiplier, setPetrolMultiplier] = useState('')
  const [dieselMultiplier, setDieselMultiplier] = useState('')

  const calculateResult = (field1, field2, field3) => {
    const num1 = parseFloat(field1) || 0
    const num2 = parseFloat(field2) || 0
    const num3 = parseFloat(field3) || 0
    return num1 - num2 - num3
  }

  const handleInputChange = (cardIndex, fieldName, value, fuelType) => {
    if (fuelType === 'petrol') {
      const updatedCards = [...petrolCards]
      updatedCards[cardIndex][fieldName] = value
      
      const { field1, field2, field3 } = updatedCards[cardIndex]
      updatedCards[cardIndex].result = calculateResult(field1, field2, field3)
      
      setPetrolCards(updatedCards)
    } else {
      const updatedCards = [...dieselCards]
      updatedCards[cardIndex][fieldName] = value
      
      const { field1, field2, field3 } = updatedCards[cardIndex]
      updatedCards[cardIndex].result = calculateResult(field1, field2, field3)
      
      setDieselCards(updatedCards)
    }
  }

  const getTotalSum = (cards) => {
    return cards.reduce((sum, card) => sum + card.result, 0)
  }

  const getFinalResult = (cards, multiplier) => {
    const totalSum = getTotalSum(cards)
    const multiplierValue = parseFloat(multiplier) || 0
    return totalSum * multiplierValue
  }

  const getGrandTotal = () => {
    const petrolFinal = getFinalResult(petrolCards, petrolMultiplier)
    const dieselFinal = getFinalResult(dieselCards, dieselMultiplier)
    return petrolFinal + dieselFinal
  }

  const renderFuelSection = (cards, fuelType, multiplier, setMultiplier, color, fname) => (
    <div className="mb-12">
      <h2 className={`text-3xl font-bold text-center mb-6 text-${color}-800 uppercase`}>
        {fuelType}  ({fname})
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {cards.map((card, index) => (
          <div key={index} className={`bg-white rounded-lg shadow-lg p-6 border-2 border-${color}-200`}>
            <h3 className={`text-lg font-semibold mb-4 text-${color}-700`}>
              {fuelType} nozzle {index + 1}
            </h3>
            
            <div className="flex p-5 flex-col gap-3 mb-4">
              <input
                type="number"
                placeholder="New Reading Number"
                value={card.field1}
                onChange={(e) => handleInputChange(index, 'field1', e.target.value, fuelType)}
                className={`w-full px-3 py-2 border-2 border-${color}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${color}-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              />
              
              <span className="text-xl font-bold text-gray-600">-</span>
              
              <input
                type="number"
                placeholder="Old Reading Number"
                value={card.field2}
                onChange={(e) => handleInputChange(index, 'field2', e.target.value, fuelType)}
                className={`w-full px-3 py-2 border-2 border-${color}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${color}-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              />
              
              <span className="text-xl font-bold text-gray-600">-</span>
              
              <input
                type="number"
                placeholder="Testing"
                value={card.field3}
                onChange={(e) => handleInputChange(index, 'field3', e.target.value, fuelType)}
                className={`w-full px-3 py-2 border-2 border-${color}-300 rounded-md focus:outline-none focus:ring-2 focus:ring-${color}-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
              />
              
              <span className="text-xl font-bold text-gray-600">=</span>
              
              <div className={`bg-${color}-100 px-4 py-2 rounded-md min-w-[60px] font-bold text-${color}-800 overflow-x-auto`}>
                {card.result}
              </div>
            </div>
            
            <div className="text-sm text-gray-600 overflow-x-auto">
              {card.field1 || '0'} - {card.field2 || '0'} - {card.field3 || '0'} = {card.result}
            </div>
          </div>
        ))}
      </div>
      
      {/* Sum Section */}
      <div className={`bg-${color}-50 rounded-lg shadow-lg p-6 border-2 border-${color}-200 mb-6`}>
        <h3 className={`text-xl font-bold mb-4 text-${color}-800`}>
          {fuelType} Sum of All Results
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-3 mb-4 flex-wrap">
          {cards.map((card, index) => (
            <span key={index} className="flex items-center gap-2 mb-2">
              <span className={`bg-${color}-100 px-3 py-1 rounded text-${color}-800 font-semibold overflow-x-auto max-w-[120px]`}>
                {card.result}
              </span>
              {index < cards.length - 1 && (
                <span className={`text-${color}-600 font-bold`}>+</span>
              )}
            </span>
          ))}
          
          <span className={`text-2xl font-bold text-${color}-600 mx-3`}>=</span>
          
          <div className={`bg-${color}-200 px-6 py-3 rounded-lg font-bold text-2xl text-${color}-800 overflow-x-auto min-w-[100px] text-center`}>
            {getTotalSum(cards)}
          </div>
        </div>
      </div>

      {/* Final Calculation Section */}
      <div className={`bg-${color}-100 rounded-lg shadow-lg p-6 border-2 border-${color}-300`}>
        <h3 className={`text-xl font-bold mb-4 text-${color}-800`}>
          {fuelType} Final Calculation
        </h3>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4 flex-wrap">
          <div className={`bg-${color}-200 px-4 py-2 rounded-lg font-bold text-${color}-800 overflow-x-auto min-w-[100px] text-center`}>
            {getTotalSum(cards)}
          </div>
          
          <span className={`text-2xl font-bold text-${color}-600`}>×</span>
          
          <input
            type="number"
            placeholder="Enter multiplier"
            value={multiplier}
            onChange={(e) => setMultiplier(e.target.value)}
            className={`w-full md:w-32 px-4 py-2 border-2 border-${color}-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-${color}-500 text-center font-semibold [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
          />
          
          <span className={`text-2xl font-bold text-${color}-600`}>=</span>
          
          <div className={`bg-${color}-400 px-6 py-3 rounded-lg font-bold text-2xl text-${color}-900 min-w-[100px] text-center overflow-x-auto`}>
            {getFinalResult(cards, multiplier)}
          </div>
        </div>
        
        <div className={`text-center text-${color}-700 overflow-x-auto`}>
          {fuelType} Final: {getTotalSum(cards)} × {multiplier || '0'} = {getFinalResult(cards, multiplier)}
        </div>
      </div>
    </div>
  )

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">

      <h1>fuyfgyuggsg</h1>

      <h1 className="text-3xl md:text-4xl font-bold text-center mb-8 md:mb-12 text-gray-800">
        Fuel Calculator - Petrol & Diesel
      </h1>
      
      {/* Petrol Section */}
      {renderFuelSection(petrolCards, 'petrol', petrolMultiplier, setPetrolMultiplier, 'blue', 'Motor Spirit')}
      
      {/* Diesel Section */}
      {renderFuelSection(dieselCards, 'diesel', dieselMultiplier, setDieselMultiplier, 'orange', 'High Speed Diesel')}
      
      {/* Grand Total Section */}
      <div className="bg-red-50 rounded-lg shadow-lg p-6 md:p-8 border-2 border-red-200">
        <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-red-800 text-center">GRAND TOTAL</h2>
        
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-4 md:mb-6">
          <div className="text-center">
            <div className="text-sm text-blue-600 font-semibold mb-2">Petrol Final</div>
            <div className="bg-blue-200 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold text-lg md:text-xl text-blue-800 overflow-x-auto min-w-[100px]">
              {getFinalResult(petrolCards, petrolMultiplier)}
            </div>
          </div>
          
          <span className="text-2xl md:text-3xl font-bold text-red-600">+</span>
          
          <div className="text-center">
            <div className="text-sm text-orange-600 font-semibold mb-2">Diesel Final</div>
            <div className="bg-orange-200 px-4 md:px-6 py-2 md:py-3 rounded-lg font-bold text-lg md:text-xl text-orange-800 overflow-x-auto min-w-[100px]">
              {getFinalResult(dieselCards, dieselMultiplier)}
            </div>
          </div>
          
          <span className="text-2xl md:text-3xl font-bold text-red-600">=</span>
          
          <div className="text-center">
            <div className="text-sm text-red-600 font-semibold mb-2">Grand Total</div>
            <div className="bg-red-300 px-6 md:px-8 py-3 md:py-4 rounded-lg font-bold text-2xl md:text-3xl text-red-900 overflow-x-auto min-w-[120px] text-center">
              {getGrandTotal()}
            </div>
          </div>
        </div>
        
        <div className="text-center text-red-700 text-base md:text-lg overflow-x-auto">
          <div className="mb-2">
            Petrol: {getFinalResult(petrolCards, petrolMultiplier)} + Diesel: {getFinalResult(dieselCards, dieselMultiplier)}
          </div>
          <div className="font-bold text-lg md:text-xl">
            = {getGrandTotal()}
          </div>
        </div>
      </div>
    </div>
  )
}