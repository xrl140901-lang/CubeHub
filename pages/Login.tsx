
import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
  onNavigate: (page: string) => void;
  t: any;
}

const Login: React.FC<LoginProps> = ({ onLogin, onNavigate, t }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const users = StorageService.getUsers();
    const user = users.find(u => u.email === email);
    
    if (user) {
      StorageService.setCurrentUser(user);
      onLogin(user);
    } else {
      alert(t.login + " Failed. User not found.");
    }
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="text-7xl font-black mb-12 tracking-tighter text-center uppercase">{t.authenticate}</h1>
      <form onSubmit={handleLogin} className="space-y-10">
        <div>
          <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{t.email}</label>
          <input 
            type="email" 
            className="w-full border-2 border-black p-5 bg-white text-black focus:outline-none focus:ring-0 text-sm font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            placeholder="cube@hub.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{t.password}</label>
          <input 
            type="password" 
            className="w-full border-2 border-black p-5 bg-white text-black focus:outline-none focus:ring-0 text-sm font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-black text-white py-6 font-black tracking-[0.3em] hover:bg-gray-800 transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase text-xs"
        >
          {t.login}
        </button>
      </form>
      <div className="mt-16 text-center text-[10px] font-black tracking-widest uppercase">
        NEW CONTRIBUTOR? <button onClick={() => onNavigate('register')} className="underline hover:no-underline">{t.register}</button>
      </div>
    </div>
  );
};

export default Login;
