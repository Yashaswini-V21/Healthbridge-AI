import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import api from '../services/api';
import LoadingSpinner from '../components/common/LoadingSpinner';
import VoiceInput from '../components/features/VoiceInput';
import { useNavigate } from 'react-router-dom';

const ChatDoctor = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: 'Hello! I\'m your AI Health Assistant. 👋 Tell me about your symptoms or health concerns, and I\'ll help you understand what might be happening.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { t } = useLanguage();
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // Call the symptom analysis API
      const response = await api.post('/symptoms/analyze', { symptoms: input });
      
      // Format the AI response
      let botResponse = '🔍 Based on your symptoms, here\'s what I found:\n\n';
      
      if (response.data.conditions && response.data.conditions.length > 0) {
        botResponse += '**Possible Conditions:**\n';
        response.data.conditions.slice(0, 3).forEach((condition, idx) => {
          botResponse += `${idx + 1}. ${condition.name} (${Math.round(condition.confidence * 100)}% match)\n`;
        });
        botResponse += '\n';
      }

      if (response.data.recommended_specialties && response.data.recommended_specialties.length > 0) {
        botResponse += '**Recommended Specialists:**\n';
        response.data.recommended_specialties.forEach(specialty => {
          botResponse += `• ${specialty}\n`;
        });
        botResponse += '\n';
      }

      if (response.data.urgency_level) {
        const urgency = response.data.urgency_level;
        if (urgency === 'high' || urgency === 'emergency') {
          botResponse += '⚠️ **URGENT:** Please seek immediate medical attention!\n\n';
        } else if (urgency === 'moderate') {
          botResponse += '📋 **Recommendation:** Schedule an appointment with a doctor soon.\n\n';
        } else {
          botResponse += '✅ **Good News:** This seems manageable. Monitor your symptoms.\n\n';
        }
      }

      botResponse += '\n💡 Would you like me to:\n';
      botResponse += '• Find nearby hospitals?\n';
      botResponse += '• Book an appointment?\n';
      botResponse += '• Save this to your health history?';

      const botMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: botResponse,
        timestamp: new Date(),
        actions: ['find_hospitals', 'book_appointment', 'save_history']
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage = {
        id: Date.now() + 1,
        sender: 'bot',
        text: '😔 I apologize, I\'m having trouble analyzing that. Could you describe your symptoms in more detail? For example: "I have a headache, fever, and body ache since yesterday."',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleVoiceTranscript = (text) => {
    setInput(text);
  };

  const handleAction = (action) => {
    if (action === 'find_hospitals') {
      navigate('/hospitals');
    } else if (action === 'book_appointment') {
      navigate('/appointments');
    } else if (action === 'save_history') {
      navigate('/health-profile');
    }
  };

  const quickQuestions = [
    '💊 What should I do for a common cold?',
    '🤒 I have a high fever, what could it be?',
    '🏥 When should I go to the emergency room?',
    '💉 Do I need to see a specialist?'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center gap-4 mb-4">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl"
            >
              <Bot className="w-10 h-10 text-white" />
            </motion.div>
            <div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white">
                AI Chat Doctor
              </h1>
              <p className="text-lg text-gray-600 dark:text-gray-300 flex items-center justify-center gap-2">
                <Sparkles className="w-5 h-5 text-yellow-500" />
                Powered by Advanced Medical AI
              </p>
            </div>
          </div>
        </motion.div>

        {/* Chat Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 overflow-hidden"
        >
          {/* Messages Area */}
          <div className="h-[500px] overflow-y-auto p-6 space-y-4 scrollbar-thin scrollbar-thumb-purple-500 scrollbar-track-transparent">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ type: 'spring', duration: 0.5 }}
                  className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-green-500 to-teal-600' 
                      : 'bg-gradient-to-br from-blue-500 to-purple-600'
                  } shadow-lg`}>
                    {message.sender === 'user' ? (
                      <User className="w-6 h-6 text-white" />
                    ) : (
                      <Bot className="w-6 h-6 text-white" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div className={`max-w-[70%] ${
                    message.sender === 'user' 
                      ? 'bg-gradient-to-br from-green-500 to-teal-600 text-white' 
                      : 'bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 text-gray-900 dark:text-white'
                  } rounded-2xl p-4 shadow-lg`}>
                    <p className="whitespace-pre-line text-sm leading-relaxed">{message.text}</p>
                    
                    {/* Action Buttons */}
                    {message.actions && (
                      <div className="mt-4 flex flex-wrap gap-2">
                        {message.actions.includes('find_hospitals') && (
                          <button
                            onClick={() => handleAction('find_hospitals')}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-blue-600 dark:text-blue-400 rounded-lg text-xs font-semibold hover:scale-105 transition-transform shadow-md"
                          >
                            🏥 Find Hospitals
                          </button>
                        )}
                        {message.actions.includes('book_appointment') && (
                          <button
                            onClick={() => handleAction('book_appointment')}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 rounded-lg text-xs font-semibold hover:scale-105 transition-transform shadow-md"
                          >
                            📅 Book Appointment
                          </button>
                        )}
                        {message.actions.includes('save_history') && (
                          <button
                            onClick={() => handleAction('save_history')}
                            className="px-4 py-2 bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 rounded-lg text-xs font-semibold hover:scale-105 transition-transform shadow-md"
                          >
                            💾 Save to History
                          </button>
                        )}
                      </div>
                    )}

                    <p className="text-xs opacity-60 mt-2">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex gap-3"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div className="bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-600 rounded-2xl p-4 shadow-lg">
                  <div className="flex gap-2">
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0 }}
                      className="w-2 h-2 bg-blue-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                      className="w-2 h-2 bg-purple-500 rounded-full"
                    />
                    <motion.div
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                      className="w-2 h-2 bg-pink-500 rounded-full"
                    />
                  </div>
                </div>
              </motion.div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions (if messages.length <= 1) */}
          {messages.length <= 1 && (
            <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/50">
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 font-semibold">💡 Quick Questions:</p>
              <div className="grid grid-cols-2 gap-2">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => setInput(question)}
                    className="text-left px-3 py-2 bg-white dark:bg-gray-800 rounded-lg text-xs hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors border border-gray-200 dark:border-gray-600"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
            <div className="flex gap-3 items-end">
              <div className="flex-1 relative">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Describe your symptoms or ask a health question..."
                  className="w-full px-4 py-3 pr-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 transition-all resize-none"
                  rows="2"
                />
                <div className="absolute bottom-2 right-2">
                  <VoiceInput onTranscript={handleVoiceTranscript} />
                </div>
              </div>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSend}
                disabled={loading || !input.trim()}
                className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-xl flex items-center justify-center shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-xl transition-all"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <Send className="w-5 h-5" />
                )}
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Info Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-6 text-center"
        >
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ⚠️ <strong>Disclaimer:</strong> This AI assistant provides general health information only. Always consult a qualified healthcare professional for medical advice.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default ChatDoctor;
