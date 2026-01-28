import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Star, Phone, Navigation, Sparkles, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const Skincare = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState('');

  // Skincare services
  const services = [
    { icon: '✨', name: 'Dermatology', specialists: 45 },
    { icon: '💆', name: 'Skin Care', specialists: 38 },
    { icon: '💉', name: 'Cosmetic Surgery', specialists: 22 },
    { icon: '🧴', name: 'Hair Treatment', specialists: 30 },
    { icon: '💅', name: 'Nail Care', specialists: 25 },
    { icon: '🧖', name: 'Spa & Wellness', specialists: 40 }
  ];

  // Mock skincare clinics data
  const clinics = [
    {
      id: 1,
      name: 'Derma Care Clinic',
      specialties: ['Dermatology', 'Acne Treatment', 'Skin Rejuvenation', 'Anti-Aging', 'Skin Care'],
      address: 'Indiranagar, Bengaluru',
      rating: 4.8,
      experience: '15+ years',
      price: '₹500 - ₹2000',
      distance: 2.3,
      available: true,
      phone: '+91-80-12345678',
      location: { lat: 12.9716, lng: 77.6412 }
    },
    {
      id: 2,
      name: 'Glow Skin & Hair Studio',
      specialties: ['Hair Treatment', 'Hair Fall Treatment', 'Laser Therapy', 'Skin Care'],
      address: 'Koramangala, Bengaluru',
      rating: 4.6,
      experience: '10+ years',
      price: '₹800 - ₹3000',
      distance: 3.5,
      available: true,
      phone: '+91-80-23456789',
      location: { lat: 12.9352, lng: 77.6245 }
    },
    {
      id: 3,
      name: 'Beauty & Beyond Clinic',
      specialties: ['Cosmetic Surgery', 'Botox', 'Fillers', 'Chemical Peel'],
      address: 'Jayanagar, Bengaluru',
      rating: 4.9,
      experience: '20+ years',
      price: '₹1000 - ₹5000',
      distance: 4.1,
      available: false,
      phone: '+91-80-34567890',
      location: { lat: 12.9250, lng: 77.5938 }
    },
    {
      id: 4,
      name: 'Radiance Dermatology Center',
      specialties: ['Dermatology', 'Pigmentation', 'Mole Removal', 'Skin Allergy'],
      address: 'Whitefield, Bengaluru',
      rating: 4.7,
      experience: '12+ years',
      price: '₹600 - ₹2500',
      distance: 5.2,
      available: true,
      phone: '+91-80-45678901',
      location: { lat: 12.9698, lng: 77.7500 }
    },
    {
      id: 5,
      name: 'Nail Art Studio & Spa',
      specialties: ['Nail Care', 'Manicure', 'Pedicure', 'Nail Extensions'],
      address: 'MG Road, Bengaluru',
      rating: 4.5,
      experience: '8+ years',
      price: '₹300 - ₹1500',
      distance: 2.8,
      available: true,
      phone: '+91-80-56789012',
      location: { lat: 12.9752, lng: 77.6063 }
    },
    {
      id: 6,
      name: 'Serenity Spa & Wellness',
      specialties: ['Spa & Wellness', 'Massage Therapy', 'Body Treatments', 'Relaxation'],
      address: 'HSR Layout, Bengaluru',
      rating: 4.9,
      experience: '18+ years',
      price: '₹1200 - ₹4000',
      distance: 3.9,
      available: true,
      phone: '+91-80-67890123',
      location: { lat: 12.9121, lng: 77.6446 }
    },
    {
      id: 7,
      name: 'Elite Cosmetic Surgery Center',
      specialties: ['Cosmetic Surgery', 'Rhinoplasty', 'Liposuction', 'Face Lift'],
      address: 'Malleshwaram, Bengaluru',
      rating: 4.8,
      experience: '25+ years',
      price: '₹5000 - ₹50000',
      distance: 4.5,
      available: true,
      phone: '+91-80-78901234',
      location: { lat: 13.0067, lng: 77.5704 }
    },
    {
      id: 8,
      name: 'Perfect Nails & Beauty',
      specialties: ['Nail Care', 'Gel Nails', 'Nail Art', 'Hand & Feet Care'],
      address: 'Brigade Road, Bengaluru',
      rating: 4.4,
      experience: '6+ years',
      price: '₹250 - ₹1000',
      distance: 3.2,
      available: true,
      phone: '+91-80-89012345',
      location: { lat: 12.9759, lng: 77.6082 }
    },
    {
      id: 9,
      name: 'Hair Excellence Clinic',
      specialties: ['Hair Treatment', 'Hair Transplant', 'PRP Therapy', 'Hair Spa'],
      address: 'Bellandur, Bengaluru',
      rating: 4.7,
      experience: '14+ years',
      price: '₹1500 - ₹8000',
      distance: 5.8,
      available: true,
      phone: '+91-80-90123456',
      location: { lat: 12.9260, lng: 77.6738 }
    },
    {
      id: 10,
      name: 'Bliss Wellness Spa',
      specialties: ['Spa & Wellness', 'Aromatherapy', 'Ayurvedic Treatments', 'Yoga'],
      address: 'Sadashivanagar, Bengaluru',
      rating: 4.8,
      experience: '12+ years',
      price: '₹1000 - ₹3500',
      distance: 4.2,
      available: true,
      phone: '+91-80-01234567',
      location: { lat: 13.0049, lng: 77.5750 }
    }
  ];

  const filteredClinics = clinics.filter(clinic => {
    const matchesSearch = !searchQuery || 
      clinic.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      clinic.specialties.some(s => s.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesService = !selectedService || 
      clinic.specialties.some(s => s.toLowerCase().includes(selectedService.toLowerCase()));
    
    return matchesSearch && matchesService;
  });

  const handleCall = (phone) => {
    window.location.href = `tel:${phone}`;
  };

  const handleNavigate = (location) => {
    if (!location?.lat || !location?.lng) {
      toast.error('Location not available');
      return;
    }
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`,
      '_blank'
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block px-4 py-2 bg-pink-100 dark:bg-pink-900/30 rounded-full mb-4">
            <span className="text-pink-600 dark:text-pink-400 font-semibold text-sm">✨ Premium Skincare Services</span>
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Skincare & Beauty Clinics
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Find expert dermatologists and beauty specialists near you
          </p>
        </motion.div>

        {/* Services Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8"
        >
          {services.map((service, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedService(service.name === selectedService ? '' : service.name)}
              className={`p-4 rounded-2xl transition-all shadow-lg ${
                selectedService === service.name
                  ? 'bg-gradient-to-br from-pink-500 to-purple-600 text-white'
                  : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white hover:shadow-xl'
              }`}
            >
              <div className="text-4xl mb-2">{service.icon}</div>
              <div className="text-sm font-bold">{service.name}</div>
              <div className="text-xs opacity-75">{service.specialists} specialists</div>
            </motion.button>
          ))}
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by clinic name or treatment..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-pink-600 dark:focus:border-pink-400 focus:outline-none transition-all shadow-lg"
            />
          </div>
        </motion.div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-slate-600 dark:text-slate-400">
            Found <span className="font-bold text-pink-600 dark:text-pink-400">{filteredClinics.length}</span> clinics
            {selectedService && <span> for <span className="font-semibold">{selectedService}</span></span>}
          </p>
          {selectedService && (
            <button
              onClick={() => setSelectedService('')}
              className="text-sm text-pink-600 dark:text-pink-400 hover:underline font-medium"
            >
              Clear Filter ✕
            </button>
          )}
        </div>

        {/* Clinics Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
          {filteredClinics.map((clinic, idx) => (
            <motion.div
              key={clinic.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl p-6 shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-1 transition-all"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
                    {clinic.name}
                  </h3>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold text-slate-900 dark:text-white">{clinic.rating}</span>
                    </div>
                    <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-full text-xs font-semibold">
                      {clinic.experience}
                    </span>
                  </div>
                </div>
                {clinic.available ? (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-xs font-bold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Available
                  </span>
                ) : (
                  <span className="px-3 py-1 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-xs font-bold">
                    Closed
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 mb-4">
                <MapPin className="w-4 h-4 text-pink-600" />
                <span className="text-sm">{clinic.address}</span>
                {clinic.distance && (
                  <span className="text-xs font-semibold">• {clinic.distance} km</span>
                )}
              </div>

              {/* Specialties */}
              <div className="mb-4">
                <h4 className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase">Specialties</h4>
                <div className="flex flex-wrap gap-2">
                  {clinic.specialties.map((specialty, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-pink-600 text-white text-xs font-semibold rounded-full"
                    >
                      {specialty}
                    </span>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="mb-4 p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">Consultation Fee</span>
                  <span className="text-lg font-bold text-purple-600 dark:text-purple-400">{clinic.price}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={() => handleCall(clinic.phone)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-xl transition-all shadow-md"
                >
                  <Phone className="w-4 h-4" />
                  Call Now
                </button>
                <button
                  onClick={() => handleNavigate(clinic.location)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-slate-700 border-2 border-pink-600 text-pink-600 dark:text-pink-400 hover:bg-pink-50 dark:hover:bg-pink-900/30 font-semibold rounded-xl transition-all shadow-md"
                >
                  <Navigation className="w-4 h-4" />
                  Navigate
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredClinics.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Sparkles className="w-20 h-20 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">No clinics found</h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              Try adjusting your search or filters
            </p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedService(''); }}
              className="px-6 py-3 bg-pink-600 text-white font-semibold rounded-xl hover:bg-pink-700 transition-all"
            >
              Clear All Filters
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Skincare;
