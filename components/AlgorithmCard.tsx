
import React from 'react';
import { Algorithm, User } from '../types';

interface AlgorithmCardProps {
  algorithm: Algorithm;
  currentUser: User | null;
  onNavigate: (page: string, params?: any) => void;
  onToggleCollect: (id: string) => void;
  onToggleFollow: (username: string) => void;
  t: any;
}

const AlgorithmCard: React.FC<AlgorithmCardProps> = ({ 
  algorithm, 
  currentUser, 
  onNavigate, 
  onToggleCollect,
  onToggleFollow,
  t
}) => {
  const isCollected = currentUser?.collections.includes(algorithm.id);
  const isFollowing = currentUser?.following.includes(algorithm.contributor);
  const isOwn = currentUser?.username === algorithm.contributor;

  return (
    <div className="border border-black p-6 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-bold border border-black px-2 py-0.5 tracking-widest uppercase">
            {algorithm.cube_type}
          </span>
          <span className="text-[10px] font-bold text-gray-400">
            {algorithm.category}
          </span>
        </div>
        <h3 
          className="text-xl font-bold mb-4 cursor-pointer group-hover:underline"
          onClick={() => onNavigate('detail', { id: algorithm.id })}
        >
          {algorithm.title}
        </h3>
        <div className="bg-gray-50 p-4 border border-dashed border-gray-300 font-mono text-sm mb-4 break-words">
          {algorithm.algorithm}
        </div>
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between text-[10px] font-bold">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500 uppercase">{t.by}</span>
            <span className="underline cursor-pointer" onClick={() => onNavigate('profile', { user: algorithm.contributor })}>
              {algorithm.contributor}
            </span>
            {!isOwn && (
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleFollow(algorithm.contributor); }}
                className={`ml-2 px-2 py-0.5 border border-black transition-colors ${isFollowing ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                {isFollowing ? t.following : t.follow}
              </button>
            )}
          </div>
          <div className="flex items-center space-x-1">
            <i className="fa fa-comment-o"></i>
            <span>{algorithm.comment_ids.length}</span>
          </div>
        </div>
        
        <button 
          onClick={() => onToggleCollect(algorithm.id)}
          className={`w-full py-2 border border-black font-bold text-xs flex items-center justify-center space-x-2 transition-colors ${isCollected ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
        >
          <i className={`fa ${isCollected ? 'fa-bookmark' : 'fa-bookmark-o'}`}></i>
          <span>{isCollected ? t.collected : t.collect}</span>
        </button>
      </div>
    </div>
  );
};

export default AlgorithmCard;
