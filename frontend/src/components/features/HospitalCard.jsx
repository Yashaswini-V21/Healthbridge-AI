import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Navigation, Heart, AlertCircle, Bed, Clock } from 'lucide-react';
import { formatDistance } from '../../utils/helpers';

const HospitalCard = ({ hospital, onFavorite, isFavorite, urgencyLevel }) => {
  const handleCall = () => {
    window.location.href = `tel:${hospital.phone}`;
  };

  const handleDirections = () => {
    const lat = hospital.location?.lat || hospital.latitude;
    const lng = hospital.location?.lng || hospital.longitude;
    
    if (!lat || !lng) {
      alert('Location coordinates not available for this hospital. Please contact the hospital directly.');
      return;
    }
    
    // Google Maps directions URL with current location as origin
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}&travelmode=driving`;
    
    // Open in new tab
    const opened = window.open(mapsUrl, '_blank', 'noopener,noreferrer');
    
    // Fallback if popup blocked
    if (!opened || opened.closed || typeof opened.closed == 'undefined') {
      window.location.href = mapsUrl;
    }
  };

  // Determine border color based on urgency
  const urgencyColors = {
    HIGH: 'border-red-500 shadow-red-200',
    MEDIUM: 'border-yellow-500 shadow-yellow-200',
    LOW: 'border-green-500 shadow-green-200'
  };

  const cardBorder = urgencyLevel ? urgencyColors[urgencyLevel] : 'border-gray-200';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`bg-white dark:bg-gray-800 rounded-2xl p-6 relative overflow-hidden border-2 ${cardBorder} dark:border-purple-800 hover:shadow-2xl dark:hover:shadow-purple-900/50 transition-all duration-300`}
    >
      {/* Gradient Background Accent */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 dark:from-purple-600 dark:via-pink-600 dark:to-blue-600" />

      {/* Emergency Badge */}
      {hospital.emergency_available && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="absolute top-6 right-4 z-10"
        >
          <span className="px-3 py-1.5 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold rounded-full shadow-lg flex items-center gap-1 animate-pulse">
            <AlertCircle className="w-3 h-3" />
            24/7 Emergency
          </span>
        </motion.div>
      )}

      {/* Favorite Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onFavorite && onFavorite(hospital)}
        className="absolute top-6 left-4 z-10 p-2.5 bg-white dark:bg-gray-700 shadow-lg rounded-full hover:bg-red-50 dark:hover:bg-red-900/30 transition"
      >
        <Heart
          className={`w-5 h-5 transition-colors ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400 dark:text-gray-500'}`}
        />
      </motion.button>

      {/* Distance Badge */}
      {hospital.distance && (
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1 }}
          className="absolute top-16 right-4 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/50 dark:to-pink-900/50 text-purple-700 dark:text-purple-300 rounded-full text-sm font-bold shadow-md border border-purple-300 dark:border-purple-700"
        >
          📍 {formatDistance(hospital.distance)}
        </motion.div>
      )}

      {/* Hospital Info */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 pr-20">
          {hospital.name}
        </h3>
        
        {/* Rating & Beds */}
        <div className="flex items-center gap-4 mb-3">
          {hospital.rating && (
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-gray-900 dark:text-white">{hospital.rating}</span>
            </div>
          )}
          <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
            <Bed className="w-4 h-4" />
            <span className="text-sm font-medium">{hospital.beds_total || 100}+ beds</span>
          </div>
          {hospital.available_24_7 && (
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-xs font-bold rounded-full flex items-center gap-1">
              <Clock className="w-3 h-3" />
              24/7
            </span>
          )}
        </div>

        {/* Address */}
        <div className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-500 dark:text-purple-400" />
          <span className="line-clamp-2">{hospital.address}</span>
        </div>

        {/* Specialties */}
        <div className="mb-4">
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wide">SPECIALTIES</h4>
          <div className="flex flex-wrap gap-2">
            {hospital.specialties?.slice(0, 3).map((specialty, idx) => (
              <motion.span
                key={idx}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-full shadow-md transition-colors"
              >
                {specialty}
              </motion.span>
            ))}
            {hospital.specialties?.length > 3 && (
              <span className="px-4 py-1.5 bg-purple-600 text-white text-sm font-semibold rounded-full shadow-md">
                +{hospital.specialties.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Facilities */}
        {hospital.facilities && hospital.facilities.length > 0 && (
          <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="flex items-center gap-2 text-xs text-green-800 dark:text-green-300">
              <span className="font-bold">✓</span>
              <span>{hospital.facilities.slice(0, 3).join(' • ')}</span>
            </div>
          </div>
        )}

        {/* Urgency Indicator */}
        {urgencyLevel && (
          <div className={`mb-4 p-3 rounded-lg border-2 ${
            urgencyLevel === 'HIGH' ? 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300' :
            urgencyLevel === 'MEDIUM' ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800 text-yellow-800 dark:text-yellow-300' :
            'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-800 text-green-800 dark:text-green-300'
          }`}>
            <div className="flex items-center gap-2 text-sm font-bold">
              <AlertCircle className="w-4 h-4" />
              <span>
                {urgencyLevel === 'HIGH' ? 'Urgent Care Available' :
                 urgencyLevel === 'MEDIUM' ? 'Recommended for your condition' :
                 'Good match for your symptoms'}
              </span>
            </div>
          </div>
        )}

        {/* Action Buttons - Updated to match screenshot */}
        <div className="flex gap-3">
          <button
            onClick={handleCall}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md"
          >
            <Phone className="w-4 h-4" />
            Call Now
          </button>
          <button
            onClick={handleDirections}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 border-2 border-purple-600 text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/30 font-semibold rounded-xl transition-all shadow-md"
          >
            <Navigation className="w-4 h-4" />
            Navigate
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default HospitalCard;
