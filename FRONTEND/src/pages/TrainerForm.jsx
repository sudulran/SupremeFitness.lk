// import { useState } from "react";

// export default function TrainerForm({ onSave, onClose, initialData }) {
//   const [formData, setFormData] = useState(
//     initialData || { name: "", expertise: "", ratePerHour: "", availability: [] }
//   );

//   const handleAvailabilityChange = (index, field, value) => {
//     const updated = [...formData.availability];
//     updated[index][field] = value;
//     setFormData({ ...formData, availability: updated });
//   };

//   const addAvailability = () => {
//     setFormData({
//       ...formData,
//       availability: [...formData.availability, { day: "", start: "", end: "" }],
//     });
//   };

//   const removeAvailability = (index) => {
//     setFormData({
//       ...formData,
//       availability: formData.availability.filter((_, i) => i !== index),
//     });
//   };

//   return (
//     <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
//       <div className="bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
//         <h2 className="text-xl font-bold mb-4">
//           {initialData ? "Edit Trainer" : "Add Trainer"}
//         </h2>

//         {/* Name */}
//         <input
//           type="text"
//           placeholder="Name"
//           value={formData.name}
//           onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//           className="w-full p-2 border rounded mb-3"
//         />

//         {/* Expertise */}
//         <input
//           type="text"
//           placeholder="Expertise"
//           value={formData.expertise}
//           onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
//           className="w-full p-2 border rounded mb-3"
//         />

//         {/* Rate Per Hour */}
//         <input
//           type="number"
//           placeholder="Rate per Hour"
//           value={formData.ratePerHour}
//           onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
//           className="w-full p-2 border rounded mb-3"
//         />

//         {/* Availability */}
//         <h3 className="font-semibold mt-4 mb-2">Availability</h3>
//         {formData.availability.map((a, index) => (
//           <div key={index} className="flex gap-2 mb-2">
//             <input
//               type="text"
//               placeholder="Day"
//               value={a.day}
//               onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)}
//               className="flex-1 p-2 border rounded"
//             />
//             <input
//               type="time"
//               value={a.start}
//               onChange={(e) => handleAvailabilityChange(index, "start", e.target.value)}
//               className="p-2 border rounded"
//             />
//             <input
//               type="time"
//               value={a.end}
//               onChange={(e) => handleAvailabilityChange(index, "end", e.target.value)}
//               className="p-2 border rounded"
//             />
//             <button
//               onClick={() => removeAvailability(index)}
//               className="text-red-500 font-bold"
//             >
//               ✕
//             </button>
//           </div>
//         ))}

//         <button
//           onClick={addAvailability}
//           className="text-blue-600 text-sm font-medium mb-4"
//         >
//           + Add Availability
//         </button>

//         {/* Actions */}
//         <div className="flex justify-end gap-3">
//           <button
//             onClick={onClose}
//             className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
//           >
//             Cancel
//           </button>
//           <button
//             onClick={() => onSave(formData)}
//             className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//           >
//             Save
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }
