import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  Stethoscope, 
  Users, 
  Volume2, 
  Monitor, 
  Smartphone, 
  ShieldCheck,
  ArrowRight,
  CheckCircle2
} from 'lucide-react';

export default function Landing() {
  const navigate = useNavigate();
  const [displayCode, setDisplayCode] = React.useState('');

  const handleOpenDisplay = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayCode.trim()) {
      navigate(`/display/${displayCode.trim().toUpperCase()}`);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Stethoscope className="text-white w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">ClinicToken</span>
            </div>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate('/login')}
                className="text-slate-600 hover:text-slate-900 font-medium transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full font-semibold transition-all shadow-lg shadow-blue-200"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wide text-blue-600 uppercase bg-blue-50 rounded-full">
              Modern Queue Management
            </span>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-slate-900 mb-6 leading-[1.1]">
              Manage your clinic queue <br />
              <span className="text-blue-600">with ease and precision.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-slate-600 mb-10 leading-relaxed">
              Eliminate waiting room chaos with our real-time token system. 
              Easy setup, voice announcements, and beautiful public displays.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <button 
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2 group"
              >
                Start Free Trial <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => window.scrollTo({ top: 1200, behavior: 'smooth' })}
                className="w-full sm:w-auto bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 px-8 py-4 rounded-2xl font-bold text-lg transition-all"
              >
                View Features
              </button>
            </div>

            {/* Patient Display Code Input */}
            <div className="max-w-md mx-auto bg-slate-50 p-6 rounded-[2rem] border border-slate-200 shadow-sm">
              <p className="text-sm font-semibold text-slate-500 mb-4 uppercase tracking-wider">Patient? View Token Status</p>
              <form onSubmit={handleOpenDisplay} className="flex gap-2">
                <input 
                  type="text" 
                  placeholder="Enter Display Code" 
                  value={displayCode}
                  onChange={(e) => setDisplayCode(e.target.value)}
                  className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-blue-500 outline-none uppercase font-bold tracking-widest"
                  maxLength={6}
                />
                <button 
                  type="submit"
                  className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition-colors"
                >
                  Go
                </button>
              </form>
              <p className="text-xs text-slate-400 mt-3 italic">Ask your clinic for their 6-digit display code</p>
            </div>
          </motion.div>

          {/* Dashboard Preview */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="mt-20 relative"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-[2.5rem] blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative bg-white rounded-[2rem] border border-slate-200 shadow-2xl overflow-hidden aspect-[16/9] max-w-5xl mx-auto">
              <img 
                src="https://picsum.photos/seed/clinic-dashboard/1920/1080" 
                alt="Dashboard Preview" 
                className="w-full h-full object-cover opacity-80"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-white/40 to-transparent"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white/90 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border border-white/50 text-center max-w-sm">
                  <p className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-2">Now Serving</p>
                  <p className="text-8xl font-black text-slate-900 leading-none">42</p>
                  <p className="text-sm font-medium text-slate-500 mt-4">Real-time synchronization across all displays</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to manage patients</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">Powerful features designed specifically for healthcare providers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Monitor className="w-6 h-6" />,
                title: "Public Display",
                desc: "Beautiful, customizable screens for your waiting area. Support for fullscreen and custom branding."
              },
              {
                icon: <Volume2 className="w-6 h-6" />,
                title: "Voice Announcements",
                desc: "Automatic token announcements in multiple languages including English and Malayalam."
              },
              {
                icon: <Users className="w-6 h-6" />,
                title: "Multi-Clinic Support",
                desc: "Manage multiple branches or departments under a single organization with isolated queues."
              },
              {
                icon: <Smartphone className="w-6 h-6" />,
                title: "Mobile Ready",
                desc: "Control your queue from any device. Staff can issue and call tokens from their smartphones."
              },
              {
                icon: <ShieldCheck className="w-6 h-6" />,
                title: "Secure & Private",
                desc: "Enterprise-grade security rules ensure patient data and clinic operations stay private."
              },
              {
                icon: <CheckCircle2 className="w-6 h-6" />,
                title: "Instant Setup",
                desc: "Register and start issuing tokens in less than 2 minutes. No complex hardware required."
              }
            ].map((feature, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5 }}
                className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="bg-blue-50 text-blue-600 w-12 h-12 rounded-2xl flex items-center justify-center mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600 text-white overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl md:text-5xl font-black mb-2">500+</p>
              <p className="text-blue-100 font-medium">Clinics Trust Us</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black mb-2">1M+</p>
              <p className="text-blue-100 font-medium">Tokens Issued</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black mb-2">99.9%</p>
              <p className="text-blue-100 font-medium">Uptime Guarantee</p>
            </div>
            <div>
              <p className="text-4xl md:text-5xl font-black mb-2">24/7</p>
              <p className="text-blue-100 font-medium">Expert Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4">
        <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/20 blur-[100px]"></div>
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to transform your waiting room?</h2>
            <p className="text-slate-400 text-lg mb-10 max-w-2xl mx-auto">
              Join hundreds of clinics that have improved their patient experience and staff efficiency.
            </p>
            <button 
              onClick={() => navigate('/login')}
              className="bg-white text-slate-900 hover:bg-slate-100 px-10 py-4 rounded-2xl font-bold text-xl transition-all shadow-2xl"
            >
              Get Started for Free
            </button>
            <p className="text-slate-500 mt-6 text-sm">No credit card required • Instant activation</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="bg-slate-900 p-1.5 rounded-lg">
              <Stethoscope className="text-white w-4 h-4" />
            </div>
            <span className="text-lg font-bold tracking-tight text-slate-900">ClinicToken</span>
          </div>
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} ClinicToken Management System. All rights reserved.
          </p>
          <div className="flex justify-center gap-6 mt-6 text-slate-400 text-sm">
            <a href="#" className="hover:text-slate-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 transition-colors">Contact Us</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
