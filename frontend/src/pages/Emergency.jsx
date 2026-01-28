import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Phone, MapPin, AlertTriangle, Navigation, Clock, Heart, Siren } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import api from '../services/api';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import EmergencySOS from '../components/features/EmergencySOS';
import { EMERGENCY_NUMBERS } from '../utils/constants';
import { formatDistance } from '../utils/helpers';

const Emergency = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { location } = useGeolocation();

  useEffect(() => {
    if (location) {
      fetchEmergencyHospitals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchEmergencyHospitals = async () => {
    try {
      const response = await api.post('/hospitals/emergency', {
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setHospitals(response.data.hospitals);
    } catch (error) {
      console.error('Failed to fetch emergency hospitals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-5xl mx-auto"
        >
          {/* Emergency Header */}
          <motion.div 
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            className="bg-gradient-to-br from-red-600 to-red-700 dark:from-red-700 dark:to-red-800 rounded-3xl p-8 mb-8 shadow-2xl border-4 border-red-500"
          >
            <div className="flex items-center gap-6 mb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="relative"
              >
                <Siren className="w-20 h-20 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute inset-0 bg-red-300 rounded-full blur-xl"
                />
              </motion.div>
              <div className="flex-1">
                <motion.h1 
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-5xl font-black text-white mb-2"
                >
                  🚨 Emergency Mode
                </motion.h1>
                <p className="text-red-100 text-xl font-semibold">Get immediate medical help</p>
              </div>
            </div>
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-5 border-2 border-white/30">
              <p className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5" />
                Call emergency services immediately if experiencing:
              </p>
              <ul className="text-white text-sm space-y-2 ml-7 grid md:grid-cols-2 gap-2">
                <li>• Severe chest pain</li>
                <li>• Difficulty breathing</li>
                <li>• Unconsciousness</li>
                <li>• Severe bleeding</li>
                <li>• Stroke symptoms (FAST)</li>
                <li>• Major trauma/injury</li>
              </ul>
            </div>
          </motion.div>

          {/* Emergency SOS Component */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-8"
          >
            <EmergencySOS />
          </motion.div>

          {/* Emergency Numbers */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card mb-8 border-4 border-red-300 dark:border-red-700 bg-white dark:bg-gray-800"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
              <Phone className="w-8 h-8 text-red-600 dark:text-red-400" />
              Emergency Hotlines - Call Now
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(EMERGENCY_NUMBERS.INDIA).map(([key, number]) => (
                <motion.a
                  key={key}
                  href={`tel:${number}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-between p-6 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/40 dark:hover:to-red-700/40 transition-all border-3 border-red-300 dark:border-red-700 hover:border-red-500 dark:hover:border-red-500 shadow-lg hover:shadow-xl"
                >
                  <span className="font-bold text-red-900 dark:text-red-100 text-lg">{key}</span>
                  <div className="flex items-center gap-2">
                    <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <span className="text-3xl font-black text-red-600 dark:text-red-400">{number}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Nearest Emergency Hospitals */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="card border-4 border-red-300 dark:border-red-700 bg-white dark:bg-gray-800"
          >
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
              <MapPin className="w-8 h-8 text-red-600 dark:text-red-400 animate-bounce" />
              Nearest 24/7 Emergency Hospitals
            </h2>
            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">Finding emergency hospitals...</p>
              </div>
            ) : (
              <div className="space-y-6">
                {hospitals.map((hospital, idx) => (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="border-4 border-red-300 dark:border-red-700 rounded-2xl p-6 hover:border-red-500 dark:hover:border-red-500 transition-all bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          {idx === 0 && (
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                              CLOSEST
                            </span>
                          )}
                          <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            24/7 Emergency
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">{hospital.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300 flex items-start gap-2 mb-2">
                          <MapPin className="w-4 h-4 mt-1 flex-shrink-0 text-red-600" />
                          {hospital.address}
                        </p>
                      </div>
                      {hospital.distance && (
                        <motion.span 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl text-base font-black shadow-lg ml-4"
                        >
                          {formatDistance(hospital.distance)}
                        </motion.span>
                      )}
                    </div>
                    <div className="flex gap-3">
                      <Button
                        variant="emergency"
                        as="a"
                        href={`tel:${hospital.phone}`}
                        icon={Phone}
                        fullWidth
                        className="text-lg font-bold py-4"
                      >
                        Call: {hospital.phone}
                      </Button>
                      <Button
                        variant="primary"
                        as="a"
                        href={`https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`}
                        target="_blank"
                        icon={Navigation}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 whitespace-nowrap"
                      >
                        Navigate
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Emergency;
