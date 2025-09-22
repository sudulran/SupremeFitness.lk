import React, { useState, useEffect } from "react";
import { Bell, X, Check, Trash2, Settings } from "lucide-react";

const NotificationsMenu = ({
  notifications = [
    {
      _id: 1,
      message: "New order received #1234 at 2024-09-20T15:30:00.000Z",
      isRead: false,
      type: "order",
      priority: "high"
    },
    {
      _id: 2,
      message: "Payment processed for invoice #5678 at 2024-09-20T14:15:00.000Z",
      isRead: true,
      type: "payment",
      priority: "medium"
    },
    {
      _id: 3,
      message: "System maintenance scheduled for 2024-09-20T22:00:00.000Z",
      isRead: false,
      type: "system",
      priority: "low"
    },
    {
      _id: 4,
      message: "Welcome to our platform! Get started with your first project.",
      isRead: false,
      type: "welcome",
      priority: "medium"
    }
  ],
  anchorEl,
  openNotifMenu = false,
  handleNotifClick,
  handleNotifClose,
  markNotificationRead = (id) => console.log('Mark read:', id),
  clearNotifications = () => console.log('Clear all')
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [animatingItems, setAnimatingItems] = useState(new Set());
  const [hoveredItem, setHoveredItem] = useState(null);

  // Format ISO date string to "Mon, Sep 23 3:15 PM"
  const formatISODate = (isoStr) => {
    const date = new Date(isoStr);
    if (isNaN(date)) return isoStr;

    const options = { month: "short", day: "numeric" };
    const datePart = date.toLocaleDateString(undefined, options);

    let hours = date.getHours();
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12;

    return `${datePart} ${hours}:${minutes} ${ampm}`;
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'order': return '🛍️';
      case 'payment': return '💳';
      case 'system': return '⚙️';
      case 'welcome': return '👋';
      default: return '📢';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-yellow-100 border-yellow-300 text-yellow-800';
      case 'low': return 'bg-green-100 border-green-300 text-green-800';
      default: return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = (id) => {
    setAnimatingItems(prev => new Set(prev).add(id));
    setTimeout(() => {
      markNotificationRead(id);
      setAnimatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
    }, 300);
  };

  const handleClearAll = () => {
    setAnimatingItems(new Set(notifications.map(n => n._id)));
    setTimeout(() => {
      clearNotifications();
      setAnimatingItems(new Set());
    }, 500);
  };

  return (
    <div className="relative">
      {/* Notification Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 active:scale-95 border border-gray-200 group"
      >
        <Bell 
          size={24} 
          className={`transition-all duration-300 ${isOpen ? 'text-blue-600 rotate-12' : 'text-gray-600 group-hover:text-blue-500'}`}
        />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full min-w-[20px] h-5 flex items-center justify-center font-semibold animate-pulse shadow-lg">
            {unreadCount > 99 ? '99+' : unreadCount}
          </div>
        )}
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 rounded-full min-w-[20px] h-5 animate-ping opacity-30"></div>
        )}
      </button>

      {/* Notification Panel */}
      <div className={`absolute right-0 top-full mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-100 transition-all duration-300 transform origin-top-right z-50 ${
        isOpen 
          ? 'opacity-100 scale-100 translate-y-0' 
          : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
      }`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-xl">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800 text-lg flex items-center gap-2">
              <Bell size={20} className="text-blue-600" />
              Notifications
              {unreadCount > 0 && (
                <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                  {unreadCount} new
                </span>
              )}
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearAll}
                className="p-2 hover:bg-white/80 rounded-lg transition-colors duration-200 text-gray-500 hover:text-red-600 group"
                title="Clear all"
              >
                <Trash2 size={16} className="group-hover:animate-bounce" />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-white/80 rounded-lg transition-colors duration-200 text-gray-500 hover:text-gray-700"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto custom-scrollbar">
          {notifications.length > 0 ? (
            <div className="p-2">
              {notifications.map((notification, index) => {
                let msg = notification.message;
                msg = msg.replace(
                  /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g,
                  (match) => formatISODate(match)
                );

                const isAnimating = animatingItems.has(notification._id);
                const isHovered = hoveredItem === notification._id;

                return (
                  <div
                    key={notification._id}
                    className={`group p-3 rounded-lg mb-2 transition-all duration-300 cursor-pointer border ${
                      !notification.isRead 
                        ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 shadow-sm' 
                        : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                    } ${isAnimating ? 'animate-pulse opacity-50 scale-95' : 'hover:scale-[1.02] hover:shadow-md'}`}
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animation: isOpen ? 'slideIn 0.3s ease-out forwards' : 'none'
                    }}
                    onMouseEnter={() => setHoveredItem(notification._id)}
                    onMouseLeave={() => setHoveredItem(null)}
                    onClick={() => handleMarkRead(notification._id)}
                  >
                    <div className="flex items-start gap-3">
                      {/* Notification Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-lg ${
                          !notification.isRead ? 'bg-blue-100' : 'bg-gray-100'
                        } transition-all duration-200 ${isHovered ? 'scale-110' : ''}`}>
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>

                      {/* Notification Content */}
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm leading-5 ${
                          !notification.isRead ? 'font-medium text-gray-900' : 'text-gray-700'
                        }`}>
                          {msg}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs border ${getPriorityColor(notification.priority)}`}>
                            {notification.priority} priority
                          </span>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className={`flex items-center gap-1 transition-all duration-200 ${
                        isHovered ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-2'
                      }`}>
                        {!notification.isRead && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMarkRead(notification._id);
                            }}
                            className="p-1.5 hover:bg-green-100 rounded-md transition-colors duration-200 text-green-600 hover:text-green-700"
                            title="Mark as read"
                          >
                            <Check size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-8 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Bell size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No notifications</p>
              <p className="text-gray-400 text-sm mt-1">You're all caught up!</p>
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-3 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            {/* <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 px-4 rounded-lg hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2">
              <Settings size={16} />
              View All Notifications
            </button> */}
          </div>
        )}
      </div>

      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 transition-all duration-300"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
};

export default NotificationsMenu;