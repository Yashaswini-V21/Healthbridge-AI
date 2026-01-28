import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Activity } from 'lucide-react';

const SplashScreen = ({ onComplete }) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsReady(true);
      setTimeout(() => onComplete(), 800);
    }, 3000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[9999] overflow-hidden"
    >
      {/* Medical Blue/White Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-teal-50">
        {/* Pulsing Grid Pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `
              linear-gradient(to right, rgba(59, 130, 246, 0.1) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px'
          }}
          animate={{
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Medical Cross Pattern */}
        <div className="absolute inset-0 opacity-5">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              style={{
                left: `${20 + i * 15}%`,
                top: '50%',
                transform: 'translateY(-50%)'
              }}
              animate={{
                y: [0, -20, 0],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{
                duration: 3 + i * 0.5,
                repeat: Infinity,
                delay: i * 0.3
              }}
            >
              <div className="text-blue-400 text-6xl font-thin">+</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        
        {/* New Medical Logo Design */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.8, type: "spring", stiffness: 120 }}
          className="mb-8"
        >
          {/* Hexagonal Medical Badge */}
          <div className="relative">
            {/* Outer Glow Ring */}
            <motion.div
              className="absolute inset-0"
              animate={{
                scale: [1, 1.15, 1],
                opacity: [0.3, 0.6, 0.3]
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <div className="w-40 h-40 rounded-3xl bg-gradient-to-br from-blue-400 to-teal-400 blur-xl" />
            </motion.div>

            {/* Main Logo Container */}
            <div className="relative w-40 h-40 bg-gradient-to-br from-blue-500 via-blue-600 to-teal-500 rounded-3xl shadow-2xl flex items-center justify-center transform rotate-45">
              <div className="w-36 h-36 bg-white rounded-2xl flex items-center justify-center transform -rotate-45">
                {/* Medical Icon */}
                <motion.div
                  animate={{
                    scale: [1, 1.05, 1]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Activity className="w-20 h-20 text-blue-600" strokeWidth={2.5} />
                </motion.div>
              </div>
            </div>

            {/* Corner Accents */}
            <motion.div
              className="absolute -top-2 -left-2 w-6 h-6 bg-teal-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="absolute -bottom-2 -right-2 w-6 h-6 bg-blue-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
            />
          </div>
        </motion.div>

        {/* MediConnect Text */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="mb-3"
        >
          <h1 
            className="text-6xl md:text-7xl font-bold tracking-tight text-center"
            style={{
              fontFamily: '"Inter", system-ui, sans-serif',
              letterSpacing: '-0.02em',
              color: '#1e40af',
              textShadow: '0 2px 10px rgba(59, 130, 246, 0.2)'
            }}
          >
            MediConnect
          </h1>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="text-lg md:text-xl font-medium text-blue-600 mb-16 text-center"
          style={{ fontFamily: '"Inter", sans-serif' }}
        >
          Your Health, Our Priority
        </motion.p>

        {/* Heartbeat Line Animation */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="w-full max-w-2xl mb-8"
        >
          <svg 
            width="100%" 
            height="80" 
            viewBox="0 0 800 80" 
            className="overflow-visible"
          >
            {/* Heartbeat Path */}
            <motion.path
              d="M 0,40 L 200,40 L 220,20 L 240,60 L 260,10 L 280,70 L 300,40 L 350,40 L 370,30 L 390,50 L 410,15 L 430,65 L 450,40 L 600,40"
              stroke="url(#heartbeatGradient)"
              strokeWidth="3"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ 
                pathLength: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
                times: [0, 0.3, 0.7, 1]
              }}
            />
            
            {/* Gradient Definition */}
            <defs>
              <linearGradient id="heartbeatGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="50%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            
            {/* Glowing Dot Following the Line */}
            <motion.circle
              cx="0"
              cy="40"
              r="4"
              fill="#3b82f6"
              initial={{ opacity: 0 }}
              animate={{
                cx: [0, 200, 220, 240, 260, 280, 300, 350, 370, 390, 410, 430, 450, 600],
                cy: [40, 40, 20, 60, 10, 70, 40, 40, 30, 50, 15, 65, 40, 40],
                opacity: [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <motion.animate
                attributeName="r"
                values="4;6;4"
                dur="0.5s"
                repeatCount="indefinite"
              />
            </motion.circle>
          </svg>
        </motion.div>

        {/* Status Text */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isReady ? 1 : 0.6 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <motion.p
            className="text-blue-600 font-semibold text-lg"
            animate={{
              opacity: isReady ? [0.6, 1, 0.6] : 0.6
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            {isReady ? 'Ready to Connect' : 'Initializing Healthcare System...'}
          </motion.p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default SplashScreen;
