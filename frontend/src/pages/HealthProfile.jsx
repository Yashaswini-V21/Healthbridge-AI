import React, { useState, useEffect, useContext } from 'react';
import { motion } from 'framer-motion';
import { User, Calendar, Activity, FileText, TrendingUp, Heart, AlertCircle, Edit2, Download } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { storageService } from '../services/storage';
import Button from '../components/common/Button';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const HealthProfile = () => {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState({
    age: '',
    gender: '',
    bloodType: '',
    height: '',
    weight: '',
    allergies: [],
    chronicConditions: [],
    medications: []
  });
  const [history, setHistory] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Load profile and history from storage
    const savedProfile = storageService.getHealthProfile();
    const savedHistory = storageService.getSearchHistory();
    
    if (savedProfile) setProfile(savedProfile);
    if (savedHistory) setHistory(savedHistory);
  }, []);

  const saveProfile = () => {
    storageService.setHealthProfile(profile);
    setIsEditing(false);
  };

  // Generate health analytics data
  const generateAnalytics = () => {
    const last7Days = [...Array(7)].map((_, i) => {
      const date = new Date();
      date.setDate(date.setDate() - (6 - i));
      return {
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        symptoms: Math.floor(Math.random() * 5),
        searches: Math.floor(Math.random() * 3)
      };
    });
    return last7Days;
  };

  const analytics = generateAnalytics();

  const calculateBMI = () => {
    if (profile.height && profile.weight) {
      const heightInMeters = profile.height / 100;
      const bmi = (profile.weight / (heightInMeters * heightInMeters)).toFixed(1);
      return bmi;
    }
    return null;
  };

  const getBMICategory = (bmi) => {
    if (!bmi) return { category: 'Unknown', color: 'gray' };
    if (bmi < 18.5) return { category: 'Underweight', color: 'blue' };
    if (bmi < 25) return { category: 'Normal', color: 'green' };
    if (bmi < 30) return { category: 'Overweight', color: 'yellow' };
    return { category: 'Obese', color: 'red' };
  };

  const bmi = calculateBMI();
  const bmiInfo = getBMICategory(bmi);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <Heart className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                Health Profile
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300">
                Track your health journey
              </p>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Profile Card */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6">
              {/* Profile Picture */}
              <div className="text-center mb-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                  {user?.name?.charAt(0) || 'U'}
                </div>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mt-4">{user?.name || 'User'}</h2>
                <p className="text-gray-600 dark:text-gray-400">{user?.email}</p>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-br from-teal-50 to-teal-100 dark:from-teal-900/30 dark:to-teal-800/30 rounded-xl p-4 text-center">
                  <Calendar className="w-6 h-6 text-teal-600 dark:text-teal-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{profile.age || '--'}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Years Old</p>
                </div>
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 rounded-xl p-4 text-center">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{history.length}</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">Records</p>
                </div>
              </div>

              {/* BMI Card */}
              {bmi && (
                <div className={`bg-gradient-to-br from-${bmiInfo.color}-50 to-${bmiInfo.color}-100 dark:from-${bmiInfo.color}-900/30 dark:to-${bmiInfo.color}-800/30 rounded-xl p-4 mb-6`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Body Mass Index</span>
                    <TrendingUp className={`w-5 h-5 text-${bmiInfo.color}-600`} />
                  </div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mb-1">{bmi}</div>
                  <p className={`text-sm font-semibold text-${bmiInfo.color}-600`}>{bmiInfo.category}</p>
                </div>
              )}

              {/* Edit Profile Button */}
              <Button 
                variant="primary" 
                fullWidth 
                icon={Edit2}
                onClick={() => setIsEditing(!isEditing)}
              >
                {isEditing ? 'Cancel' : 'Edit Profile'}
              </Button>
            </div>
          </motion.div>

          {/* Right Column - Details & History */}
          <div className="lg:col-span-2 space-y-6">
            {/* Personal Details */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <User className="w-6 h-6 text-teal-600" />
                Personal Information
              </h3>

              {isEditing ? (
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    placeholder="Age"
                    value={profile.age}
                    onChange={(e) => setProfile({ ...profile, age: e.target.value })}
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/50"
                  />
                  <select
                    value={profile.gender}
                    onChange={(e) => setProfile({ ...profile, gender: e.target.value })}
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/50"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={profile.bloodType}
                    onChange={(e) => setProfile({ ...profile, bloodType: e.target.value })}
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/50"
                  >
                    <option value="">Blood Type</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Height (cm)"
                    value={profile.height}
                    onChange={(e) => setProfile({ ...profile, height: e.target.value })}
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/50"
                  />
                  <input
                    type="number"
                    placeholder="Weight (kg)"
                    value={profile.weight}
                    onChange={(e) => setProfile({ ...profile, weight: e.target.value })}
                    className="px-4 py-3 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-teal-500/50"
                  />
                  <div className="md:col-span-2">
                    <Button variant="primary" fullWidth onClick={saveProfile}>
                      Save Changes
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Age</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{profile.age || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <User className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Gender</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white capitalize">{profile.gender || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Heart className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Blood Type</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">{profile.bloodType || 'Not set'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <Activity className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Height / Weight</p>
                      <p className="text-lg font-bold text-gray-900 dark:text-white">
                        {profile.height ? `${profile.height} cm` : '--'} / {profile.weight ? `${profile.weight} kg` : '--'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>

            {/* Health Analytics */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6"
            >
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <TrendingUp className="w-6 h-6 text-teal-600" />
                Health Activity (Last 7 Days)
              </h3>
              
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={analytics}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="symptoms" fill="#14b8a6" name="Symptom Checks" />
                  <Bar dataKey="searches" fill="#3b82f6" name="Hospital Searches" />
                </BarChart>
              </ResponsiveContainer>
            </motion.div>

            {/* Medical History */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-6 h-6 text-teal-600" />
                  Medical History
                </h3>
                <Button variant="outline" icon={Download} size="sm">
                  Export PDF
                </Button>
              </div>

              <div className="space-y-3">
                {history.length === 0 ? (
                  <div className="text-center py-12">
                    <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">No medical history yet</p>
                    <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                      Start using the symptom checker to build your health record
                    </p>
                  </div>
                ) : (
                  history.slice(0, 10).map((item, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Activity className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {item.type === 'symptom' ? 'Symptom Check' : 'Hospital Search'}
                          </p>
                          <span className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.query}</p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthProfile;
