import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Activity } from 'lucide-react';

const Logo = ({ size = 'medium', animated = true, showText = true }) => {
  const sizes = {
    small: { icon: 24, text: 'text-xl' },
    medium: { icon: 32, text: 'text-2xl' },
    large: { icon: 48, text: 'text-4xl' },
    xlarge: { icon: 64, text: 'text-5xl' }
  };

  const { icon: iconSize, text: textSize } = sizes[size];

  const pulseAnimation = animated ? {
    scale: [1, 1.1, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  const glowAnimation = animated ? {
    boxShadow: [
      '0 0 20px rgba(59, 130, 246, 0.5)',
      '0 0 40px rgba(59, 130, 246, 0.8)',
      '0 0 20px rgba(59, 130, 246, 0.5)'
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut"
    }
  } : {};

  return (
    <motion.div 
      className="flex items-center gap-3"
      initial={animated ? { opacity: 0, y: -20 } : {}}
      animate={animated ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5 }}
    >
      {/* Logo Icon - Futuristic Medical Cross with Heart */}
      <motion.div 
        className="relative"
        animate={pulseAnimation}
      >
        <motion.div
          className="relative flex items-center justify-center bg-gradient-to-br from-primary-600 via-purple-600 to-cyber-600 rounded-2xl shadow-2xl"
          style={{ 
            width: iconSize * 1.5, 
            height: iconSize * 1.5 
          }}
          animate={glowAnimation}
        >
          {/* Heartbeat Line */}
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <Activity className="text-neon-blue/40" size={iconSize * 0.8} />
          </motion.div>

          {/* Heart Icon */}
          <Heart 
            className="text-white fill-white drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" 
            size={iconSize * 0.7}
          />

          {/* Plus Sign Overlay */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]" style={{ fontSize: iconSize * 0.5 }}>
              +
            </div>
          </div>
        </motion.div>

        {/* Animated Pulse Rings - Neon Effect */}
        {animated && (
          <>
            <motion.div
              className="absolute inset-0 border-4 border-primary-400 rounded-2xl"
              style={{ boxShadow: '0 0 20px rgba(168, 85, 247, 0.6)' }}
              animate={{
                scale: [1, 1.3, 1.3],
                opacity: [0.6, 0, 0]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-cyber-400 rounded-2xl"
              style={{ boxShadow: '0 0 20px rgba(0, 212, 255, 0.6)' }}
              animate={{
                scale: [1, 1.5, 1.5],
                opacity: [0.4, 0, 0]
              }}
              transition={{
                duration: 2,
                delay: 0.5,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
            <motion.div
              className="absolute inset-0 border-4 border-purple-400 rounded-2xl"
              style={{ boxShadow: '0 0 20px rgba(192, 132, 252, 0.6)' }}
              animate={{
                scale: [1, 1.7, 1.7],
                opacity: [0.3, 0, 0]
              }}
              transition={{
                duration: 2,
                delay: 1,
                repeat: Infinity,
                ease: "easeOut"
              }}
            />
          </>
        )}
      </motion.div>

      {/* Logo Text */}
      {showText && (
        <div className="flex flex-col">
          <motion.h1 
            className={`${textSize} font-black bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 dark:from-cyan-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent leading-tight tracking-tight`}
            initial={animated ? { opacity: 0, x: -20 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            MediConnect
          </motion.h1>
          <motion.p 
            className="text-xs font-bold text-cyan-600 dark:text-cyan-400 tracking-wider uppercase"
            initial={animated ? { opacity: 0, x: -20 } : {}}
            animate={animated ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Healthcare AI
          </motion.p>
        </div>
      )}
    </motion.div>
  );
};

export default Logo;
