import React, { useState, useEffect } from 'react';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export default function App() {
  const [user, setUser] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('dmv_user');
    if (savedUser) {
      setUser(savedUser);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (username: string) => {
    setUser(username);
    localStorage.setItem('dmv_user', username);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('dmv_user');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f0f4f8]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#004a99] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#004a99] font-bold text-sm tracking-widest uppercase">Loading Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="antialiased font-sans">
      {!user ? (
        <Login onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}
