import React, { useState } from 'react';
import { motion } from 'motion/react';
import { LogIn, ShieldCheck, User, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (user: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock login for DMV employees
    if (email.includes('@delaware.gov') || email.includes('dmv')) {
      onLogin(email.split('@')[0]);
    } else {
      setError('Invalid credentials. Please use your @delaware.gov email.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8] p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border-t-4 border-[#004a99]"
      >
        <div className="p-8">
          <div className="flex justify-center mb-6">
            <div className="bg-[#004a99] p-4 rounded-full">
              <ShieldCheck className="w-10 h-10 text-[#ffc72c]" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold text-center text-[#004a99] mb-2">DelDOT DMV Portal</h2>
          <p className="text-gray-500 text-center mb-8 text-sm">Revenue Analysis & Forecasting Tool</p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Employee Email</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@delaware.gov"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004a99] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#004a99] focus:border-transparent outline-none transition-all"
                />
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-xs font-medium text-center">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-[#004a99] hover:bg-[#003a7a] text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-lg shadow-blue-900/20"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </button>
          </form>
        </div>
        
        <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-widest">
            Official State of Delaware Government System
          </p>
        </div>
      </motion.div>
    </div>
  );
}
