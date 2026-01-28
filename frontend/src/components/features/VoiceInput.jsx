import React, { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Radio } from 'lucide-react';
import { useVoiceInput } from '../../hooks/useVoiceInput';
import { LanguageContext } from '../../context/LanguageContext';

const VoiceInput = ({ onTranscript, className = '' }) => {
  const { language } = useContext(LanguageContext);
  const { isListening, transcript, error, startListening, stopListening, resetTranscript } = useVoiceInput(language);
  const [showTip, setShowTip] = React.useState(false);
  const lastTranscriptRef = React.useRef('');

  React.useEffect(() => {
    // Only call onTranscript when recognition stops and transcript changed
    if (!isListening && transcript && transcript !== lastTranscriptRef.current && onTranscript) {
      console.log('📤 Sending final transcript:', transcript);
      onTranscript(transcript);
      lastTranscriptRef.current = transcript;
      
      // Reset after 500ms to prepare for next recording
      setTimeout(() => {
        resetTranscript();
        lastTranscriptRef.current = '';
      }, 500);
    }
  }, [isListening, transcript, onTranscript, resetTranscript]);

  const handleToggle = () => {
    if (isListening) {
      stopListening();
    } else {
      // Show tip on first click
      if (!localStorage.getItem('voiceTipShown')) {
        setShowTip(true);
        localStorage.setItem('voiceTipShown', 'true');
        setTimeout(() => setShowTip(false), 5000);
      }
      startListening();
    }
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleToggle}
        className={`p-4 rounded-2xl transition-all shadow-lg ${
          isListening
            ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
            : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white'
        } ${className}`}
        title={isListening ? 'Stop recording' : `Start voice input (${language === 'kannada' ? 'ಕನ್ನಡ' : 'English'})`}
      >
        <div className="relative">
          {isListening ? (
            <MicOff className="w-7 h-7" />
          ) : (
            <Mic className="w-7 h-7" />
          )}
          
          {/* Pulsing animation when listening */}
          {isListening && (
            <>
              <motion.div
                animate={{ scale: [1, 1.5, 1], opacity: [0.7, 0, 0.7] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className="absolute inset-0 rounded-full bg-red-400"
              />
              <motion.div
                animate={{ scale: [1, 1.8, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
                className="absolute inset-0 rounded-full bg-red-400"
              />
            </>
          )}
        </div>
      </motion.button>

      {/* Listening Indicator */}
      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 w-max px-4 py-2 bg-red-500 text-white rounded-xl shadow-lg z-10"
          >
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              >
                <Radio className="w-4 h-4" />
              </motion.div>
              <span className="text-sm font-bold">
                {language === 'kannada' ? '🎤 ಈಗ ಮಾತನಾಡಿ!' : '🎤 SPEAK NOW!'}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tip on First Use */}
      <AnimatePresence>
        {showTip && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 w-64 px-4 py-3 bg-blue-600 text-white rounded-xl shadow-lg z-10 text-center"
          >
            <p className="text-sm font-semibold">
              💡 Speak IMMEDIATELY when you see "SPEAK NOW!" 
              <br />
              Keep talking for 2-3 seconds
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Message */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute top-full mt-3 left-1/2 transform -translate-x-1/2 w-max px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl shadow-lg z-10 border-2 border-red-300 dark:border-red-700"
          >
            <span className="text-sm font-semibold">{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceInput;
