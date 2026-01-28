import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, AlertCircle, Phone, ChevronDown, ChevronUp, Search } from 'lucide-react';

const FirstAidGuide = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);

  const emergencies = [
    {
      id: 1,
      icon: '🩹',
      title: 'Cuts & Wounds',
      severity: 'Medium',
      color: 'orange',
      steps: [
        'Wash your hands with soap and water',
        'Stop the bleeding by applying gentle pressure with a clean cloth',
        'Clean the wound with clean water',
        'Apply antibiotic ointment if available',
        'Cover with a sterile bandage',
        'Change the bandage daily',
        'Seek medical help if bleeding doesn\'t stop or wound is deep'
      ]
    },
    {
      id: 2,
      icon: '🔥',
      title: 'Burns',
      severity: 'High',
      color: 'red',
      steps: [
        'Remove from heat source immediately',
        'Cool the burn with running water for 10-20 minutes',
        'Remove jewelry or tight clothing near the burn',
        'Cover with a sterile, non-stick bandage',
        'Take over-the-counter pain reliever if needed',
        'DO NOT apply ice, butter, or ointments',
        'Seek medical attention for severe burns'
      ]
    },
    {
      id: 3,
      icon: '💊',
      title: 'Poisoning',
      severity: 'Critical',
      color: 'red',
      steps: [
        'Call emergency services (108) immediately',
        'Try to identify what was swallowed',
        'DO NOT induce vomiting unless told to by medical professionals',
        'If person is conscious, rinse mouth with water',
        'Keep the container or substance for medical reference',
        'Monitor breathing and consciousness',
        'Be ready to perform CPR if needed'
      ]
    },
    {
      id: 4,
      icon: '🤕',
      title: 'Head Injury',
      severity: 'High',
      color: 'red',
      steps: [
        'Call emergency services if severe',
        'Keep person still and lying down',
        'Apply ice pack wrapped in cloth to reduce swelling',
        'Monitor for symptoms: confusion, vomiting, severe headache',
        'DO NOT move person if neck injury is suspected',
        'Keep person awake if they seem drowsy',
        'Seek immediate medical attention'
      ]
    },
    {
      id: 5,
      icon: '🫁',
      title: 'Choking',
      severity: 'Critical',
      color: 'red',
      steps: [
        'Encourage the person to cough forcefully',
        'If unable to cough, perform Heimlich maneuver',
        'Stand behind, wrap arms around waist',
        'Make a fist above navel, grasp with other hand',
        'Give quick upward thrusts',
        'Repeat until object is expelled',
        'Call 108 if object cannot be removed'
      ]
    },
    {
      id: 6,
      icon: '❄️',
      title: 'Fractures',
      severity: 'High',
      color: 'orange',
      steps: [
        'DO NOT move the injured area',
        'Immobilize the injured limb',
        'Apply ice pack to reduce swelling',
        'Elevate the injured area if possible',
        'DO NOT try to realign the bone',
        'Seek immediate medical attention',
        'Monitor for shock symptoms'
      ]
    },
    {
      id: 7,
      icon: '🐝',
      title: 'Insect Bites & Stings',
      severity: 'Low',
      color: 'yellow',
      steps: [
        'Remove stinger if present (scrape, don\'t squeeze)',
        'Wash area with soap and water',
        'Apply cold compress to reduce swelling',
        'Take antihistamine if available',
        'Monitor for allergic reaction symptoms',
        'Seek emergency help if breathing difficulty occurs',
        'Keep area clean and avoid scratching'
      ]
    },
    {
      id: 8,
      icon: '💔',
      title: 'Heart Attack',
      severity: 'Critical',
      color: 'red',
      steps: [
        'Call 108 IMMEDIATELY',
        'Help person sit or lie down comfortably',
        'Loosen tight clothing',
        'Give aspirin if available and not allergic',
        'Stay calm and reassure the person',
        'Monitor breathing and pulse',
        'Be ready to perform CPR if needed',
        'DO NOT leave person alone'
      ]
    },
    {
      id: 9,
      icon: '🌡️',
      title: 'Heatstroke',
      severity: 'High',
      color: 'orange',
      steps: [
        'Move person to cool, shaded area',
        'Remove excess clothing',
        'Cool the body with wet cloths or water',
        'Fan the person',
        'Give cool water if conscious',
        'Monitor body temperature',
        'Call emergency services if condition worsens',
        'DO NOT give ice-cold water'
      ]
    },
    {
      id: 10,
      icon: '⚡',
      title: 'Electric Shock',
      severity: 'Critical',
      color: 'red',
      steps: [
        'DO NOT touch the person while in contact with electricity',
        'Turn off power source if possible',
        'Call 108 immediately',
        'Use non-conductive object to separate person from source',
        'Check for breathing and pulse',
        'Perform CPR if needed',
        'Cover any burns with sterile dressing',
        'Keep person warm and lying down'
      ]
    },
    {
      id: 11,
      icon: '🤢',
      title: 'Nosebleed',
      severity: 'Low',
      color: 'yellow',
      steps: [
        'Sit upright and lean forward slightly',
        'Pinch soft part of nose firmly',
        'Hold for 10-15 minutes',
        'Breathe through mouth',
        'Apply cold compress to bridge of nose',
        'DO NOT tilt head backward',
        'Seek medical help if bleeding continues >20 minutes'
      ]
    },
    {
      id: 12,
      icon: '😵',
      title: 'Fainting',
      severity: 'Medium',
      color: 'yellow',
      steps: [
        'Lay person flat on back',
        'Elevate legs above heart level',
        'Loosen tight clothing',
        'Check for breathing',
        'Turn head to side if vomiting',
        'DO NOT give anything to eat or drink immediately',
        'Seek medical help if doesn\'t recover in 1-2 minutes'
      ]
    }
  ];

  const filteredEmergencies = emergencies.filter(emergency =>
    emergency.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-800';
      case 'High': return 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-800';
      case 'Medium': return 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800';
      case 'Low': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-300 dark:border-green-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-900 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="inline-block p-4 bg-gradient-to-br from-red-500 to-orange-600 rounded-3xl mb-4 shadow-xl">
            <Heart className="w-12 h-12 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-slate-900 dark:text-white mb-3">
            First Aid Guide
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-6">
            Essential emergency response steps for common situations
          </p>
          
          {/* Emergency Number */}
          <div className="inline-flex items-center gap-3 bg-red-600 text-white px-6 py-3 rounded-2xl shadow-xl">
            <Phone className="w-6 h-6" />
            <span className="text-xl font-bold">Emergency: 108</span>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search emergencies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:border-red-500 focus:outline-none"
            />
          </div>
        </motion.div>

        {/* Warning Banner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-yellow-100 dark:bg-yellow-900/30 border-2 border-yellow-400 dark:border-yellow-800 rounded-2xl p-6 mb-8"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-yellow-700 dark:text-yellow-400 flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-bold text-yellow-900 dark:text-yellow-300 mb-2">Important Disclaimer</h3>
              <p className="text-yellow-800 dark:text-yellow-400 text-sm">
                This guide provides basic first aid information. Always call emergency services (108) for serious injuries. 
                These instructions do not replace professional medical training or advice.
              </p>
            </div>
          </div>
        </motion.div>

        {/* Emergency Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredEmergencies.map((emergency, index) => (
            <motion.div
              key={emergency.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl border-2 border-slate-200 dark:border-slate-700 overflow-hidden"
            >
              <div
                className="p-6 cursor-pointer"
                onClick={() => setExpandedId(expandedId === emergency.id ? null : emergency.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl">{emergency.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                        {emergency.title}
                      </h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold mt-2 border-2 ${getSeverityColor(emergency.severity)}`}>
                        {emergency.severity} Priority
                      </span>
                    </div>
                  </div>
                  {expandedId === emergency.id ? (
                    <ChevronUp className="w-6 h-6 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-6 h-6 text-slate-400" />
                  )}
                </div>

                <AnimatePresence>
                  {expandedId === emergency.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="pt-4 border-t-2 border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <span className="w-6 h-6 bg-red-600 text-white rounded-full flex items-center justify-center text-xs">
                            ⚡
                          </span>
                          Steps to Follow:
                        </h4>
                        <ol className="space-y-2">
                          {emergency.steps.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                              <span className="flex-shrink-0 w-6 h-6 bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-full flex items-center justify-center text-xs font-bold">
                                {idx + 1}
                              </span>
                              <span className="text-sm">{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredEmergencies.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <p className="text-xl text-slate-600 dark:text-slate-400">
              No emergencies found matching "{searchQuery}"
            </p>
          </motion.div>
        )}

        {/* Bottom Warning */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-12 text-center p-6 bg-red-100 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-800 rounded-2xl"
        >
          <Phone className="w-12 h-12 text-red-600 mx-auto mb-3" />
          <h3 className="text-2xl font-bold text-red-900 dark:text-red-300 mb-2">
            When in Doubt, Call for Help
          </h3>
          <p className="text-red-800 dark:text-red-400 mb-4">
            If you're unsure about any emergency, always call 108 immediately.
            Professional help is just a phone call away.
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <span className="px-4 py-2 bg-red-600 text-white rounded-lg font-bold">
              Emergency: 108
            </span>
            <span className="px-4 py-2 bg-blue-600 text-white rounded-lg font-bold">
              Police: 100
            </span>
            <span className="px-4 py-2 bg-orange-600 text-white rounded-lg font-bold">
              Fire: 101
            </span>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FirstAidGuide;
