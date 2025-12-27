
import React, { useState } from 'react';
import { User, Algorithm, Comment } from '../types';
import AlgorithmCard from '../components/AlgorithmCard';

interface ProfileProps {
  viewUser: User | null;
  currentUser: User | null;
  algorithms: Algorithm[];
  comments: Comment[];
  onNavigate: (page: string, params?: any) => void;
  onToggleCollect: (id: string) => void;
  onToggleFollow: (username: string) => void;
  t: any;
}

const Profile: React.FC<ProfileProps> = ({ 
  viewUser, 
  currentUser, 
  algorithms, 
  comments,
  onNavigate,
  onToggleCollect,
  onToggleFollow,
  t
}) => {
  const [activeTab, setActiveTab] = useState<'collections' | 'uploads' | 'following' | 'comments'>('collections');

  if (!viewUser) return <div className="text-center py-20 font-black uppercase">{t.no_algs}</div>;

  const userUploads = algorithms.filter(a => a.contributor === viewUser.username);
  const userCollections = algorithms.filter(a => viewUser.collections.includes(a.id));
  const userComments = comments.filter(c => c.author === viewUser.username);
  const isSelf = currentUser?.id === viewUser.id;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-8 border-black pb-8 mb-12">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-black text-white flex items-center justify-center text-4xl font-black">
            {viewUser.username[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-6xl font-black tracking-tighter">{viewUser.username.toUpperCase()}</h1>
            <p className="text-gray-400 font-bold text-xs tracking-widest uppercase">{viewUser.email}</p>
          </div>
        </div>
        {!isSelf && currentUser && (
          <button 
            onClick={() => onToggleFollow(viewUser.username)}
            className={`mt-6 md:mt-0 px-8 py-3 border-4 border-black font-black transition-all tracking-widest uppercase text-xs ${currentUser.following.includes(viewUser.username) ? 'bg-black text-white' : 'hover:bg-gray-100 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:shadow-none'}`}
          >
            {currentUser.following.includes(viewUser.username) ? t.following : t.follow}
          </button>
        )}
      </div>

      <div className="flex border-b border-black mb-12 overflow-x-auto no-scrollbar">
        <button 
          onClick={() => setActiveTab('collections')}
          className={`px-8 py-4 font-black text-[10px] tracking-[0.2em] transition-all border-b-4 whitespace-nowrap uppercase ${activeTab === 'collections' ? 'border-black' : 'border-transparent text-gray-400'}`}
        >
          {t.collections} ({viewUser.collections.length})
        </button>
        <button 
          onClick={() => setActiveTab('uploads')}
          className={`px-8 py-4 font-black text-[10px] tracking-[0.2em] transition-all border-b-4 whitespace-nowrap uppercase ${activeTab === 'uploads' ? 'border-black' : 'border-transparent text-gray-400'}`}
        >
          {t.contributions} ({userUploads.length})
        </button>
        <button 
          onClick={() => setActiveTab('following')}
          className={`px-8 py-4 font-black text-[10px] tracking-[0.2em] transition-all border-b-4 whitespace-nowrap uppercase ${activeTab === 'following' ? 'border-black' : 'border-transparent text-gray-400'}`}
        >
          {t.following} ({viewUser.following.length})
        </button>
        <button 
          onClick={() => setActiveTab('comments')}
          className={`px-8 py-4 font-black text-[10px] tracking-[0.2em] transition-all border-b-4 whitespace-nowrap uppercase ${activeTab === 'comments' ? 'border-black' : 'border-transparent text-gray-400'}`}
        >
          {t.activity} ({userComments.length})
        </button>
      </div>

      <div>
        {activeTab === 'collections' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userCollections.length > 0 ? (
              userCollections.map(alg => (
                <AlgorithmCard 
                  key={alg.id} 
                  algorithm={alg} 
                  currentUser={currentUser} 
                  onNavigate={onNavigate} 
                  onToggleCollect={onToggleCollect} 
                  onToggleFollow={onToggleFollow} 
                  t={t}
                />
              ))
            ) : <p className="col-span-full py-20 text-center text-gray-300 font-black border-2 border-dashed border-gray-200 uppercase tracking-widest">{t.no_algs}</p>}
          </div>
        )}

        {activeTab === 'uploads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {userUploads.length > 0 ? (
              userUploads.map(alg => (
                <AlgorithmCard 
                  key={alg.id} 
                  algorithm={alg} 
                  currentUser={currentUser} 
                  onNavigate={onNavigate} 
                  onToggleCollect={onToggleCollect} 
                  onToggleFollow={onToggleFollow} 
                  t={t}
                />
              ))
            ) : <p className="col-span-full py-20 text-center text-gray-300 font-black border-2 border-dashed border-gray-200 uppercase tracking-widest">{t.no_algs}</p>}
          </div>
        )}

        {activeTab === 'following' && (
          <div className="space-y-4 max-w-2xl">
            {viewUser.following.length > 0 ? (
              viewUser.following.map(username => (
                <div key={username} className="flex items-center justify-between border border-black p-6 hover:bg-gray-50 transition-all">
                  <span className="font-black text-lg underline cursor-pointer" onClick={() => onNavigate('profile', { user: username })}>@{username}</span>
                  {isSelf && (
                    <button 
                      onClick={() => onToggleFollow(username)}
                      className="text-[10px] font-black underline tracking-widest uppercase hover:text-gray-400"
                    >
                      UNFOLLOW
                    </button>
                  )}
                </div>
              ))
            ) : <p className="py-20 text-center text-gray-300 font-black border-2 border-dashed border-gray-200 uppercase tracking-widest">{t.not_following}</p>}
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6 max-w-4xl">
            {userComments.length > 0 ? (
              userComments.map(comment => (
                <div key={comment.id} className="border border-black p-6 relative group">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">FORMULA REF: {comment.algorithm_id}</span>
                    <span className="text-[10px] font-black uppercase text-gray-400">{comment.create_time}</span>
                  </div>
                  <p className="font-medium text-lg mb-6">{comment.content}</p>
                  <button 
                    className="text-[10px] font-black underline tracking-widest uppercase hover:no-underline"
                    onClick={() => onNavigate('detail', { id: comment.algorithm_id })}
                  >
                    VIEW CONTEXT
                  </button>
                </div>
              ))
            ) : <p className="py-20 text-center text-gray-300 font-black border-2 border-dashed border-gray-200 uppercase tracking-widest">{t.no_activity}</p>}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
