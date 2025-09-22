import React, { useState } from "react";
import {
  Star,
  Phone,
  Calendar,
  Heart,
  Share2,
  X,
  Plus,
  Edit,
  Trash2,
  User,
} from "lucide-react";

// Reviews Modal Component
const ReviewsModal = ({
  trainer,
  currentUserId,
  isOpen,
  onClose,
  onOpenReview,
  onDeleteReview,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-4">
            <img
              src={
                trainer.profileImage
                  ? `http://localhost:5000/${trainer.profileImage.replace(
                      /\\/g,
                      "/"
                    )}`
                  : "https://via.placeholder.com/64"
              }
              alt={trainer.name}
              className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{trainer.name}</h2>
              <p className="text-sm text-gray-500">{trainer.expertise}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Rating Summary */}
          <div className="flex items-center gap-4 mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl">
            <div className="flex items-center gap-2">
              <Star size={20} className="text-yellow-500" fill="currentColor" />
              <span className="text-2xl font-bold text-gray-800">
                {Number(trainer.averageRating || 0).toFixed(1)}
              </span>
            </div>
            <div className="text-sm text-gray-600">
              <p>Average Rating</p>
              <p>({trainer.reviews?.length || 0} reviews)</p>
            </div>
          </div>

          {/* Add Review */}
          <button
            onClick={() => onOpenReview(trainer)}
            className="w-full mb-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2"
          >
            <Plus size={18} /> Add Your Review
          </button>

          {/* Reviews List */}
          <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
            {trainer.reviews && trainer.reviews.length > 0 ? (
              trainer.reviews.map((review) => {
                const reviewOwnerId =
                  typeof review.user === "string" ? review.user : review.user?._id;
                const isOwner =
                  reviewOwnerId &&
                  currentUserId &&
                  reviewOwnerId.toString() === currentUserId.toString();

                return (
                  <div
                    key={review._id}
                    className="border border-gray-200 rounded-xl p-4 bg-gray-50 hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {isOwner ? "You" : "User"}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={14}
                            className={
                              i < (review.rating || 0) ? "text-yellow-500" : "text-gray-300"
                            }
                            fill="currentColor"
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{review.comment}</p>
                    {isOwner && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => onOpenReview(trainer, review)}
                          className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 hover:bg-blue-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          <Edit size={12} /> Edit
                        </button>
                        <button
                          onClick={() => onDeleteReview(trainer._id, review._id)}
                          className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 hover:bg-red-50 px-2 py-1 rounded-lg transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Star size={32} className="mx-auto mb-2 text-gray-300" />
                <p>No reviews yet</p>
                <p className="text-sm">Be the first to review this trainer!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Availability Dropdown
const AvailabilityDropdown = ({ availability, formatTime12 }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!availability || availability.length === 0) {
    return (
      <div className="flex items-center gap-2 p-2 bg-gray-50 rounded-md text-xs text-gray-500">
        <Calendar size={14} /> No availability
      </div>
    );
  }

  const formatDateDisplay = (dateStr) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}-${d.getDate()}`;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full p-2 bg-gray-50 hover:bg-gray-100 rounded-md text-xs text-gray-600"
      >
        <span>View Schedule ({availability.length})</span>
        <Calendar size={14} />
      </button>
      {isOpen && (
        <div className="absolute mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-36 overflow-y-auto z-10">
          {availability.map((slot, i) => (
            <div
              key={i}
              className="flex justify-between p-2 text-xs hover:bg-blue-50 rounded-md"
            >
              <span>{formatDateDisplay(slot.day)}</span>
              <span>
                {formatTime12(slot.start)} - {formatTime12(slot.end)}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// Main TrainerCard
const TrainerCard = ({
  trainer,
  currentUserId,
  formatTime12,
  onOpenBooking,
  onOpenReview,
  onDeleteReview,
}) => {
  const [showReviewsModal, setShowReviewsModal] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const latestReview = trainer.reviews?.[0];

  return (
    <>
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 w-72 flex flex-col border border-gray-100 overflow-hidden">
        {/* Image + Active badge */}
        <div className="relative h-40 overflow-hidden">
          <img
            src={
              trainer.profileImage
                ? `http://localhost:5000/${trainer.profileImage.replace(/\\/g, "/")}`
                : "https://via.placeholder.com/288x160"
            }
            alt={trainer.name}
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
          />
          <span
            className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full font-semibold ${
              trainer.isActive ? "bg-green-500 text-white" : "bg-gray-500 text-white"
            }`}
          >
            {trainer.isActive ? "Active" : "Inactive"}
          </span>
        </div>

        {/* Content */}
        <div className="p-4 flex flex-col gap-2 flex-1">
          {/* Header + Actions */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-gray-800 truncate">{trainer.name}</h2>
            <div className="flex gap-1">
              <button
                onClick={() => setIsLiked(!isLiked)}
                className={`p-1 rounded-full ${
                  isLiked ? "bg-red-500 text-white" : "bg-gray-100 text-gray-600"
                }`}
              >
                <Heart size={14} fill={isLiked ? "currentColor" : "none"} />
              </button>
              <button className="p-1 bg-gray-100 rounded-full text-gray-600">
                <Share2 size={14} />
              </button>
            </div>
          </div>

          {/* Expertise */}
          <div className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium flex items-center gap-1 w-max">
            <Star size={12} className="text-yellow-400" /> {trainer.expertise}
          </div>

          {/* Phone */}
          <div className="text-sm bg-gray-50 p-2 rounded-md flex items-center gap-2">
            <Phone size={14} className="text-gray-500" />
            <span>{trainer.phone || "No phone"}</span>
          </div>

          {/* Rate */}
          <div className="text-sm bg-gray-50 p-2 rounded-md flex items-center justify-between">
            <span>Rate:</span>
            <span className="font-bold text-green-600">{trainer.ratePerHour} LKR/hr</span>
          </div>

          {/* Availability */}
          <AvailabilityDropdown availability={trainer.availability} formatTime12={formatTime12} />

          {/* Latest Review + View All */}
          <div className="mt-2">
            <div className="flex items-center justify-between mb-1 text-xs text-gray-600">
              <span className="font-medium">Reviews:</span>
              {trainer.reviews && trainer.reviews.length > 0 && (
                <button
                  className="text-blue-600 hover:text-blue-700 hover:underline font-medium"
                  onClick={() => setShowReviewsModal(true)}
                >
                  View All ({trainer.reviews.length})
                </button>
              )}
            </div>

            {latestReview ? (
              <div
                className="border border-gray-200 rounded-md p-2 bg-gray-50 text-xs text-gray-700 cursor-pointer hover:bg-gray-100"
                onClick={() => setShowReviewsModal(true)}
              >
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(latestReview.rating || 0)].map((_, i) => (
                    <Star key={i} size={12} className="text-yellow-500" fill="currentColor" />
                  ))}
                </div>
                <p className="truncate">{latestReview.comment}</p>
              </div>
            ) : (
              <div className="text-xs text-gray-400 p-2 bg-gray-50 rounded-md border border-dashed border-gray-200 text-center">
                No reviews yet
              </div>
            )}
          </div>

          {/* Book Button */}
          <button
            onClick={() => onOpenBooking(trainer)}
            className="mt-2 w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-2 rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-indigo-700 transition-all duration-300"
          >
            Book Trainer
          </button>
        </div>
      </div>

      {/* Reviews Modal */}
      <ReviewsModal
        trainer={trainer}
        currentUserId={currentUserId}
        isOpen={showReviewsModal}
        onClose={() => setShowReviewsModal(false)}
        onOpenReview={onOpenReview}
        onDeleteReview={onDeleteReview}
      />
    </>
  );
};

export default TrainerCard;
