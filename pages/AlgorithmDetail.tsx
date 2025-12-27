
import React, { useState } from 'react';
import { Algorithm, User, Comment } from '../types';

interface AlgorithmDetailProps {
  algorithm: Algorithm;
  currentUser: User | null;
  comments: Comment[];
  onAddComment: (content: string) => void;
  onDeleteComment: (id: string) => void;
  onToggleCollect: (id: string) => void;
  onToggleFollow: (username: string) => void;
  onNavigate: (page: string, params?: any) => void;
  t: any;
}

const AlgorithmDetail: React.FC<AlgorithmDetailProps> = ({
  algorithm,
  currentUser,
  comments,
  onAddComment,
  onDeleteComment,
  onToggleCollect,
  onToggleFollow,
  onNavigate,
  t
}) => {
  const [newComment, setNewComment] = useState('');
  const algComments = comments.filter(c => c.algorithm_id === algorithm.id).sort((a, b) => b.create_time.localeCompare(a.create_time));
  
  const isCollected = currentUser?.collections.includes(algorithm.id);
  const isFollowing = currentUser?.following.includes(algorithm.contributor);
  const isOwn = currentUser?.username === algorithm.contributor;

  const handleSubmitComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      onNavigate('login');
      return;
    }
    if (!newComment.trim()) return;
    onAddComment(newComment);
    setNewComment('');
  };

  return (
    <div className="max-w-4xl mx-auto px-6 mb-20">
      <div className="mb-10">
        <button onClick={() => onNavigate('home')} className="text-[10px] font-black flex items-center space-x-2 mb-8 hover:underline tracking-widest uppercase">
          <i className="fa fa-arrow-left"></i>
          <span>{t.back_to_list}</span>
        </button>

        <div className="border-l-8 border-black pl-8 mb-12">
          <div className="flex items-center space-x-3 mb-2">
            <span className="bg-black text-white text-[10px] px-2 py-0.5 font-bold uppercase">{algorithm.cube_type}</span>
            <span className="text-gray-400 font-bold text-[10px] uppercase">{algorithm.category}</span>
          </div>
          <h1 className="text-6xl font-black tracking-tighter mb-4 uppercase">{algorithm.title}</h1>
          <div className="flex items-center space-x-4 text-[10px] font-black">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500 uppercase">{t.by}</span>
              <span className="underline cursor-pointer" onClick={() => onNavigate('profile', { user: algorithm.contributor })}>
                {algorithm.contributor}
              </span>
            </div>
            {!isOwn && (
              <button 
                onClick={() => onToggleFollow(algorithm.contributor)}
                className={`px-3 py-1 border-2 border-black transition-colors ${isFollowing ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
              >
                {isFollowing ? t.following : t.follow}
              </button>
            )}
          </div>
        </div>

        <div className="bg-gray-50 border-2 border-black p-8 text-3xl md:text-4xl font-mono leading-tight break-words shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] mb-16 relative">
          <div className="absolute -top-4 -right-4 bg-white border-2 border-black px-3 py-1 text-[10px] font-black tracking-widest uppercase">FORMULA</div>
          {algorithm.algorithm}
        </div>

        {algorithm.images && algorithm.images.length > 0 && (
          <div className="mb-16">
            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-6 border-b-2 border-black pb-2 inline-block">
              {t.images_label}
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {algorithm.images.map((img, idx) => (
                <div key={idx} className="border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <img src={img} className="w-full h-auto" alt={`Step ${idx + 1}`} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex space-x-4 mb-20">
          <button 
            onClick={() => onToggleCollect(algorithm.id)}
            className={`flex-grow py-5 border-2 border-black font-black flex items-center justify-center space-x-2 transition-all uppercase tracking-widest ${isCollected ? 'bg-black text-white shadow-none' : 'bg-white hover:bg-gray-100 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] active:shadow-none'}`}
          >
            <i className={`fa ${isCollected ? 'fa-bookmark' : 'fa-bookmark-o'}`}></i>
            <span>{isCollected ? t.collected : t.collect}</span>
          </button>
        </div>
      </div>

      <div className="border-t-4 border-black pt-12">
        <h2 className="text-3xl font-black mb-12 uppercase tracking-tighter">{t.comments} ({algComments.length})</h2>
        
        <form onSubmit={handleSubmitComment} className="mb-12">
          <textarea 
            className="w-full border-2 border-black p-6 min-h-[140px] bg-white text-black focus:outline-none focus:ring-0 mb-6 text-sm font-bold shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
            placeholder={currentUser ? "Share your thoughts on this algorithm..." : "Login to join the discussion..."}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            disabled={!currentUser}
          ></textarea>
          <div className="flex justify-end">
            <button 
              type="submit"
              disabled={!currentUser || !newComment.trim()}
              className={`px-12 py-4 bg-black text-white font-black tracking-widest transition-all text-xs uppercase ${(!currentUser || !newComment.trim()) ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-800'}`}
            >
              {t.post_comment}
            </button>
          </div>
        </form>

        <div className="space-y-10">
          {algComments.length > 0 ? (
            algComments.map(comment => (
              <div key={comment.id} className="border-2 border-black p-8 bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-black flex items-center justify-center text-white text-xs font-black">
                      {comment.author[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-black text-sm underline cursor-pointer uppercase" onClick={() => onNavigate('profile', { user: comment.author })}>
                        {comment.author}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{comment.create_time}</div>
                    </div>
                  </div>
                  {currentUser?.username === comment.author && (
                    <button 
                      onClick={() => onDeleteComment(comment.id)}
                      className="text-red-500 hover:text-red-700 text-[10px] font-black uppercase tracking-widest underline"
                    >
                      {t.delete}
                    </button>
                  )}
                </div>
                <p className="text-black leading-relaxed font-bold">{comment.content}</p>
              </div>
            ))
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmDetail;
