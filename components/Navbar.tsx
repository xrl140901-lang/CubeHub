
import React from 'react';
import { User } from '../types';
import { StorageService } from '../services/storage';

interface NavbarProps {
  currentUser: User | null;
  onLogout: () => void;
  onNavigate: (page: string, params?: any) => void;
  toggleLanguage: () => void;
  lang: 'en' | 'zh';
  t: any;
}

const Navbar: React.FC<NavbarProps> = ({ currentUser, onLogout, onNavigate, toggleLanguage, lang, t }) => {
  const isCloud = StorageService.isCloudEnabled();

  return (
    <nav className="border-b-4 border-black py-4 px-6 mb-12 flex flex-col lg:flex-row items-center justify-between sticky top-0 bg-white z-50 gap-6">
      <div className="flex items-center space-x-4">
        <div 
          className="text-4xl font-black cursor-pointer tracking-tighter" 
          onClick={() => onNavigate('home')}
        >
          CUBE<span className="bg-black text-white px-2 ml-1">HUB</span>
        </div>
        <div className={`text-[8px] font-black px-2 py-0.5 border ${isCloud ? 'border-green-500 text-green-500' : 'border-amber-500 text-amber-500'} uppercase tracking-widest`}>
          {isCloud ? '● Cloud Synced' : '○ Local Mode'}
        </div>
      </div>
      
      <div className="flex flex-wrap items-center justify-center space-x-4 md:space-x-8 text-sm font-black">
        <button onClick={() => onNavigate('home')} className="hover:underline tracking-widest uppercase">{t.home}</button>
        <button onClick={() => onNavigate('about')} className="hover:underline tracking-widest uppercase">{t.about}</button>
        
        <button 
          onClick={() => onNavigate('upload')} 
          className="bg-black text-white px-4 py-2 hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] tracking-widest uppercase text-xs"
        >
          {t.upload}
        </button>
        
        {currentUser ? (
          <>
            <button onClick={() => onNavigate('profile')} className="hover:underline tracking-widest uppercase">{t.profile}</button>
            <div className="flex items-center space-x-3 pl-6 border-l-2 border-black">
              <span className="text-gray-400 text-[10px]">{currentUser.username}</span>
              <button 
                onClick={handleLogoutWithConfirm}
                className="border-2 border-black px-3 py-1 text-[10px] font-black hover:bg-black hover:text-white transition-all uppercase"
              >
                {t.logout}
              </button>
            </div>
          </>
        ) : (
          <div className="flex space-x-4 items-center pl-6 border-l-2 border-black">
            <button 
              onClick={() => onNavigate('login')}
              className="hover:underline uppercase text-xs"
            >
              {t.login}
            </button>
            <button 
              onClick={() => onNavigate('register')}
              className="bg-black text-white px-5 py-2 hover:bg-gray-800 transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] uppercase text-xs"
            >
              {t.register}
            </button>
          </div>
        )}

        <button 
          onClick={toggleLanguage}
          className="ml-4 border-2 border-black px-2 py-0.5 text-[10px] font-black hover:bg-black hover:text-white transition-all"
        >
          {lang === 'zh' ? 'EN' : 'ZH'}
        </button>
      </div>
    </nav>
  );

  function handleLogoutWithConfirm() {
    if (confirm(lang === 'zh' ? "确定要退出登录吗？" : "Are you sure you want to logout?")) {
      onLogout();
    }
  }
};

export default Navbar;
