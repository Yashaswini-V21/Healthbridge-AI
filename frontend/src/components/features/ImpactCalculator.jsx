import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Heart,
  TrendingDown,
  TrendingUp,
  Frown,
  Smile,
  Zap,
  Shield,
  Share2
} from 'lucide-react';

const ImpactCalculator = () => {
  const [city, setCity] = useState('Bangalore');
  const [timeWasted, setTimeWasted] = useState(45);
  const [wrongVisit, setWrongVisit] = useState(true);
  const [showResults, setShowResults] = useState(false);

  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Hyderabad', 'Chennai'];

  const calculateImpact = () => {
    const baseCost = 8500; // Average cost of wrong hospital visit + transfer
    const complicationRisk = wrongVisit ? 15 : 5; // Percentage
    
    return {
      timeWasted: timeWasted,
      moneyCost: wrongVisit ? baseCost : baseCost * 0.3,
      complicationRisk: complicationRisk,
      stressLevel: wrongVisit ? 'Maximum' : 'Moderate'
    };
  };

  const withMediConnect = {
    timeWasted: 0.5, // 30 seconds
    moneySaved: wrongVisit ? 8500 : 2550,
    complicationRisk: 0,
    stressLevel: 'Minimal'
  };

  const impact = calculateImpact();

  const handleCalculate = () => {
    setShowResults(true);
  };

  const handleShare = () => {
    const text = `I could save ₹${withMediConnect.moneySaved.toLocaleString()} and ${impact.timeWasted} minutes with MediConnect AI! Try it now: https://mediconnect-ai.vercel.app`;
    
    if (navigator.share) {
      navigator.share({
        title: 'MediConnect AI - Impact Calculator',
        text: text,
        url: 'https://mediconnect-ai.vercel.app'
      });
    } else {
      navigator.clipboard.writeText(text);
      alert('Results copied to clipboard!');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="inline-block px-6 py-2 bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-full font-bold text-sm mb-6 shadow-lg"
          >
            ⚠️ The Cost of NOT Using MediConnect AI
          </motion.div>
          
          <h1 className="text-5xl lg:text-6xl font-black mb-4">
            <span 
              className="bg-gradient-to-r from-red-600 via-orange-600 to-yellow-600 bg-clip-text text-transparent"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              Impact Calculator
            </span>
          </h1>
          <p className="text-xl text-slate-700 max-w-3xl mx-auto">
            See how much you're risking without AI-powered healthcare navigation
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Input */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl p-8 shadow-2xl border-2 border-slate-200"
          >
            <h2 className="text-3xl font-black text-slate-900 mb-8 flex items-center gap-3">
              <Clock className="w-8 h-8 text-red-500" />
              Your Scenario
            </h2>

            <div className="space-y-8">
              {/* City Selection */}
              <div>
                <label className="block text-lg font-bold text-slate-700 mb-3">
                  City
                </label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-6 py-4 rounded-2xl border-2 border-slate-300 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 text-lg font-semibold transition-all"
                >
                  {cities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Time Wasted Slider */}
              <div>
                <label className="block text-lg font-bold text-slate-700 mb-3">
                  Time Wasted Calling Hospitals: {timeWasted} minutes
                </label>
                <input
                  type="range"
                  min="15"
                  max="90"
                  step="5"
                  value={timeWasted}
                  onChange={(e) => setTimeWasted(parseInt(e.target.value))}
                  className="w-full h-3 bg-gradient-to-r from-green-400 via-yellow-400 to-red-500 rounded-full appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #10b981 0%, #fbbf24 50%, #ef4444 100%)`
                  }}
                />
                <div className="flex justify-between text-sm text-slate-500 mt-2">
                  <span>15 min</span>
                  <span>90 min</span>
                </div>
              </div>

              {/* Wrong Hospital Visit */}
              <div>
                <label className="block text-lg font-bold text-slate-700 mb-3">
                  Wrong Hospital Visit?
                </label>
                <div className="flex gap-4">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWrongVisit(true)}
                    className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                      wrongVisit
                        ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    Yes
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setWrongVisit(false)}
                    className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                      !wrongVisit
                        ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    No
                  </motion.button>
                </div>
              </div>

              {/* Calculate Button */}
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleCalculate}
                className="w-full py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-xl shadow-2xl hover:shadow-3xl transition-all"
              >
                Calculate Impact
              </motion.button>
            </div>
          </motion.div>

          {/* Results Display */}
          <AnimatePresence>
            {showResults && (
              <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="space-y-6"
              >
                {/* Without MediConnect */}
                <div className="bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Frown className="w-10 h-10" />
                    <h3 className="text-3xl font-black">Without MediConnect AI</h3>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Clock className="w-8 h-8" />
                          <div>
                            <div className="text-sm font-semibold opacity-90">Time Wasted</div>
                            <div className="text-3xl font-black">{impact.timeWasted} min</div>
                          </div>
                        </div>
                        <TrendingDown className="w-8 h-8" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-8 h-8" />
                          <div>
                            <div className="text-sm font-semibold opacity-90">Money Lost</div>
                            <div className="text-3xl font-black">₹{impact.moneyCost.toLocaleString()}</div>
                          </div>
                        </div>
                        <TrendingDown className="w-8 h-8" />
                      </div>
                      <div className="text-xs mt-2 opacity-75">
                        {wrongVisit ? 'Wrong hospital + transfer costs' : 'Transportation & time costs'}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <AlertTriangle className="w-8 h-8" />
                          <div>
                            <div className="text-sm font-semibold opacity-90">Complication Risk</div>
                            <div className="text-3xl font-black">{impact.complicationRisk}%</div>
                          </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-yellow-300" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart className="w-8 h-8" />
                          <div>
                            <div className="text-sm font-semibold opacity-90">Stress Level</div>
                            <div className="text-3xl font-black">{impact.stressLevel}</div>
                          </div>
                        </div>
                        😰
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* With MediConnect */}
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl p-8 text-white shadow-2xl">
                  <div className="flex items-center gap-3 mb-6">
                    <Smile className="w-10 h-10" />
                    <h3 className="text-3xl font-black">With MediConnect AI</h3>
                  </div>

                  <div className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Zap className="w-8 h-8" />
                          <div>
                            <div className="text-sm font-semibold opacity-90">Time Taken</div>
                            <div className="text-3xl font-black">30 sec</div>
                          </div>
                        </div>
                        <CheckCircle className="w-8 h-8" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <DollarSign className="w-8 h-8" />
                          <div>
                            <div className="text-sm font-semibold opacity-90">Money Saved</div>
                            <div className="text-3xl font-black">₹{withMediConnect.moneySaved.toLocaleString()}</div>
                          </div>
                        </div>
                        <TrendingUp className="w-8 h-8 text-green-300" />
                      </div>
                      <div className="text-xs mt-2 opacity-75">
                        Right hospital, first time!
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield className="w-8 h-8" />
                          <div>
                            <div className="text-sm font-semibold opacity-90">Complication Risk</div>
                            <div className="text-3xl font-black">0%</div>
                          </div>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-300" />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Heart className="w-8 h-8" />
                          <div>
                            <div className="text-sm font-semibold opacity-90">Peace of Mind</div>
                            <div className="text-3xl font-black">Priceless</div>
                          </div>
                        </div>
                        😊
                      </div>
                    </motion.div>
                  </div>
                </div>

                {/* Summary Card */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl"
                >
                  <h3 className="text-3xl font-black mb-6 text-center">Your Savings Summary</h3>
                  
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div className="text-center">
                      <div className="text-5xl font-black mb-2">{Math.round((impact.timeWasted / 30) * 89)}x</div>
                      <div className="text-lg font-semibold">Faster</div>
                    </div>
                    <div className="text-center">
                      <div className="text-5xl font-black mb-2">₹{(withMediConnect.moneySaved).toLocaleString()}</div>
                      <div className="text-lg font-semibold">Saved</div>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShare}
                      className="flex-1 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
                    >
                      <Share2 className="w-5 h-5" />
                      Share Results
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => window.location.href = '/signup'}
                      className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl font-bold text-lg shadow-lg hover:shadow-xl transition-all"
                    >
                      Try MediConnect AI
                    </motion.button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Call to Action */}
        {showResults && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="mt-12 text-center"
          >
            <div className="bg-white rounded-3xl p-8 shadow-xl border-2 border-slate-200 max-w-3xl mx-auto">
              <h3 className="text-3xl font-black text-slate-900 mb-4">
                Don't Waste Another Minute
              </h3>
              <p className="text-xl text-slate-600 mb-6">
                Join thousands who've already saved time, money, and stress with MediConnect AI
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.href = '/signup'}
                className="px-12 py-5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-black text-2xl shadow-2xl hover:shadow-3xl transition-all inline-flex items-center gap-3"
              >
                Get Started Free
                <Zap className="w-6 h-6" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ImpactCalculator;
