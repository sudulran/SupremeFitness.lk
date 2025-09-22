import React from "react";
import { Edit, Delete } from "lucide-react";

// Component name must start with uppercase
const AdminCard = ({ trainer, onEdit, onDelete, getPreviewSrc, formatDateDisplay, formatTime12 }) => (
  <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
       style={{ width: '280px', minHeight: '420px', display: 'flex', flexDirection: 'column' }}>
    
    <div className="p-4 flex-1 flex flex-col justify-between">
      <div>
        <div className="flex items-center space-x-4">
          {/* Avatar Section */}
          <div className="relative">
            <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-white shadow-lg group-hover:ring-blue-100 transition-all duration-300">
              <img 
                src={getPreviewSrc(trainer.profileImage)} 
                alt={trainer.name}
                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
              />
            </div>
            <div className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full border-2 border-white ${trainer.isActive ? 'bg-green-500' : 'bg-red-500'} shadow-sm`}></div>
          </div>

          {/* Content Section */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-200 truncate">
              {trainer.name}
            </h3>
            
            {/* Expertise
            {trainer.expertise && (
              <div className="mt-3">
                 <div className="font-medium text-gray-700 text-sm mb-1">Expertise:</div>
                <div className="flex flex-col space-y-1">
                  {trainer.expertise.split(",").map((exp, idx) => (
                    <span key={idx} className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 cursor-pointer transition-colors duration-200">
                      {exp.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )} */}

            {/* Rate */}
            <span className="font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg text-sm">
              LKR{trainer.ratePerHour}/hr
            </span>

            {/* Phone */}
            <div className="text-sm text-gray-600 truncate">{trainer.phone}</div>
          </div>
        </div>
        {/* Expertise styled same as Availability */}
        {trainer.expertise && trainer.expertise.length > 0 && (
        <div className="mt-3">
            <div className="font-medium text-gray-700 text-sm mb-1">Expertise:</div>
            <div className="flex flex-col space-y-1">
            {trainer.expertise.split(",").map((exp, idx) => (
                <span
                key={idx}
                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-800 hover:bg-blue-100 cursor-pointer transition-colors duration-200"
                >
                {exp.trim()}
                </span>
            ))}
            </div>
        </div>
        )}

        {/* Availability styled same as Expertise */}
        {trainer.availability && trainer.availability.length > 0 && (
          <div className="mt-3">
            <div className="font-medium text-gray-700 text-sm mb-1">Availability:</div>
            <div className="flex flex-col space-y-1">
              {trainer.availability.map((a, idx) => (
                <span
                  key={idx}
                  className="px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-800 hover:bg-green-100 cursor-pointer transition-colors duration-200"
                >
                  {formatDateDisplay(a.day)} ({formatTime12(a.start)} - {formatTime12(a.end)})
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-4 flex justify-between space-x-2 opacity-100">
        <button 
          onClick={() => onEdit(trainer)}
          className="flex-1 p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200"
          title="Edit trainer"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onDelete(trainer._id)}
          className="flex-1 p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 hover:text-red-700 transition-all duration-200"
          title="Delete trainer"
        >
          <Delete size={16} />
        </button>
      </div>
    </div>
  </div>
);

export default AdminCard;