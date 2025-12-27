
import React, { useState } from 'react';
import { StorageService } from '../services/storage';
import { User } from '../types';

interface RegisterProps {
  onNavigate: (page: string) => void;
  t: any;
}

const Register: React.FC<RegisterProps> = ({ onNavigate, t }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    const users = StorageService.getUsers();
    
    if (users.find(u => u.email === formData.email || u.username === formData.username)) {
      alert("Registration Error: Account already exists.");
      return;
    }

    const newUser: User = {
      id: Date.now().toString(),
      username: formData.username,
      email: formData.email,
      following: [],
      collections: []
    };

    StorageService.setUsers([...users, newUser]);
    alert("Success. Please login.");
    onNavigate('login');
  };

  return (
    <div className="max-w-md mx-auto px-6 py-20">
      <h1 className="text-7xl font-black mb-12 tracking-tighter text-center uppercase text-black">{t.join}</h1>
      <form onSubmit={handleRegister} className="space-y-10">
        <div>
          <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em] text-black">{t.username}</label>
          <input 
            type="text" 
            className="w-full border-2 border-black p-5 bg-white text-black focus:outline-none focus:ring-0 text-sm font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            placeholder="speedcuber_99"
            value={formData.username}
            onChange={(e) => setFormData({...formData, username: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em] text-black">{t.email}</label>
          <input 
            type="email" 
            className="w-full border-2 border-black p-5 bg-white text-black focus:outline-none focus:ring-0 text-sm font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            placeholder="cube@hub.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
        </div>
        <div>
          <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em] text-black">{t.password}</label>
          <input 
            type="password" 
            className="w-full border-2 border-black p-5 bg-white text-black focus:outline-none focus:ring-0 text-sm font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />
        </div>
        <button 
          type="submit" 
          className="w-full bg-black text-white py-6 font-black tracking-[0.3em] hover:bg-gray-800 transition-all shadow-[10px_10px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase text-xs"
        >
          {t.register}
        </button>
      </form>
      <div className="mt-16 text-center text-[10px] font-black tracking-widest text-black uppercase">
        ALREADY A MEMBER? <button onClick={() => onNavigate('login')} className="underline hover:no-underline">{t.login}</button>
      </div>
    </div>
  );
};

export default Register;
