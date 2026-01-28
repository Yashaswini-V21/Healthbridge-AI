import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone, Navigation, Siren, Clock, MapPin, Heart } from 'lucide-react';
import { useGeolocation } from '../../hooks/useGeolocation';
import api from '../../services/api';
import Button from '../common/Button';
import { EMERGENCY_NUMBERS } from '../../utils/constants';
import { formatDistance } from '../../utils/helpers';

const EmergencyMode = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [emergencyActive, setEmergencyActive] = useState(false);
  const { location, error } = useGeolocation();

  useEffect(() => {
    if (location) {
      fetchEmergencyHospitals();
    }
    // Activate emergency mode animation
    setEmergencyActive(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  const fetchEmergencyHospitals = async () => {
    try {
      const response = await api.post('/hospitals/emergency', {
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setHospitals(response.data.hospitals || []);
    } catch (error) {
      console.error('Failed to fetch emergency hospitals');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-red-950 dark:bg-red-950/95 backdrop-blur-sm z-50 overflow-y-auto">
      {/* Pulsing Red Border Effect */}
      <motion.div
        animate={{ opacity: [0.3, 0.8, 0.3] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="fixed inset-0 border-8 border-red-600 pointer-events-none"
      />
      <div className="container mx-auto px-4 py-8 relative z-10">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-4xl mx-auto"
        >
          {/* Emergency Header */}
          <div className="bg-gradient-to-br from-red-600 to-red-700 rounded-2xl p-8 mb-6 text-white shadow-2xl border-4 border-red-500">
            <div className="flex items-center gap-4 mb-4">
              <motion.div
                animate={{ 
                  scale: [1, 1.15, 1],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="relative"
              >
                <Siren className="w-20 h-20" />
                <motion.div
                  animate={{ scale: [1, 1.5, 1], opacity: [0.8, 0, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.2 }}
                  className="absolute inset-0 bg-red-400 rounded-full blur-xl"
                />
              </motion.div>
              <div>
                <motion.h1 
                  animate={{ opacity: [1, 0.7, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-5xl font-black mb-2 tracking-tight"
                >
                  🚨 EMERGENCY MODE
                </motion.h1>
                <p className="text-red-100 text-xl font-semibold">
                  Immediate medical attention required
                </p>
              </div>
            </div>
            
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-5 border-2 border-white/30">
              <p className="text-white font-bold mb-3 flex items-center gap-2 text-lg">
                <Heart className="w-5 h-5" />
                Call emergency services immediately if:
              </p>
              <ul className="text-white text-sm space-y-2 ml-7">
                <li>• Severe chest pain or difficulty breathing</li>
                <li>• Unconsciousness or unresponsiveness</li>
                <li>• Severe bleeding or major trauma</li>
                <li>• Signs of stroke (FAST: Face, Arms, Speech, Time)</li>
                <li>• Suspected heart attack symptoms</li>
              </ul>
            </div>
          </div>

          {/* Emergency Hotlines */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-2xl border-4 border-red-400">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3 text-gray-900 dark:text-white">
              <Phone className="w-7 h-7 text-red-600" />
              Emergency Hotlines - Call Now
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(EMERGENCY_NUMBERS.INDIA).map(([service, number]) => (
                <motion.a
                  key={service}
                  href={`tel:${number}`}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex items-center justify-between p-5 bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/30 dark:to-red-800/30 rounded-xl hover:from-red-100 hover:to-red-200 dark:hover:from-red-800/40 dark:hover:to-red-700/40 transition border-3 border-red-300 dark:border-red-700 hover:border-red-500 dark:hover:border-red-500 shadow-lg hover:shadow-xl"
                >
                  <span className="font-bold text-red-900 dark:text-red-100 text-lg">{service}</span>
                  <div className="flex items-center gap-2">
                    <Phone className="w-6 h-6 text-red-600 dark:text-red-400" />
                    <span className="text-3xl font-black text-red-600 dark:text-red-400">{number}</span>
                  </div>
                </motion.a>
              ))}
            </div>
          </div>

          {/* Nearest Emergency Hospitals */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-2xl border-4 border-red-400">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 text-gray-900 dark:text-white">
              <MapPin className="w-7 h-7 text-red-600 animate-bounce" />
              Nearest Emergency Hospitals (24/7)
            </h2>
            
            {loading ? (
              <div className="text-center py-12">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="w-16 h-16 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"
                />
                <p className="text-gray-900 dark:text-gray-100 font-semibold text-lg">Locating emergency hospitals...</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">Finding nearest 24/7 facilities</p>
              </div>
            ) : error ? (
              <div className="text-center py-12 bg-red-50 dark:bg-red-900/20 rounded-xl border-2 border-red-300 dark:border-red-700">
                <AlertTriangle className="w-16 h-16 text-red-600 mx-auto mb-4" />
                <p className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-2">Location Access Required</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Please enable location services</p>
                <p className="text-gray-700 dark:text-gray-300 text-sm">Or call emergency services directly</p>
              </div>
            ) : hospitals.length === 0 ? (
              <div className="text-center py-12 bg-yellow-50 dark:bg-yellow-900/20 rounded-xl border-2 border-yellow-300 dark:border-yellow-700">
                <p className="text-gray-900 dark:text-gray-100 font-bold text-lg mb-2">No hospitals found nearby</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm">Please call emergency services: 108</p>
              </div>
            ) : (
              <div className="space-y-5">
                {hospitals.slice(0, 3).map((hospital, idx) => (
                  <motion.div
                    key={hospital.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.15 }}
                    className="border-4 border-red-300 dark:border-red-700 rounded-xl p-6 hover:border-red-500 dark:hover:border-red-500 transition-all bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 hover:shadow-2xl transform hover:-translate-y-1"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          {idx === 0 && (
                            <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-full animate-pulse">
                              CLOSEST
                            </span>
                          )}
                          <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            24/7
                          </span>
                        </div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-1">{hospital.name}</h3>
                        <p className="text-gray-700 dark:text-gray-300 text-sm flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-1 flex-shrink-0" />
                          {hospital.address}
                        </p>
                      </div>
                      {hospital.distance && (
                        <motion.span 
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="px-4 py-2 bg-red-600 text-white rounded-xl text-sm font-black shadow-lg ml-4"
                        >
                          {formatDistance(hospital.distance)}
                        </motion.span>
                      )}
                    </div>
                    
                    <div className="flex gap-3 mt-4">
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
          </div>

          {/* Close Button */}
          <div className="mt-8 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-2 px-10 py-4 bg-white dark:bg-gray-800 text-red-600 dark:text-red-400 rounded-xl font-black text-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-all shadow-xl hover:shadow-2xl border-4 border-red-400 hover:border-red-500"
            >
              Exit Emergency Mode
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default EmergencyMode;
