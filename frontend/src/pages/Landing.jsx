import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowRight,
  Heart,
  Brain,
  Building2,
  Zap,
  Globe,
  Shield,
  Star,
  CheckCircle,
  Phone,
  Stethoscope,
  Users,
  Award,
  Target,
  Sparkles
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="min-h-screen bg-white dark:bg-slate-900">
      {/* Hero Section - Clean & Modern */}
      <section className="relative min-h-[90vh] flex items-center justify-center px-6 py-20 bg-slate-50 dark:bg-slate-800">
        <div className="container max-w-6xl mx-auto text-center space-y-8">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold"
          >
            <Sparkles className="w-4 h-4" />
            AI-Powered Healthcare Navigation
          </motion.div>

          {/* Main Heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight">
              Find the Right Hospital<br />
              <span className="text-purple-600 dark:text-purple-400">In Seconds</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
              AI-powered symptom analysis and instant hospital matching for better healthcare access
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link to="/signup">
              <button className="px-8 py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 transition-colors shadow-lg hover:shadow-xl inline-flex items-center gap-2">
                Get Started Free
                <ArrowRight className="w-5 h-5" />
              </button>
            </Link>
            <Link to="/login">
              <button className="px-8 py-4 bg-white dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-purple-600 dark:hover:border-purple-500 transition-colors">
                Sign In
              </button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-8 pt-8"
          >
            {[
              { value: '55+', label: 'Symptoms' },
              { value: '40+', label: 'Hospitals' },
              { value: '<30s', label: 'Response' },
              { value: '1000+', label: 'Users' }
            ].map((stat, idx) => (
              <div key={idx} className="text-center">
                <div className="text-3xl font-bold text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6 text-sm font-semibold text-purple-600 dark:text-purple-400">
              Core Features
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Powerful features for better healthcare access
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Brain className="w-10 h-10" />,
                title: 'AI Symptom Analysis',
                description: 'Advanced AI analyzes 55+ symptoms for accurate recommendations',
                color: 'from-purple-500 to-pink-500',
                stat: '55+ Symptoms',
                accent: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
              },
              {
                icon: <Building2 className="w-10 h-10" />,
                title: 'Smart Hospital Matching',
                description: '40+ verified hospitals across multiple specialties',
                color: 'from-blue-500 to-cyan-500',
                stat: '40+ Hospitals',
                accent: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
              },
              {
                icon: <Zap className="w-10 h-10" />,
                title: 'Emergency Mode',
                description: 'One-tap access to nearest emergency care centers',
                color: 'from-orange-500 to-red-500',
                stat: '24/7 Available',
                accent: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
              },
              {
                icon: <Globe className="w-10 h-10" />,
                title: 'Multilingual Support',
                description: 'Full support in English and Kannada languages',
                color: 'from-green-500 to-emerald-500',
                stat: '2 Languages',
                accent: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
              },
              {
                icon: <Shield className="w-10 h-10" />,
                title: 'Secure & Private',
                description: 'Your health data is encrypted and protected',
                color: 'from-indigo-500 to-purple-500',
                stat: 'HIPAA Compliant',
                accent: 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400'
              },
              {
                icon: <Heart className="w-10 h-10" />,
                title: '100% Free',
                description: 'All features free forever, no hidden charges',
                color: 'from-pink-500 to-rose-500',
                stat: '$0 Cost',
                accent: 'bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400'
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-lg transition-all hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-4 ${feature.accent}`}>
                  {feature.icon}
                </div>
                
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold mb-3 ${feature.accent}`}>
                  {feature.stat}
                </span>
                
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-slate-600 dark:text-slate-400 text-sm">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Image/Decoration */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-lg">
                <div className="aspect-[4/3] bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                  <div className="text-center p-12">
                    <Stethoscope className="w-20 h-20 mx-auto mb-4 text-purple-600 dark:text-purple-400" />
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">AI-Powered Healthcare</h3>
                    <p className="text-slate-600 dark:text-slate-400">Connecting you to the right care</p>
                  </div>
                </div>
                {/* Floating Stats */}
                <div className="absolute -bottom-4 -right-4 bg-white dark:bg-slate-700 rounded-xl p-4 shadow-lg border border-slate-200 dark:border-slate-600">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                      <Award className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-xl font-bold text-slate-900 dark:text-white">4.9/5</div>
                      <div className="text-xs text-slate-600 dark:text-slate-400">User Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right: About Content */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <span className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full mb-6 text-sm font-semibold text-purple-600 dark:text-purple-400">
                About MediConnect AI
              </span>
              
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
                Revolutionizing Healthcare Access
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 mb-6">
                MediConnect AI is your intelligent healthcare companion, designed to simplify the journey from symptoms to treatment. 
                Using advanced AI and machine learning, we analyze your health concerns and connect you with the most suitable 
                healthcare facilities in real-time.
              </p>
              
              <div className="space-y-4 mb-8">
                {[
                  { icon: <Target className="w-5 h-5" />, title: 'Our Mission', text: 'Make quality healthcare accessible to everyone' },
                  { icon: <Heart className="w-5 h-5" />, title: 'Our Vision', text: 'A healthier India through smart technology' },
                  { icon: <Users className="w-5 h-5" />, title: 'Our Values', text: 'Empathy, accuracy, and accessibility' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{item.title}</h4>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4">
                <Link to="/signup">
                  <button className="px-6 py-3 bg-purple-600 text-white rounded-xl font-semibold hover:bg-purple-700 transition-all">
                    Get Started Today
                  </button>
                </Link>
                <a href="#features" className="px-6 py-3 border-2 border-purple-600 text-purple-600 dark:text-purple-400 rounded-xl font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                  Learn More
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              How It Works
            </h2>
            <p className="text-xl text-slate-600 dark:text-slate-400">
              Get help in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                number: '1',
                title: 'Describe Symptoms',
                description: 'Tell us what you\'re experiencing using text or voice input',
                icon: <Brain className="w-8 h-8" />
              },
              {
                number: '2',
                title: 'Get AI Analysis',
                description: 'Receive instant specialist recommendations from our AI',
                icon: <Sparkles className="w-8 h-8" />
              },
              {
                number: '3',
                title: 'Find Hospital',
                description: 'Get matched with the best nearby facility instantly',
                icon: <Building2 className="w-8 h-8" />
              }
            ].map((step, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.2 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-white dark:bg-slate-700 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 border border-slate-200 dark:border-slate-600">
                  <div className="w-16 h-16 bg-purple-600 rounded-xl flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                    {step.number}
                  </div>
                  <div className="w-12 h-12 mx-auto mb-4 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center text-purple-600 dark:text-purple-400">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-6 bg-white dark:bg-slate-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">
              Trusted by Thousands
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
              {
                name: 'Priya Sharma',
                role: 'Mumbai',
                text: 'Found the right hospital in minutes during an emergency. Truly life-saving!'
              },
              {
                name: 'Rajesh Kumar',
                role: 'Bangalore',
                text: 'The AI symptom checker is incredibly accurate. Saved me unnecessary visits.'
              },
              {
                name: 'Anita Reddy',
                role: 'Hyderabad',
                text: 'Simple to use and very helpful. Highly recommend to everyone!'
              }
            ].map((testimonial, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.1 }}
                viewport={{ once: true }}
                className="bg-slate-50 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-400 mb-4">
                  "{testimonial.text}"
                </p>
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{testimonial.name}</div>
                  <div className="text-sm text-slate-500">{testimonial.role}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-slate-50 dark:bg-slate-800">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-purple-600 rounded-3xl p-12 text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands using MediConnect AI for better healthcare access
            </p>
            <Link to="/signup">
              <button className="px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                Create Free Account
              </button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-slate-900 text-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="w-6 h-6 text-purple-400" />
                <span className="text-xl font-black">MediConnect AI</span>
              </div>
              <p className="text-slate-400 text-sm">
                Your health, our priority. AI-powered healthcare navigation.
              </p>
            </div>
            
            <div>
              <h3 className="font-bold mb-4">Product</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link to="/symptom-checker" className="hover:text-white">Symptom Checker</Link></li>
                <li><Link to="/hospitals" className="hover:text-white">Find Hospitals</Link></li>
                <li><Link to="/emergency" className="hover:text-white">Emergency</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Company</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">About Us</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4">Support</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">FAQs</a></li>
                <li><a href="tel:1800-123-4567" className="hover:text-white flex items-center gap-2">
                  <Phone className="w-4 h-4" />
                  1800-123-4567
                </a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-400">
              © 2026 MediConnect AI. All rights reserved.
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Microsoft Imagine Cup 2026
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
