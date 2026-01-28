import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Phone, Star, Navigation, Filter, X, Building2, Heart, Award } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';

const Specialists = () => {
  const [specialists, setSpecialists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [userLocation, setUserLocation] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    emergency: false,
    availability: 'all',
    rating: 0
  });

  const specialtyOptions = [
    { value: '', label: 'All Specialties', icon: '🏥' },
    { value: 'Cardiology', label: 'Cardiology', icon: '❤️' },
    { value: 'Neurology', label: 'Neurology', icon: '🧠' },
    { value: 'Orthopedics', label: 'Orthopedics', icon: '🦴' },
    { value: 'Pediatrics', label: 'Pediatrics', icon: '👶' },
    { value: 'Dermatology', label: 'Dermatology', icon: '✨' },
    { value: 'ENT', label: 'ENT', icon: '👂' },
    { value: 'Gynecology', label: 'Gynecology', icon: '🤱' },
    { value: 'Ophthalmology', label: 'Ophthalmology', icon: '👁️' },
    { value: 'Dentistry', label: 'Dentistry', icon: '🦷' },
    { value: 'General Physician', label: 'General Physician', icon: '👨‍⚕️' }
  ];

  useEffect(() => {
    getUserLocation();
    fetchSpecialists();
  }, []);

  useEffect(() => {
    fetchSpecialists();
  }, [selectedSpecialty, filters]);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
          toast.success('Location detected!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location');
        }
      );
    }
  };

  const fetchSpecialists = async () => {
    setLoading(true);
    try {
      const params = {
        specialties: selectedSpecialty ? [selectedSpecialty] : [],
        location: userLocation,
        ...filters
      };

      const response = await api.post('/hospitals/search', params);
      
      // Transform hospitals to specialists format
      const hospitalsData = response.data.hospitals || [];
      const specialistsData = [];
      
      hospitalsData.forEach(hospital => {
        // For each specialty, create a specialist entry
        const specialties = hospital.specialties || [];
        specialties.forEach(specialty => {
          if (!selectedSpecialty || specialty === selectedSpecialty) {
            specialistsData.push({
              id: `${hospital.id}_${specialty}`,
              name: specialty,
              hospital: hospital.name,
              hospital_id: hospital.id,
              address: hospital.address,
              phone: hospital.phone,
              rating: hospital.rating || 4.5,
              distance: hospital.distance,
              emergency: hospital.emergency_available,
              specialty: specialty,
              location: hospital.location
            });
          }
        });
      });

      setSpecialists(specialistsData);
    } catch (error) {
      console.error('Error fetching specialists:', error);
      toast.error('Failed to load specialists');
    } finally {
      setLoading(false);
    }
  };

  const filteredSpecialists = specialists.filter(spec => {
    if (searchQuery && !spec.hospital.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !spec.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (filters.emergency && !spec.emergency) {
      return false;
    }
    if (filters.rating > 0 && spec.rating < filters.rating) {
      return false;
    }
    return true;
  });

  const handleBookAppointment = (specialist) => {
    // Store selected specialist in localStorage for the appointments page
    localStorage.setItem('selectedSpecialist', JSON.stringify(specialist));
    toast.success('Redirecting to booking...');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Find Specialists Near You
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Connect with expert doctors and book appointments instantly
          </p>
        </motion.div>

        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          {/* Search Bar */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by hospital or specialty..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none transition-all"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`px-6 py-3 rounded-xl border-2 transition-all flex items-center gap-2 ${
                showFilters
                  ? 'bg-purple-600 border-purple-600 text-white'
                  : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-600 dark:hover:border-purple-400'
              }`}
            >
              <Filter className="w-5 h-5" />
              Filters
            </button>
            <button
              onClick={getUserLocation}
              className="px-6 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-600 dark:hover:border-purple-400 transition-all flex items-center gap-2"
            >
              <Navigation className="w-5 h-5" />
              Near Me
            </button>
          </div>

          {/* Specialty Filter */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {specialtyOptions.slice(0, 6).map((option) => (
              <button
                key={option.value}
                onClick={() => setSelectedSpecialty(option.value)}
                className={`p-3 rounded-xl border-2 transition-all text-center ${
                  selectedSpecialty === option.value
                    ? 'bg-purple-600 border-purple-600 text-white'
                    : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-purple-600 dark:hover:border-purple-400'
                }`}
              >
                <div className="text-2xl mb-1">{option.icon}</div>
                <div className="text-xs font-semibold">{option.label}</div>
              </button>
            ))}
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border-2 border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">Advanced Filters</h3>
                <button
                  onClick={() => setShowFilters(false)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                </button>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {/* Emergency Available */}
                <div>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.emergency}
                      onChange={(e) => setFilters({ ...filters, emergency: e.target.checked })}
                      className="w-5 h-5 rounded border-slate-300 text-purple-600 focus:ring-purple-500"
                    />
                    <span className="text-slate-700 dark:text-slate-300 font-medium">Emergency Available</span>
                  </label>
                </div>

                {/* Minimum Rating */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) => setFilters({ ...filters, rating: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none"
                  >
                    <option value={0}>Any Rating</option>
                    <option value={3}>3+ Stars</option>
                    <option value={4}>4+ Stars</option>
                    <option value={4.5}>4.5+ Stars</option>
                  </select>
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-purple-600 dark:focus:border-purple-400 focus:outline-none"
                  >
                    <option value="all">All Hours</option>
                    <option value="24x7">24/7 Available</option>
                    <option value="today">Available Today</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400">
            Found <span className="font-bold text-purple-600">{filteredSpecialists.length}</span> specialists
            {selectedSpecialty && <span> in <span className="font-semibold">{selectedSpecialty}</span></span>}
          </p>
          {selectedSpecialty && (
            <button
              onClick={() => setSelectedSpecialty('')}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Clear Filter
            </button>
          )}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner />
          </div>
        )}

        {/* Specialists Grid */}
        {!loading && filteredSpecialists.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Building2 className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No specialists found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your filters or search query
            </p>
            <Button onClick={() => { setSearchQuery(''); setSelectedSpecialty(''); setFilters({ emergency: false, availability: 'all', rating: 0 }); }}>
              Clear All Filters
            </Button>
          </motion.div>
        )}

        {!loading && filteredSpecialists.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSpecialists.map((specialist, index) => (
              <motion.div
                key={specialist.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border-2 border-slate-200 dark:border-slate-700 hover:border-purple-600 dark:hover:border-purple-400 hover:shadow-xl transition-all"
              >
                {/* Specialty Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-sm font-semibold">
                    {specialist.name}
                  </span>
                  {specialist.emergency && (
                    <span className="px-2 py-1 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full text-xs font-semibold">
                      24/7
                    </span>
                  )}
                </div>

                {/* Hospital Name */}
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {specialist.hospital}
                </h3>

                {/* Rating */}
                <div className="flex items-center gap-2 mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(specialist.rating)
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                    {specialist.rating}
                  </span>
                </div>

                {/* Address */}
                <div className="flex items-start gap-2 mb-3 text-sm text-slate-600 dark:text-slate-400">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0 text-purple-600" />
                  <span>{specialist.address}</span>
                </div>

                {/* Distance */}
                {specialist.distance && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-slate-600 dark:text-slate-400">
                    <Navigation className="w-4 h-4 text-purple-600" />
                    <span>{specialist.distance.toFixed(1)} km away</span>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-3">
                  <Link to="/appointments" className="flex-1">
                    <button
                      onClick={() => handleBookAppointment(specialist)}
                      className="w-full px-4 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all"
                    >
                      Book Now
                    </button>
                  </Link>
                  <a
                    href={`tel:${specialist.phone}`}
                    className="px-4 py-3 border-2 border-slate-200 dark:border-slate-700 rounded-xl hover:border-purple-600 dark:hover:border-purple-400 transition-all"
                  >
                    <Phone className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </a>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Specialists;
