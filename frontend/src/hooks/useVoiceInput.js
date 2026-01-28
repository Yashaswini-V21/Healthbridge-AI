import { useState, useRef, useCallback } from 'react';

export const useVoiceInput = (language = 'english') => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);

  const getLanguageCode = (lang) => {
    return lang === 'kannada' ? 'kn-IN' : 'en-IN';
  };

  const startListening = useCallback(() => {
    console.log('🎤 Starting voice input...');
    setError('');
    
    // First, test microphone access
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(stream => {
        console.log('✅ Microphone access granted');
        stream.getTracks().forEach(track => track.stop()); // Stop test stream
        
        // Now start speech recognition
        startSpeechRecognition();
      })
      .catch(err => {
        console.error('❌ Microphone access denied:', err);
        const errorMsg = language === 'kannada'
          ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನೀಡಿ! Chrome ಸೆಟ್ಟಿಂಗ್ಸ್ ತೆರೆಯಿರಿ'
          : '🔒 Microphone blocked! Click lock icon in address bar → Allow microphone';
        setError(errorMsg);
        alert(errorMsg + '\n\nSteps:\n1. Click 🔒 icon in address bar\n2. Allow microphone\n3. Refresh page\n4. Try again');
      });
  }, [language]);

  const startSpeechRecognition = () => {
    setTranscript('');

    // Check for browser support
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      const errorMsg = language === 'kannada' 
        ? 'ಈ ಬ್ರೌಸರ್‌ನಲ್ಲಿ ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಬೆಂಬಲಿತವಾಗಿಲ್ಲ' 
        : 'Voice not supported. Use Chrome!';
      console.error('❌', errorMsg);
      setError(errorMsg);
      alert(errorMsg);
      return;
    }

    // Stop any existing recognition
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {
        console.log('Stopped previous recognition');
      }
    }

    try {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      
      // More forgiving settings
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = getLanguageCode(language);
      recognition.maxAlternatives = 3;
      
      // IMPORTANT: These help with sensitivity
      if (recognition.audioCapture) {
        recognition.audioCapture = true;
      }

      console.log('🌐 Language set to:', recognition.lang);

      let finalTranscript = '';
      let silenceTimer = null;
      let hasReceivedAudio = false;

      recognition.onstart = () => {
        console.log('✅ Recognition started! SPEAK LOUDLY NOW!');
        setIsListening(true);
        setError('');
        hasReceivedAudio = false;
        
        // If no audio after 5 seconds, stop and show error
        setTimeout(() => {
          if (!hasReceivedAudio && recognitionRef.current) {
            console.log('⚠️ No audio detected after 5 seconds');
            recognitionRef.current.stop();
            setError(language === 'kannada' 
              ? 'ಆಡಿಯೋ ಕೇಳಿಸಲಿಲ್ಲ. ಮೈಕ್ರೊಫೋನ್ ಕೆಲಸ ಮಾಡುತ್ತಿದೆಯೇ?' 
              : 'No audio detected! Check Windows mic settings or type instead');
          }
        }, 5000);
      };

      recognition.onaudiostart = () => {
        console.log('🎤 Audio being captured!');
        hasReceivedAudio = true;
      };

      recognition.onsoundstart = () => {
        console.log('🔊 Sound detected!');
      };

      recognition.onspeechstart = () => {
        console.log('🗣️ Speech detected!');
      };

      recognition.onresult = (event) => {
        console.log('📝 Got result:', event.results);
        hasReceivedAudio = true;
        
        let interimTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const result = event.results[i];
          if (result.isFinal) {
            finalTranscript += result[0].transcript + ' ';
            console.log('✅ Final transcript:', result[0].transcript);
          } else {
            interimTranscript += result[0].transcript;
            console.log('⏳ Interim:', result[0].transcript);
          }
        }
        
        const text = (finalTranscript + interimTranscript).trim();
        console.log('🗣️ Current text:', text);
        setTranscript(text);
        
        // Auto-stop after 3 seconds of silence (increased from 2)
        if (silenceTimer) clearTimeout(silenceTimer);
        silenceTimer = setTimeout(() => {
          if (recognitionRef.current) {
            console.log('⏱️ Auto-stopping after silence...');
            recognitionRef.current.stop();
          }
        }, 3000);
      };

      recognition.onend = () => {
        console.log('🛑 Recognition ended');
        setIsListening(false);
        if (silenceTimer) clearTimeout(silenceTimer);
      };

      recognition.onerror = (event) => {
        console.error('❌ Recognition error:', event.error);
        setIsListening(false);
        if (silenceTimer) clearTimeout(silenceTimer);
        
        let errorMessage = '';
        
        if (event.error === 'not-allowed' || event.error === 'permission-denied') {
          errorMessage = language === 'kannada' 
            ? 'ಮೈಕ್ರೊಫೋನ್ ಅನುಮತಿ ನೀಡಿ' 
            : 'Microphone blocked! Click 🔒 in address bar';
          alert(errorMessage);
        } else if (event.error === 'no-speech') {
          errorMessage = language === 'kannada' 
            ? 'ಮಾತು ಕೇಳಿಸಲಿಲ್ಲ. ಜೋರಾಗಿ ಮಾತನಾಡಿ!' 
            : '❌ No speech detected!';
          
          // Show detailed instructions
          console.error('⚠️ MICROPHONE NOT PICKING UP AUDIO!');
          console.log('📋 Try these fixes:');
          console.log('1. Windows Search → "Microphone Privacy Settings" → Turn ON');
          console.log('2. Windows Search → "Sound Settings" → Input → Test microphone');
          console.log('3. Speak VERY LOUD and close to mic (2-3 inches away)');
          console.log('4. Check Windows volume mixer - mic not muted?');
          console.log('5. Try a different browser or device');
          
          alert('🎤 Microphone Issue!\n\nYour mic is allowed but not detecting audio.\n\n✅ QUICK FIX:\n1. Windows Key + Type "Microphone"\n2. Click "Microphone Privacy Settings"\n3. Turn ON "Let apps access microphone"\n4. Turn ON "Let desktop apps access microphone"\n5. Refresh this page and try again\n\nOR just type your symptoms instead! 💬');
        } else if (event.error === 'audio-capture') {
          errorMessage = language === 'kannada' 
          ? 'ಮೈಕ್ರೊಫೋನ್ ಸಂಪರ್ಕಿಸಿ' 
          : 'Microphone not found';
        } else if (event.error === 'aborted') {
          // Ignore aborted errors
          return;
        } else if (event.error !== 'network') {
          errorMessage = `Error: ${event.error}`;
        }
        
        if (errorMessage) {
          console.error('❌', errorMessage);
          setError(errorMessage);
          setTimeout(() => setError(''), 5000);
        }
      };

      console.log('🚀 Starting recognition...');
      recognition.start();
      recognitionRef.current = recognition;
      
      // Play a beep sound to indicate recording started
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        oscillator.frequency.value = 800;
        gainNode.gain.value = 0.3;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
      } catch (e) {
        console.log('Could not play beep');
      }
      
    } catch (err) {
      console.error('❌ Failed to initialize:', err);
      setError(language === 'kannada' 
        ? 'ಧ್ವನಿ ಗುರುತಿಸುವಿಕೆ ಪ್ರಾರಂಭಿಸಲು ವಿಫಲವಾಗಿದೆ' 
        : 'Failed to start voice');
      setIsListening(false);
      alert('Voice recognition failed: ' + err.message);
    }
  };

  const stopListening = useCallback(() => {
    console.log('🛑 Stopping voice input...');
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      } catch (e) {
        console.log('Already stopped');
      }
    }
    setIsListening(false);
    // Don't clear transcript here - let it be sent to parent first
  }, []);

  // Reset transcript when starting new recording
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return { isListening, transcript, error, startListening, stopListening, resetTranscript };
};
