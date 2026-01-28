import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Scale, Droplet, Calculator, Award, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const HealthTools = () => {
  const [activeTab, setActiveTab] = useState('bmi');
  
  // BMI Calculator State
  const [bmiData, setBmiData] = useState({ height: '', weight: '', result: null });
  
  // Water Intake Tracker State
  const [waterGoal] = useState(8); // 8 glasses
  const [waterDrunk, setWaterDrunk] = useState(() => {
    const saved = localStorage.getItem('waterDrunk');
    return saved ? parseInt(saved) : 0;
  });

  // BMI Calculation
  const calculateBMI = () => {
    const height = parseFloat(bmiData.height);
    const weight = parseFloat(bmiData.weight);
    
    if (!height || !weight || height <= 0 || weight <= 0) {
      toast.error('Please enter valid height and weight');
      return;
    }
    
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(1);
    
    let category = '';
    let color = '';
    let advice = '';
    
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-blue-600';
      advice = 'Consider consulting a nutritionist for a healthy weight gain plan.';
    } else if (bmi < 25) {
      category = 'Normal';
      color = 'text-green-600';
      advice = 'Great! Maintain your healthy lifestyle with balanced diet and exercise.';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-orange-600';
      advice = 'Consider regular exercise and a balanced diet to reach a healthy weight.';
    } else {
      category = 'Obese';
      color = 'text-red-600';
      advice = 'Consult a healthcare professional for a personalized weight management plan.';
    }
    
    setBmiData({ ...bmiData, result: { bmi, category, color, advice } });
    toast.success('BMI calculated!');
  };

  // Water Intake Functions
  const addWater = () => {
    if (waterDrunk < waterGoal) {
      const newCount = waterDrunk + 1;
      setWaterDrunk(newCount);
      localStorage.setItem('waterDrunk', newCount.toString());
      
      if (newCount === waterGoal) {
        toast.success('🎉 Goal achieved! Great hydration!');
      } else {
        toast.success('💧 Glass added!');
      }
    }
  };

  const resetWater = () => {
    setWaterDrunk(0);
    localStorage.setItem('waterDrunk', '0');
    toast.success('Water tracker reset!');
  };

  const percentage = (waterDrunk / waterGoal) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-3xl mb-4 shadow-xl">
            <Calculator className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
            Health Tools
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400">
            Track your health metrics and stay on top of wellness goals
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="flex gap-4 mb-8 overflow-x-auto"
        >
          <button
            onClick={() => setActiveTab('bmi')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'bmi'
                ? 'bg-cyan-600 text-white shadow-xl'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-lg'
            }`}
          >
            <Scale className="w-5 h-5" />
            BMI Calculator
          </button>
          <button
            onClick={() => setActiveTab('water')}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === 'water'
                ? 'bg-blue-600 text-white shadow-xl'
                : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:shadow-lg'
            }`}
          >
            <Droplet className="w-5 h-5" />
            Water Tracker
          </button>
        </motion.div>

        {/* BMI Calculator */}
        {activeTab === 'bmi' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border-2 border-cyan-200 dark:border-cyan-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <Scale className="w-8 h-8 text-cyan-600" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">BMI Calculator</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Height (cm)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 170"
                  value={bmiData.height}
                  onChange={(e) => setBmiData({ ...bmiData, height: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-cyan-600 focus:outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  placeholder="e.g., 70"
                  value={bmiData.weight}
                  onChange={(e) => setBmiData({ ...bmiData, weight: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:border-cyan-600 focus:outline-none"
                />
              </div>
            </div>

            <button
              onClick={calculateBMI}
              className="w-full py-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 text-white font-bold rounded-xl transition-all shadow-xl"
            >
              Calculate BMI
            </button>

            {bmiData.result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-900/20 dark:to-blue-900/20 rounded-2xl border-2 border-cyan-200 dark:border-cyan-800"
              >
                <div className="text-center mb-4">
                  <div className="text-6xl font-bold text-cyan-600 mb-2">{bmiData.result.bmi}</div>
                  <div className={`text-2xl font-bold ${bmiData.result.color} mb-4`}>
                    {bmiData.result.category}
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl">
                  <Info className="w-5 h-5 text-cyan-600 mt-1 flex-shrink-0" />
                  <p className="text-slate-600 dark:text-slate-400">{bmiData.result.advice}</p>
                </div>

                <div className="mt-4 grid grid-cols-4 gap-2 text-center text-xs">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                    <div className="font-bold text-blue-600">&lt;18.5</div>
                    <div className="text-slate-600 dark:text-slate-400">Under</div>
                  </div>
                  <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                    <div className="font-bold text-green-600">18.5-25</div>
                    <div className="text-slate-600 dark:text-slate-400">Normal</div>
                  </div>
                  <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                    <div className="font-bold text-orange-600">25-30</div>
                    <div className="text-slate-600 dark:text-slate-400">Over</div>
                  </div>
                  <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                    <div className="font-bold text-red-600">&gt;30</div>
                    <div className="text-slate-600 dark:text-slate-400">Obese</div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {/* Water Tracker */}
        {activeTab === 'water' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-slate-800 rounded-3xl p-8 shadow-2xl border-2 border-blue-200 dark:border-blue-800"
          >
            <div className="flex items-center gap-3 mb-6">
              <Droplet className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold text-slate-900 dark:text-white">Water Intake Tracker</h2>
            </div>

            <div className="text-center mb-8">
              <div className="text-7xl font-bold text-blue-600 mb-2">
                {waterDrunk}/{waterGoal}
              </div>
              <p className="text-xl text-slate-600 dark:text-slate-400">Glasses Today</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="h-8 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 flex items-center justify-end pr-2"
                >
                  {percentage > 10 && (
                    <span className="text-white font-bold text-sm">{Math.round(percentage)}%</span>
                  )}
                </motion.div>
              </div>
            </div>

            {/* Water Glasses Visual */}
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[...Array(waterGoal)].map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`aspect-square rounded-2xl flex items-center justify-center text-4xl transition-all ${
                    idx < waterDrunk
                      ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-xl'
                      : 'bg-slate-100 dark:bg-slate-700'
                  }`}
                >
                  💧
                </motion.div>
              ))}
            </div>

            <div className="flex gap-4">
              <button
                onClick={addWater}
                disabled={waterDrunk >= waterGoal}
                className={`flex-1 py-4 rounded-xl font-bold transition-all ${
                  waterDrunk >= waterGoal
                    ? 'bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-xl'
                }`}
              >
                {waterDrunk >= waterGoal ? '🎉 Goal Achieved!' : 'Add Glass 💧'}
              </button>
              <button
                onClick={resetWater}
                className="px-6 py-4 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl font-bold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all"
              >
                Reset
              </button>
            </div>

            {waterDrunk >= waterGoal && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 p-4 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-900/30 dark:to-emerald-900/30 rounded-2xl border-2 border-green-300 dark:border-green-800 text-center"
              >
                <Award className="w-12 h-12 text-green-600 mx-auto mb-2" />
                <p className="text-lg font-bold text-green-700 dark:text-green-400">
                  Awesome! You've reached your hydration goal today! 🎉
                </p>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HealthTools;
