import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Map } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';
import api from '../services/api';
import Button from '../components/common/Button';
import LoadingSpinner from '../components/common/LoadingSpinner';
import MapView from '../components/features/MapView';
import HospitalCard from '../components/features/HospitalCard';
import SearchHistory from '../components/features/SearchHistory';
import { storageService } from '../services/storage';
import toast from 'react-hot-toast';

const Hospitals = () => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'map'
  const { location } = useGeolocation();

  const searchHospitals = async () => {
    if (!location) {
      toast.error('Please enable location access');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/hospitals/search', {
        location: {
          lat: location.latitude,
          lng: location.longitude
        },
        specialties: specialty ? [specialty] : [],
        urgency: 'MEDIUM',
        filters: {
          max_distance: 20
        }
      });
      setHospitals(response.data.hospitals || []);
      
      // Save to search history
      if (searchQuery || specialty) {
        storageService.addToSearchHistory({
          query: searchQuery,
          specialty,
          type: 'hospital',
          timestamp: new Date().toISOString(),
        });
      }
    } catch (error) {
      // Use mock data as fallback when API is down
      const mockHospitals = [
        {
          id: 1,
          name: 'City General Hospital',
          specialties: ['Cardiology', 'Emergency', 'Pediatrics'],
          address: '123 Main Street',
          distance: 2.5,
          rating: 4.5,
          available: true,
          phone: '+91 80 1234 5678'
        },
        {
          id: 2,
          name: 'Apollo Multispecialty',
          specialties: ['Neurology', 'Orthopedics', 'Emergency'],
          address: '456 Health Avenue',
          distance: 3.8,
          rating: 4.7,
          available: true,
          phone: '+91 80 2345 6789'
        }
      ];
      setHospitals(mockHospitals);
      toast('Using sample hospitals (Backend offline)', { icon: 'ℹ️' });
    } finally {
      setLoading(false);
    }
  };

  const handleFavoriteToggle = (hospital) => {
    const favorites = storageService.getFavorites();
    const isFav = favorites.some(fav => fav.id === hospital.id);
    
    if (isFav) {
      storageService.removeFavorite(hospital.id);
      toast.success('Removed from favorites');
    } else {
      storageService.addFavorite(hospital);
      toast.success('Added to favorites');
    }
  };

  const isFavorite = (hospitalId) => {
    const favorites = storageService.getFavorites();
    return favorites.some(fav => fav.id === hospitalId);
  };

  useEffect(() => {
    if (location) {
      searchHospitals();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
            Find Hospitals Near You
          </h1>
          <p className="text-lg text-gray-600">
            Discover the best healthcare facilities based on your location
          </p>
        </div>

        {/* Search Filters */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-6 shadow-xl mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 grid md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Search hospitals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
              />
              <select
                value={specialty}
                onChange={(e) => setSpecialty(e.target.value)}
                className="px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition"
              >
                <option value="">All Specialties</option>
                <option value="Emergency Medicine">Emergency Medicine</option>
                <option value="Cardiology">Cardiology</option>
                <option value="Neurology">Neurology</option>
                <option value="Orthopedics">Orthopedics</option>
                <option value="Pediatrics">Pediatrics</option>
                <option value="General Surgery">General Surgery</option>
              </select>
              <Button variant="primary" onClick={searchHospitals} icon={Search}>
                Search
              </Button>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
                icon={Map}
              >
                {viewMode === 'list' ? 'Map' : 'List'}
              </Button>
              <SearchHistory onSelectHistory={(item) => {
                if (item.query) setSearchQuery(item.query);
                if (item.specialty) setSpecialty(item.specialty);
              }} />
            </div>
          </div>
        </motion.div>

        {/* Results Count */}
        {!loading && hospitals.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-6 text-center"
          >
            <p className="text-gray-600">
              Found <span className="font-bold text-primary-600">{hospitals.length}</span> hospitals
              {specialty && <span> specializing in <span className="font-semibold">{specialty}</span></span>}
            </p>
          </motion.div>
        )}

        {/* Results */}
        {loading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner text="Finding nearby hospitals..." />
          </div>
        ) : viewMode === 'map' ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl overflow-hidden shadow-xl"
          >
            <MapView
              hospitals={hospitals.filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()))}
              userLocation={location ? { lat: location.latitude, lng: location.longitude } : null}
            />
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {hospitals
              .filter(h => h.name.toLowerCase().includes(searchQuery.toLowerCase()))
              .map((hospital, idx) => (
                <motion.div
                  key={hospital.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                >
                  <HospitalCard
                    hospital={hospital}
                    isFavorite={isFavorite(hospital.id)}
                    onFavorite={handleFavoriteToggle}
                  />
                </motion.div>
              ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && hospitals.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-20"
          >
            <div className="bg-white rounded-2xl p-12 shadow-lg max-w-md mx-auto">
              <div className="text-6xl mb-4">🏥</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Hospitals Found</h3>
              <p className="text-gray-600 mb-6">
                Try adjusting your search filters or enable location access
              </p>
              <Button variant="primary" onClick={searchHospitals}>
                Retry Search
              </Button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default Hospitals;
