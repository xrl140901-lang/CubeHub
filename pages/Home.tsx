
import React, { useState, useMemo } from 'react';
import { Algorithm, User, CUBE_TYPES } from '../types';
import AlgorithmCard from '../components/AlgorithmCard';
import { StorageService } from '../services/storage';

interface HomeProps {
  algorithms: Algorithm[];
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
  onToggleCollect: (id: string) => void;
  onToggleFollow: (username: string) => void;
  t: any;
}

const Home: React.FC<HomeProps> = ({ 
  algorithms, 
  currentUser, 
  onNavigate, 
  onToggleCollect,
  onToggleFollow,
  t
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const isCloud = StorageService.isCloudEnabled();

  const filteredAlgs = useMemo(() => {
    return algorithms.filter(alg => {
      const matchesSearch = alg.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            alg.algorithm.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            alg.contributor.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = selectedType === 'All' || alg.cube_type === selectedType;
      return matchesSearch && matchesType;
    });
  }, [algorithms, searchTerm, selectedType]);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <header className="mb-12 relative">
        <div className="absolute -top-8 left-0 flex items-center space-x-2">
           <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
           <span className="text-[10px] font-black tracking-widest uppercase text-gray-400">
             {isCloud ? "Global Community Hub Live" : "Local Preview Mode"}
           </span>
        </div>
        <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tighter uppercase">
          {t.algorithms}
        </h1>
        <p className="text-lg text-gray-500 max-w-2xl font-medium">
          {isCloud ? "Explore algorithms contributed by speedcubers worldwide. Every contribution helps the community grow." : t.minimalism_desc}
        </p>
      </header>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="relative flex-grow max-w-xl">
          <i className="fa fa-search absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"></i>
          <input 
            type="text" 
            placeholder={t.search_placeholder} 
            className="w-full pl-12 pr-4 py-4 border-2 border-black focus:outline-none focus:ring-0 transition-all text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => setSelectedType('All')}
            className={`px-4 py-2 border-2 border-black text-[10px] font-black transition-all tracking-widest ${selectedType === 'All' ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
          >
            {t.all.toUpperCase()}
          </button>
          {CUBE_TYPES.map(type => (
            <button 
              key={type}
              onClick={() => setSelectedType(type)}
              className={`px-4 py-2 border-2 border-black text-[10px] font-black transition-all tracking-widest ${selectedType === type ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              {type.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {filteredAlgs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {filteredAlgs.map(alg => (
            <AlgorithmCard 
              key={alg.id}
              algorithm={alg}
              currentUser={currentUser}
              onNavigate={onNavigate}
              onToggleCollect={onToggleCollect}
              onToggleFollow={onToggleFollow}
              t={t}
            />
          ))}
        </div>
      ) : (
        <div className="py-32 text-center border-4 border-black border-dashed">
          <p className="text-2xl font-black uppercase mb-2">{t.no_algs}</p>
          <p className="text-gray-400 font-medium">{t.no_algs_desc}</p>
        </div>
      )}
    </div>
  );
};

export default Home;
