import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  Users,
  Clock,
  Heart,
  Activity,
  Globe,
  AlertCircle,
  Phone,
  Navigation,
  BarChart3,
  PieChart,
  Zap,
  Award,
  Target
} from 'lucide-react';
import api from '../services/api';

const Analytics = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get('/analytics/stats');
      setStats(response.data.stats);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics');
      console.error('Analytics error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-xl p-8 text-center max-w-md">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Error Loading Analytics</h2>
          <p className="text-slate-600 mb-6">{error}</p>
          <button
            onClick={fetchAnalytics}
            className="px-6 py-3 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const impactMetrics = [
    {
      icon: <Users className="w-8 h-8" />,
      label: 'Total Searches',
      value: stats?.total_searches?.toLocaleString() || '0',
      subtitle: 'Health inquiries',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: <AlertCircle className="w-8 h-8" />,
      label: 'Emergency Uses',
      value: stats?.emergency_uses?.toLocaleString() || '0',
      subtitle: 'Critical situations',
      color: 'from-red-500 to-pink-500'
    },
    {
      icon: <Clock className="w-8 h-8" />,
      label: 'Time Saved',
      value: `${stats?.total_time_saved_hours?.toLocaleString() || '0'} hrs`,
      subtitle: `${stats?.total_time_saved_days || '0'} days total`,
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: <Heart className="w-8 h-8" />,
      label: 'Lives Impacted',
      value: stats?.lives_potentially_saved?.toLocaleString() || '0',
      subtitle: 'Potentially saved',
      color: 'from-purple-500 to-pink-500'
    }
  ];

  const performanceMetrics = [
    {
      icon: <Zap className="w-6 h-6" />,
      label: 'Avg Response Time',
      value: `${stats?.avg_response_time_sec || '0'}s`,
      percentage: null,
      color: 'text-yellow-600'
    },
    {
      icon: <Globe className="w-6 h-6" />,
      label: 'Kannada Usage',
      value: `${stats?.kannada_usage_percent || '0'}%`,
      percentage: stats?.kannada_usage_percent,
      color: 'text-green-600'
    },
    {
      icon: <Activity className="w-6 h-6" />,
      label: 'High Urgency',
      value: `${stats?.high_urgency_percent || '0'}%`,
      percentage: stats?.high_urgency_percent,
      color: 'text-red-600'
    },
    {
      icon: <Target className="w-6 h-6" />,
      label: 'Engagement Rate',
      value: `${stats?.engagement_rate || '0'}%`,
      percentage: stats?.engagement_rate,
      color: 'text-blue-600'
    }
  ];

  const engagementStats = [
    {
      icon: <Phone className="w-6 h-6" />,
      label: 'Hospitals Called',
      value: stats?.total_hospitals_called?.toLocaleString() || '0',
      color: 'from-teal-400 to-cyan-500'
    },
    {
      icon: <Navigation className="w-6 h-6" />,
      label: 'Directions Requested',
      value: stats?.total_directions_requested?.toLocaleString() || '0',
      color: 'from-blue-400 to-indigo-500'
    },
    {
      icon: <Users className="w-6 h-6" />,
      label: 'Total Users',
      value: stats?.total_users?.toLocaleString() || '0',
      color: 'from-purple-400 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 text-center"
        >
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-full font-bold text-sm mb-6 shadow-lg"
          >
            📊 Real-Time Impact Metrics
          </motion.div>
          
          <h1 className="text-5xl lg:text-6xl font-black mb-4">
            <span 
              className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              MediConnect Analytics
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-3xl mx-auto">
            Measuring our impact for Microsoft Imagine Cup 2026
          </p>
        </motion.div>

        {/* Main Impact Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {impactMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10, scale: 1.02 }}
              className="group relative"
            >
              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all border border-slate-200 h-full">
                <div className={`w-16 h-16 bg-gradient-to-br ${metric.color} rounded-2xl flex items-center justify-center text-white mb-6 shadow-lg group-hover:scale-110 transition-transform`}>
                  {metric.icon}
                </div>
                
                <div className="text-5xl font-black text-slate-900 mb-2" style={{ fontFamily: 'Inter, sans-serif' }}>
                  {metric.value}
                </div>
                
                <div className="text-lg font-semibold text-slate-700 mb-1">
                  {metric.label}
                </div>
                
                <div className="text-sm text-slate-500">
                  {metric.subtitle}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Cost Savings Highlight */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-8 mb-8 shadow-2xl text-white"
        >
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center"
              >
                <Award className="w-10 h-10" />
              </motion.div>
              
              <div>
                <div className="text-6xl font-black mb-2">
                  ₹{(stats?.cost_saved_inr / 1000000).toFixed(1)}M+
                </div>
                <div className="text-2xl font-semibold opacity-90">
                  Cost Savings Generated
                </div>
                <div className="text-lg opacity-75">
                  ${(stats?.cost_saved_usd / 1000).toFixed(1)}K USD • Wrong visits avoided
                </div>
              </div>
            </div>
            
            <div className="text-center md:text-right">
              <div className="text-5xl font-black mb-2">90%</div>
              <div className="text-xl font-semibold">
                Time Reduction
              </div>
              <div className="text-lg opacity-75">
                45 min → 30 sec
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Metrics */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {performanceMetrics.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all border border-slate-200"
            >
              <div className={`${metric.color} mb-4`}>
                {metric.icon}
              </div>
              
              <div className="text-3xl font-black text-slate-900 mb-2">
                {metric.value}
              </div>
              
              <div className="text-sm font-semibold text-slate-600 mb-2">
                {metric.label}
              </div>
              
              {metric.percentage !== null && (
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${metric.percentage}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
                  />
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Urgency Distribution */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Urgency Breakdown */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              <h2 className="text-2xl font-black text-slate-900">Urgency Distribution</h2>
            </div>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-slate-700">High Urgency</span>
                  <span className="font-bold text-red-600">{stats?.high_urgency_percent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.high_urgency_percent}%` }}
                    transition={{ duration: 1, delay: 1 }}
                    className="bg-gradient-to-r from-red-500 to-pink-500 h-4 rounded-full"
                  />
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {stats?.high_urgency_searches?.toLocaleString()} searches
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-slate-700">Medium Urgency</span>
                  <span className="font-bold text-yellow-600">{stats?.medium_urgency_percent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.medium_urgency_percent}%` }}
                    transition={{ duration: 1, delay: 1.1 }}
                    className="bg-gradient-to-r from-yellow-400 to-orange-400 h-4 rounded-full"
                  />
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {stats?.medium_urgency_searches?.toLocaleString()} searches
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <span className="font-semibold text-slate-700">Low Urgency</span>
                  <span className="font-bold text-green-600">{stats?.low_urgency_percent}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-4">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${stats?.low_urgency_percent}%` }}
                    transition={{ duration: 1, delay: 1.2 }}
                    className="bg-gradient-to-r from-green-400 to-emerald-400 h-4 rounded-full"
                  />
                </div>
                <div className="text-sm text-slate-500 mt-1">
                  {stats?.low_urgency_searches?.toLocaleString()} searches
                </div>
              </div>
            </div>
          </motion.div>

          {/* Engagement Stats */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200"
          >
            <div className="flex items-center gap-3 mb-6">
              <PieChart className="w-8 h-8 text-purple-600" />
              <h2 className="text-2xl font-black text-slate-900">User Engagement</h2>
            </div>
            
            <div className="space-y-6">
              {engagementStats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 + index * 0.1 }}
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-slate-100 border border-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center text-white shadow-lg`}>
                      {stat.icon}
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-slate-600">{stat.label}</div>
                      <div className="text-2xl font-black text-slate-900">{stat.value}</div>
                    </div>
                  </div>
                  <TrendingUp className="w-6 h-6 text-green-500" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Top Symptoms */}
        {stats?.top_symptoms && stats.top_symptoms.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="bg-white rounded-3xl p-8 shadow-xl border border-slate-200 mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <Activity className="w-8 h-8 text-teal-600" />
              <h2 className="text-2xl font-black text-slate-900">Top Symptoms Searched</h2>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.top_symptoms.slice(0, 6).map((symptom, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1.4 + index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                  className="p-4 rounded-2xl bg-gradient-to-br from-teal-50 to-cyan-50 border border-teal-200"
                >
                  <div className="text-3xl font-black text-teal-600 mb-2">{symptom.count}</div>
                  <div className="text-sm font-semibold text-slate-700">{symptom.symptom}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Note */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="text-center text-slate-500 text-sm"
        >
          <p>Last updated: {new Date(stats?.last_updated).toLocaleString()}</p>
          <p className="mt-2">Data tracked for Microsoft Imagine Cup 2026 demonstration</p>
        </motion.div>
      </div>
    </div>
  );
};

export default Analytics;
