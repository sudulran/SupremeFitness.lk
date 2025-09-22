import React from "react";
import { Calendar, Clock, User, Mail, X, Trash2 } from "lucide-react";

const AppointmentList = ({
  appointments,
  canceledAppointments,
  handleCancelAppointment,
  handleClearCanceled,
  formatDateDisplay,
  formatTime12,
}) => (
  <div className="space-y-8">
    {/* Booked Trainers Section */}
    <div>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-blue-100 rounded-lg">
          <Calendar className="w-6 h-6 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Booked Trainers</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-blue-200 to-transparent"></div>
      </div>

      {appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((a) => (
            <div
              key={a._id}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100 overflow-hidden group"
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Trainer Info */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors duration-200">
                        <User className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Trainer
                        </span>
                        <p className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                          {a.trainer?.name}
                        </p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-green-50 rounded-lg group-hover:bg-green-100 transition-colors duration-200">
                        <Mail className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Client
                        </span>
                        <p className="text-base font-medium text-gray-900">
                          {a.user?.name}
                        </p>
                        <p className="text-sm text-gray-500">{a.user?.email}</p>
                      </div>
                    </div>

                    {/* Slot Info */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-purple-50 rounded-lg group-hover:bg-purple-100 transition-colors duration-200">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Schedule
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 group-hover:bg-purple-200 transition-colors duration-200">
                            {formatDateDisplay(a.slot?.day)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-700">
                            {formatTime12(a.slot?.start)} -{" "}
                            {formatTime12(a.slot?.end)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Cancel Button */}
                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleCancelAppointment(a._id)}
                      className="px-4 py-2 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 hover:text-red-700 hover:border-red-300 transition-all duration-200 flex items-center space-x-2"
                    >
                      <X className="w-4 h-4" />
                      <span className="font-medium">Cancel</span>
                    </button>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-sm font-medium text-green-600">
                      Active Booking
                    </span>
                  </div>
                </div>
              </div>

              {/* Hover border effect */}
              <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-xl transition-colors duration-300 pointer-events-none"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
          <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-600">
            No appointments booked.
          </p>
          <p className="text-sm text-gray-500 mt-1">
            Appointments will appear here once booked.
          </p>
        </div>
      )}
    </div>

    {/* Canceled Appointments Section */}
    {canceledAppointments.length > 0 && (
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-100 rounded-lg">
              <X className="w-6 h-6 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Canceled Appointments
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-red-200 to-transparent"></div>
          </div>

          <button
            onClick={handleClearCanceled}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg border border-gray-200 hover:bg-gray-200 hover:text-gray-800 hover:border-gray-300 transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50 flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span className="font-medium">Clear Canceled Appointments</span>
          </button>
        </div>

        <div className="space-y-4">
          {canceledAppointments.map((a) => (
            <div
              key={a._id}
              className="bg-red-50 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border-2 border-red-100 overflow-hidden group relative"
            >
              <div className="p-6 opacity-75">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-3">
                    {/* Trainer Info */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <User className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Trainer
                        </span>
                        <p className="text-lg font-semibold text-gray-800 line-through">
                          {a.trainer?.name}
                        </p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Mail className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Client
                        </span>
                        <p className="text-base font-medium text-gray-800 line-through">
                          {a.user?.name}
                        </p>
                        <p className="text-sm text-gray-500 line-through">
                          {a.user?.email}
                        </p>
                      </div>
                    </div>

                    {/* Slot Info */}
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-red-100 rounded-lg">
                        <Clock className="w-5 h-5 text-red-600" />
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-600">
                          Schedule
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-200 text-red-800 line-through">
                            {formatDateDisplay(a.slot?.day)}
                          </span>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm font-medium text-gray-700 line-through">
                            {formatTime12(a.slot?.start)} -{" "}
                            {formatTime12(a.slot?.end)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Canceled Status */}
                <div className="mt-4 pt-4 border-t border-red-200">
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-bold text-red-600 uppercase tracking-wide">
                      Canceled
                    </span>
                  </div>
                </div>
              </div>

              {/* Diagonal canceled stripe */}
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-red-200/20 to-transparent transform rotate-12 scale-150 pointer-events-none"></div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

export default AppointmentList;
