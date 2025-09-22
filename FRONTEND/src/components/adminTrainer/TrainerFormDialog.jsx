import React from "react";
import { X, Plus, Trash2, Upload, User, DollarSign, Phone, Calendar, Clock, Camera } from "lucide-react";

const TrainerFormDialog = ({
  open, onClose, formData, setFormData, editId, handleSave,
  addAvailability, removeAvailability, handleAvailabilityChange, getPreviewSrc, tomorrowStr
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto transform transition-all duration-300 scale-100">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 rounded-t-2xl p-6 z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="w-6 h-6 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">
                {editId ? "Edit Trainer" : "Add Trainer"}
              </h2>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-6 bg-blue-500 rounded"></div>
              <h3 className="text-lg font-semibold text-gray-800">Basic Information</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Name</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                  placeholder="Enter trainer name"
                />
              </div>

              {/* Expertise Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                  <span>Expertise</span>
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                  placeholder="e.g., Yoga, Fitness, Cardio"
                />
              </div>

              {/* Rate Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                <span className="text-green-600 font-semibold">LKR</span>
                <span>Rate Per Hour</span>
                </label>
                <input
                  type="number"
                  value={formData.ratePerHour}
                  onChange={(e) => setFormData({ ...formData, ratePerHour: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                  placeholder="0.00"
                />
              </div>

              {/* Phone Field */}
              <div className="group">
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span>Phone</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 group-hover:border-gray-400"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>

            {/* Active Status Toggle */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${formData.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                <span className="font-medium text-gray-700">Status</span>
                <span className={`text-sm px-2 py-1 rounded-full ${formData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {formData.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <button
                onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                  formData.isActive ? 'bg-green-500' : 'bg-gray-300'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                    formData.isActive ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Profile Image Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-1 h-6 bg-indigo-500 rounded"></div>
              <h3 className="text-lg font-semibold text-gray-800">Profile Image</h3>
            </div>
            
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 hover:border-indigo-400 hover:bg-indigo-50 transition-all duration-200 group">
              <label className="cursor-pointer">
                <div className="text-center">
                  {formData.profileImage ? (
                    <div className="space-y-4">
                      <div className="mx-auto w-32 h-32 rounded-lg overflow-hidden shadow-lg">
                        <img 
                          src={getPreviewSrc(formData.profileImage)} 
                          alt="preview" 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                      </div>
                      <p className="text-sm text-gray-600 font-medium">
                        {formData.profileImage instanceof File ? formData.profileImage.name : formData.profileImage}
                      </p>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, profileImage: null })}
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                      >
                        Remove Image
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-lg flex items-center justify-center group-hover:bg-indigo-200 transition-colors duration-200">
                        <Camera className="w-8 h-8 text-indigo-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700">Upload Profile Image</p>
                        <p className="text-xs text-gray-500">PNG, JPG up to 10MB</p>
                      </div>
                    </div>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => setFormData({ ...formData, profileImage: e.target.files[0] })}
                />
              </label>
            </div>
          </div>

          {/* Availability Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-1 h-6 bg-orange-500 rounded"></div>
                <h3 className="text-lg font-semibold text-gray-800">Availability Schedule</h3>
              </div>
              <button
                onClick={addAvailability}
                className="inline-flex items-center px-3 py-2 bg-orange-50 text-orange-600 rounded-lg hover:bg-orange-100 hover:text-orange-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Slot
              </button>
            </div>

            <div className="space-y-3">
              {formData.availability.map((a, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all duration-200 group"
                >
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
                    {/* Day Field */}
                    <div className="md:col-span-5">
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center space-x-1">
                        <Calendar className="w-3 h-3" />
                        <span>Date</span>
                      </label>
                      <input
                        type="date"
                        value={a.day ? new Date(a.day).toISOString().split("T")[0] : ""}
                        min={tomorrowStr}
                        onChange={(e) => handleAvailabilityChange(index, "day", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>

                    {/* Start Time */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>Start</span>
                      </label>
                      <input
                        type="time"
                        value={a.start}
                        onChange={(e) => handleAvailabilityChange(index, "start", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>

                    {/* End Time */}
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-gray-600 mb-1 flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>End</span>
                      </label>
                      <input
                        type="time"
                        value={a.end}
                        onChange={(e) => handleAvailabilityChange(index, "end", e.target.value)}
                        className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-200 text-sm"
                      />
                    </div>

                    {/* Delete Button */}
                    <div className="md:col-span-1 flex justify-center">
                      <button
                        onClick={() => removeAvailability(index)}
                        className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}

              {formData.availability.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No availability slots added yet.</p>
                  <p className="text-xs mt-1">Click "Add Slot" to create schedule.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 rounded-b-2xl p-6">
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-6 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 hover:text-gray-800 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 font-medium"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 shadow-md hover:shadow-lg font-medium"
            >
              {editId ? "Update Trainer" : "Save Trainer"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrainerFormDialog;