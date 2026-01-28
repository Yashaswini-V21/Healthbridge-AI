
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Search, MapPin, Zap, Shield, Globe, Clock, ArrowRight, CheckCircle,
  Heart, Activity, Brain, Building2, Award, Navigation, Target, Users, Star,
  Calendar, Sparkles, MapPinned
} from 'lucide-react';

const Home = () => {
  const handleEmergencySOS = () => {
    // Call emergency number
    if (window.confirm('🚨 Call Emergency Services?\n\nThis will dial 108 (India Emergency Number)')) {
      window.location.href = 'tel:108';
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Emergency SOS Button - Fixed Position */}
      <button
        onClick={handleEmergencySOS}
        className="fixed bottom-8 right-8 z-50 w-16 h-16 bg-red-600 hover:bg-red-700 text-white rounded-full shadow-2xl flex items-center justify-center transition-all hover:scale-110 animate-pulse"
        title="Emergency SOS - Call 108"
      >
        <span className="text-3xl">🚨</span>
      </button>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-semibold text-purple-600 dark:text-purple-400">
              ✨ AI-Powered Healthcare Navigation
            </span>

            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 dark:text-white">
              Your Health,
              <br />
              <span className="text-purple-600 dark:text-purple-400">Our Priority</span>
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400">
              Find the right hospital in <span className="text-purple-600 dark:text-purple-400 font-semibold">under 30 seconds</span>. 
              AI-powered instant matches.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 pt-4">
              {[
                { value: '50+', label: 'Hospitals', icon: Building2 },
                { value: '98%', label: 'Accuracy', icon: Target },
                { value: '24/7', label: 'Support', icon: Clock }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + idx * 0.1 }}
                  className="bg-slate-50 dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 text-center"
                >
                  <stat.icon className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <Link to="/symptom-checker">
                <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
              <Link to="/emergency">
                <button className="px-6 py-3 border-2 border-red-600 text-red-600 dark:text-red-400 dark:border-red-500 rounded-xl font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex items-center gap-2">
                  🚨 Emergency
                  <Zap className="w-5 h-5" />
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Hero Image - Large Dashboard */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img 
                src="/assets/dashboard-laptop-2.jpg" 
                alt="MediConnect Dashboard" 
                className="w-full h-auto"
              />
            </div>
          </motion.div>
          </div>
        </div>
      </section>

      {/* Key Features Section - Matching Screenshot */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          {/* 3 Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {/* Feature 1: AI Analysis */}
            <Link to="/symptom-checker">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Brain className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      AI Analysis
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Instant Results
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Feature 2: Smart Matching */}
            <Link to="/hospitals">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Building2 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      Smart Matching
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      40+ Hospitals
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>

            {/* Feature 3: GPS Navigation */}
            <Link to="/hospitals">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-pointer border border-slate-200 dark:border-slate-600"
              >
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <Navigation className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                      GPS Navigation
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">
                      Real-time
                    </p>
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </section>

      {/* About Section with Dashboard Image */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-semibold text-purple-600 dark:text-purple-400 mb-4">
              About MediConnect AI
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Revolutionizing Healthcare Access
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              AI-powered navigation and instant medical guidance connecting you to the right care
            </p>
          </div>

          {/* Dashboard Preview Image */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative max-w-5xl mx-auto mb-16"
          >
            <div className="relative bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border-4 border-slate-200 dark:border-slate-700 overflow-hidden">
              <img 
                src="/assets/dashboard-laptop-1.jpg" 
                alt="MediConnect Dashboard Preview"
                className="w-full h-auto rounded-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
            </div>
            
            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="absolute -top-4 -right-4 bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-xl border border-slate-200 dark:border-slate-700"
            >
              <div className="flex items-center gap-3">
                <Award className="w-8 h-8 text-purple-600" />
                <div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">4.9/5</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">User Rating</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {[
              { icon: Users, value: '1000+', label: 'Happy Users' },
              { icon: Star, value: '4.9/5', label: 'Rating' },
              { icon: Award, value: '100%', label: 'Free Service' }
            ].map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 flex items-center gap-4"
              >
                <stat.icon className="w-12 h-12 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stat.value}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Powerful Features
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Everything you need for better healthcare access
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: Brain,
                title: 'AI Symptom Analysis',
                desc: 'Advanced AI analyzes your symptoms for accurate health insights.',
                color: 'purple'
              },
              {
                icon: Building2,
                title: 'Hospital Matching',
                desc: 'Find perfect facilities based on specialties and location.',
                color: 'blue'
              },
              {
                icon: Zap,
                title: 'Emergency Response',
                desc: 'One-tap emergency mode for urgent medical situations.',
                color: 'red'
              },
              {
                icon: Globe,
                title: 'Multilingual',
                desc: 'Healthcare assistance in English and Kannada.',
                color: 'green'
              },
              {
                icon: Navigation,
                title: 'GPS Navigation',
                desc: 'Real-time directions to your chosen facility.',
                color: 'orange'
              },
              {
                icon: Shield,
                title: 'Secure & Private',
                desc: 'Healthcare-grade encryption protects your data.',
                color: 'indigo'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-700 rounded-2xl p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all"
              >
                <div className={`w-12 h-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-lg flex items-center justify-center text-${feature.color}-600 dark:text-${feature.color}-400 mb-4`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {feature.desc}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Dashboard Showcase */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-16 max-w-5xl mx-auto"
          >
            <div className="bg-white dark:bg-slate-700 rounded-3xl p-8 shadow-2xl border-2 border-slate-200 dark:border-slate-600">
              <img 
                src="/assets/dashboard-laptop-2.jpg" 
                alt="MediConnect Features Dashboard"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* 3 Stunning New Features Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-semibold text-purple-600 dark:text-purple-400 mb-4">
              ✨ New Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Experience Next-Level Healthcare
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Three powerful tools to transform your medical journey
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1: Smart Appointment Booking */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-3xl p-8 border-2 border-purple-200 dark:border-purple-800 hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform">
                <Calendar className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Smart Appointment Booking
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Book appointments instantly with your preferred doctors. Get confirmations in seconds.
              </p>
              <ul className="space-y-3 mb-6">
                {['Instant confirmation', 'Choose preferred doctors', 'Flexible rescheduling', 'Reminder notifications'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/appointments">
                <button className="w-full px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all flex items-center justify-center gap-2">
                  Book Appointment
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>

            {/* Feature 2: Specialist Finder & Skincare */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-3xl p-8 border-2 border-blue-200 dark:border-blue-800 hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 transform hover:scale-110 transition-transform">
                <MapPinned className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Specialist Near You
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Find dermatologists, skincare experts, and 20+ specializations near your location.
              </p>
              <ul className="space-y-3 mb-6">
                {['20+ specializations', 'Dermatology & skincare', 'Verified doctor profiles', 'Real patient reviews'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/specialists">
                <button className="w-full px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                  Find Specialists
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>

            {/* Feature 3: Text-Based Symptom Entry (Alternative to Voice) */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
              className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl p-8 border-2 border-green-200 dark:border-green-800 hover:shadow-2xl transition-all hover:-translate-y-2"
            >
              <div className="w-16 h-16 bg-green-600 rounded-2xl flex items-center justify-center mb-6 transform hover:rotate-12 transition-transform">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Quick Symptom Entry
              </h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6">
                Type symptoms naturally or select from common conditions. Fast, accurate AI analysis.
              </p>
              <ul className="space-y-3 mb-6">
                {['One-click symptom chips', 'Natural language typing', 'Instant AI analysis', 'Specialty recommendations'].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                    <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link to="/symptom-checker">
                <button className="w-full px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transition-all flex items-center justify-center gap-2">
                  Check Symptoms
                  <ArrowRight className="w-5 h-5" />
                </button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Get help in 3 simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {[
              { step: '1', icon: Search, title: 'Describe Symptoms', desc: 'Tell us what you\'re experiencing' },
              { step: '2', icon: Brain, title: 'AI Analysis', desc: 'Get instant specialist recommendations' },
              { step: '3', icon: Building2, title: 'Find Hospital', desc: 'Match with the best facility nearby' }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-400">{item.desc}</p>
              </motion.div>
            ))}
          </div>

          {/* Tablet Dashboard Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-slate-100 dark:bg-slate-800 rounded-3xl p-8 shadow-xl border-2 border-slate-200 dark:border-slate-700">
              <img 
                src="/assets/dashboard-tablet.jpg" 
                alt="MediConnect on Tablet"
                className="w-full h-auto rounded-2xl"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* About Team Section with Doctor Image */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Doctor Team Image */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white dark:border-slate-700">
                <img 
                  src="/assets/about-doctors.jpg" 
                  alt="MediConnect Medical Team"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/10 via-transparent to-transparent pointer-events-none" />
              </div>
            </motion.div>

            {/* About Content */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white">
                Connecting Care, Building Trust
              </h3>
              <p className="text-lg text-slate-600 dark:text-slate-400">
                MediConnect is not just an app—it's your healthcare companion. We use cutting-edge 
                AI technology to analyze symptoms, match you with the perfect healthcare facility, 
                and provide instant emergency support.
              </p>

              {/* Value Props */}
              <div className="space-y-4">
                {[
                  { 
                    icon: Heart, 
                    title: 'Patient-Centered Care',
                    desc: 'Your health and comfort are our top priority'
                  },
                  { 
                    icon: Brain, 
                    title: 'AI-Powered Intelligence',
                    desc: 'Advanced algorithms for accurate medical guidance'
                  },
                  { 
                    icon: Shield, 
                    title: 'Trust & Security',
                    desc: 'Healthcare-grade encryption protects your data'
                  }
                ].map((value, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    viewport={{ once: true }}
                    className="flex gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700"
                  >
                    <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <value.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1">{value.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{value.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-6">
          {[
            { icon: Users, value: '1000+', label: 'Happy Patients' },
            { icon: Building2, value: '50+', label: 'Partner Hospitals' },
            { icon: Brain, value: '500+', label: 'Symptoms Analyzed' },
            { icon: Clock, value: '<30s', label: 'Average Response' }
          ].map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              className="bg-white dark:bg-slate-700 rounded-2xl p-6 text-center border border-slate-200 dark:border-slate-600"
            >
              <stat.icon className="w-12 h-12 text-purple-600 mx-auto mb-4" />
              <h3 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{stat.value}</h3>
              <p className="text-slate-600 dark:text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Daily Health Tips Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 rounded-full text-sm font-semibold text-green-600 dark:text-green-400 mb-4">
              💚 Daily Health Tips
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Your Health Matters Every Day
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Simple tips for a healthier, happier you
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '💧', title: 'Stay Hydrated', tip: 'Drink 8 glasses of water daily for optimal health', color: 'blue' },
              { icon: '🏃', title: 'Move Daily', tip: '30 minutes of exercise keeps you fit and energized', color: 'orange' },
              { icon: '🥗', title: 'Eat Balanced', tip: 'Include fruits, vegetables & proteins in every meal', color: 'green' },
              { icon: '😴', title: 'Sleep Well', tip: 'Get 7-8 hours of quality sleep for recovery', color: 'purple' }
            ].map((healthTip, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border-2 border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:-translate-y-2 transition-all"
              >
                <div className={`w-16 h-16 bg-${healthTip.color}-100 dark:bg-${healthTip.color}-900/30 rounded-2xl flex items-center justify-center mb-4 text-4xl`}>
                  {healthTip.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
                  {healthTip.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {healthTip.tip}
                </p>
              </motion.div>
            ))}
          </div>

          {/* Health Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mt-12 bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-xl border-2 border-green-200 dark:border-green-800 text-center"
          >
            <div className="text-5xl mb-4">💪</div>
            <blockquote className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              "Health is not just about what you're eating. It's also about what you're thinking and saying."
            </blockquote>
            <p className="text-slate-600 dark:text-slate-400 font-semibold">- Buddha</p>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              What Our Users Say
            </h2>
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-xl font-bold text-slate-900 dark:text-white">4.9/5</span>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Priya Sharma', role: 'Mumbai', text: 'Found the right hospital in minutes. Truly life-saving!' },
              { name: 'Rajesh Kumar', role: 'Bangalore', text: 'The AI symptom checker is incredibly accurate.' },
              { name: 'Anita Reddy', role: 'Hyderabad', text: 'Simple to use and very helpful!' }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">"{testimonial.text}"</p>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-purple-600 rounded-3xl p-12 text-white"
          >
            <Heart className="w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Transform Your Healthcare Experience?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands using MediConnect for better health
            </p>
            <Link to="/signup">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Get Started Free
              </button>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;
