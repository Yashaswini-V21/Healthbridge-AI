import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Phone, User, FileText, Check, AlertCircle, Building2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/common/Button';
import Toast from '../components/common/Toast';

const Appointments = () => {
  const [step, setStep] = useState(1);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospital, setSelectedHospital] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [patientInfo, setPatientInfo] = useState({
    name: '',
    phone: '',
    email: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // Pre-fill user info if available
    if (user) {
      setPatientInfo({
        ...patientInfo,
        name: user.name || '',
        email: user.email || ''
      });
    }
  }, [user]);

  useEffect(() => {
    // Load nearby hospitals when component mounts
    loadHospitals();
  }, []);

  const loadHospitals = async () => {
    setLoading(true);
    try {
      const response = await api.get('/hospitals/search', { params: { limit: 10 } });
      // Filter to show only major hospitals (exclude skincare and small clinics)
      const filteredHospitals = (response.data.hospitals || []).filter(hospital => {
        const name = hospital.name.toLowerCase();
        // Exclude skincare, beauty, cosmetic, dental (small) clinics
        return !name.includes('skincare') && 
               !name.includes('beauty') && 
               !name.includes('cosmetic') &&
               !name.includes('salon');
      });
      setHospitals(filteredHospitals);
    } catch (error) {
      console.error('Error loading hospitals:', error);
      // Fallback hospitals
      setHospitals([
        { id: 1, name: 'City General Hospital', address: '123 Main St', phone: '+91-080-12345678', specialties: ['General', 'Emergency', 'Cardiology'] },
        { id: 2, name: 'Apollo Multispecialty', address: '456 Park Ave', phone: '+91-080-87654321', specialties: ['Neurology', 'Orthopedics', 'Pediatrics'] }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const specialties = [
    'General Physician',
    'Cardiology',
    'Neurology',
    'Orthopedics',
    'Pediatrics',
    'Dermatology',
    'ENT',
    'Gynecology',
    'Ophthalmology',
    'Dentistry'
  ];

  // Generate available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '12:00 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM',
    '04:30 PM', '05:00 PM'
  ];

  // Get min date (tomorrow)
  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  // Get max date (30 days from now)
  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 30);
    return maxDate.toISOString().split('T')[0];
  };

  const handleNext = () => {
    if (step === 1 && !selectedHospital) {
      setToast({ type: 'error', message: 'Please select a hospital' });
      return;
    }
    if (step === 2 && (!selectedDate || !selectedTime || !selectedSpecialty)) {
      setToast({ type: 'error', message: 'Please select date, time, and specialty' });
      return;
    }
    if (step === 3 && (!patientInfo.name || !patientInfo.phone)) {
      setToast({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }
    setStep(step + 1);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Call the real backend API
      const appointmentData = {
        hospital_id: selectedHospital.id,
        hospital_name: selectedHospital.name,
        date: selectedDate,
        time: selectedTime,
        specialty: selectedSpecialty,
        patient_name: patientInfo.name,
        patient_phone: patientInfo.phone,
        patient_email: patientInfo.email,
        reason: patientInfo.reason
      };

      const response = await api.post('/appointments/book', appointmentData);
      
      if (response.data.success) {
        setToast({ type: 'success', message: '🎉 Appointment booked successfully!' });
        
        // Move to success step
        setTimeout(() => {
          setStep(5);
        }, 1500);
      }
    } catch (error) {
      console.error('Booking error:', error);
      setToast({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to book appointment. Please try again.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <Calendar className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                Book Appointment
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Schedule your hospital visit in 3 easy steps
              </p>
            </div>
          </div>
        </motion.div>

        {/* Progress Bar */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {[1, 2, 3, 4].map((s) => (
              <div key={s} className="flex items-center flex-1">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                  s <= step 
                    ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg scale-110' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                }`}>
                  {s < step ? <Check className="w-5 h-5" /> : s}
                </div>
                {s < 4 && (
                  <div className={`flex-1 h-1 mx-2 transition-all ${
                    s < step ? 'bg-gradient-to-r from-purple-500 to-pink-600' : 'bg-gray-300 dark:bg-gray-700'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between max-w-2xl mx-auto mt-2 text-xs text-gray-600 dark:text-gray-400 px-2">
            <span>Hospital</span>
            <span>Date & Time</span>
            <span>Details</span>
            <span>Confirm</span>
          </div>
        </motion.div>

        {/* Step Content */}
        <motion.div 
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-8"
        >
          {/* Step 1: Select Hospital */}
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-purple-600" />
                Select Hospital
              </h2>
              
              <div className="grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2">
                {hospitals.map((hospital) => (
                  <motion.div
                    key={hospital.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedHospital(hospital)}
                    className={`p-5 rounded-xl cursor-pointer transition-all ${
                      selectedHospital?.id === hospital.id
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-xl'
                        : 'bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                        selectedHospital?.id === hospital.id ? 'bg-white/20' : 'bg-purple-100 dark:bg-purple-900'
                      }`}>
                        <Building2 className={`w-6 h-6 ${
                          selectedHospital?.id === hospital.id ? 'text-white' : 'text-purple-600 dark:text-purple-400'
                        }`} />
                      </div>
                      <div className="flex-1">
                        <h3 className={`font-bold mb-1 ${
                          selectedHospital?.id === hospital.id ? 'text-white' : 'text-gray-900 dark:text-white'
                        }`}>
                          {hospital.name}
                        </h3>
                        <p className={`text-sm mb-2 flex items-start gap-1 ${
                          selectedHospital?.id === hospital.id ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          {hospital.address}
                        </p>
                        <p className={`text-sm flex items-center gap-1 ${
                          selectedHospital?.id === hospital.id ? 'text-white/80' : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          <Phone className="w-4 h-4" />
                          {hospital.phone}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Select Date, Time & Specialty */}
          {step === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-purple-600" />
                Select Date, Time & Specialty
              </h2>

              <div className="space-y-6">
                {/* Specialty Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Medical Specialty
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {specialties.map((specialty) => (
                      <motion.button
                        key={specialty}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSpecialty(specialty)}
                        className={`px-4 py-3 rounded-xl font-medium transition-all ${
                          selectedSpecialty === specialty
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {specialty}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    min={getMinDate()}
                    max={getMaxDate()}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/50 focus:border-purple-500"
                  />
                </div>

                {/* Time Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Preferred Time
                  </label>
                  <div className="grid grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {timeSlots.map((time) => (
                      <motion.button
                        key={time}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedTime(time)}
                        className={`px-3 py-2 rounded-lg font-medium text-sm transition-all ${
                          selectedTime === time
                            ? 'bg-gradient-to-br from-purple-500 to-pink-600 text-white shadow-lg'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {time}
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Patient Details */}
          {step === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-purple-600" />
                Patient Details
              </h2>

              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Full Name *"
                  value={patientInfo.name}
                  onChange={(e) => setPatientInfo({ ...patientInfo, name: e.target.value })}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/50"
                />
                <input
                  type="tel"
                  placeholder="Phone Number *"
                  value={patientInfo.phone}
                  onChange={(e) => setPatientInfo({ ...patientInfo, phone: e.target.value })}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/50"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={patientInfo.email}
                  onChange={(e) => setPatientInfo({ ...patientInfo, email: e.target.value })}
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/50 md:col-span-2"
                />
                <textarea
                  placeholder="Reason for Visit / Symptoms"
                  value={patientInfo.reason}
                  onChange={(e) => setPatientInfo({ ...patientInfo, reason: e.target.value })}
                  rows="4"
                  className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-purple-500/50 md:col-span-2 resize-none"
                />
              </div>
            </div>
          )}

          {/* Step 4: Review & Confirm */}
          {step === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-purple-600" />
                Review & Confirm
              </h2>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-purple-600" />
                    Hospital Details
                  </h3>
                  <p className="text-lg font-semibold text-gray-900 dark:text-white">{selectedHospital?.name}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{selectedHospital?.address}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{selectedHospital?.phone}</p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-purple-600" />
                    Appointment Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Specialty</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedSpecialty}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Date</p>
                      <p className="font-semibold text-gray-900 dark:text-white">
                        {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Time</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{selectedTime}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-5">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                    <User className="w-5 h-5 text-purple-600" />
                    Patient Information
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Name</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{patientInfo.name}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Phone</p>
                      <p className="font-semibold text-gray-900 dark:text-white">{patientInfo.phone}</p>
                    </div>
                    {patientInfo.email && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Email</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{patientInfo.email}</p>
                      </div>
                    )}
                    {patientInfo.reason && (
                      <div className="col-span-2">
                        <p className="text-xs text-gray-600 dark:text-gray-400">Reason</p>
                        <p className="font-semibold text-gray-900 dark:text-white">{patientInfo.reason}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Success */}
          {step === 5 && (
            <div className="text-center py-12">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="w-24 h-24 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl"
              >
                <Check className="w-12 h-12 text-white" />
              </motion.div>
              <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                Appointment Confirmed! 🎉
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                Your appointment has been successfully booked.<br />
                You'll receive a confirmation SMS shortly.
              </p>
              
              <div className="flex gap-4 justify-center">
                <Button variant="primary" onClick={() => navigate('/dashboard')}>
                  Go to Dashboard
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Book Another
                </Button>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          {step < 5 && (
            <div className="flex gap-4 mt-8">
              {step > 1 && (
                <Button
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                  className="flex-1"
                >
                  Back
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  variant="primary"
                  onClick={handleNext}
                  className="flex-1"
                >
                  Next
                </Button>
              ) : (
                <Button
                  variant="primary"
                  onClick={handleSubmit}
                  loading={loading}
                  className="flex-1"
                >
                  {loading ? 'Confirming...' : 'Confirm Appointment'}
                </Button>
              )}
            </div>
          )}
        </motion.div>

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
};

export default Appointments;
