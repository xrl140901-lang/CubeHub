

import React, { useState } from 'react';
import { CUBE_TYPES, CATEGORIES } from '../types';

interface UploadProps {
  onUpload: (data: { cube_type: string, title: string, category: string, algorithm: string, images: string[] }) => void;
  onNavigate: (page: string) => void;
  t: any;
}

const Upload: React.FC<UploadProps> = ({ onUpload, onNavigate, t }) => {
  const [formData, setFormData] = useState({
    cube_type: CUBE_TYPES[1],
    title: '',
    category: CATEGORIES[0],
    algorithm: ''
  });
  const [images, setImages] = useState<string[]>([]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    if (images.length + files.length > 6) {
      alert(t.max_images_reached);
      return;
    }

    // Fix: Explicitly type file as File to avoid 'unknown' being passed to readAsDataURL
    Array.from(files).forEach((file: File) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages(prev => [...prev, reader.result as string].slice(0, 6));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.algorithm) {
      return;
    }
    onUpload({ ...formData, images });
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <h1 className="text-5xl font-black mb-12 tracking-tighter uppercase">{t.share_formula}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-10">
        <div className="space-y-6">
          <div>
            <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{t.title}</label>
            <input 
              type="text" 
              className="w-full border-2 border-black p-4 bg-white text-black focus:outline-none focus:ring-0 text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{t.cube_type}</label>
              <select 
                className="w-full border-2 border-black p-4 bg-white text-black focus:outline-none appearance-none cursor-pointer text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                value={formData.cube_type}
                onChange={(e) => setFormData({...formData, cube_type: e.target.value})}
              >
                {CUBE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{t.category}</label>
              <select 
                className="w-full border-2 border-black p-4 bg-white text-black focus:outline-none appearance-none cursor-pointer text-sm font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
              >
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{t.algorithm_moves}</label>
            <textarea 
              className="w-full border-2 border-black p-4 min-h-[160px] font-mono bg-white text-black focus:outline-none focus:ring-0 text-lg font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              value={formData.algorithm}
              onChange={(e) => setFormData({...formData, algorithm: e.target.value})}
              required
            ></textarea>
          </div>

          <div>
            <label className="block text-[10px] font-black mb-2 uppercase tracking-[0.2em]">{t.upload_images}</label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className="relative aspect-square border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <img src={img} className="w-full h-full object-cover" alt="Preview" />
                  <button 
                    type="button"
                    onClick={() => removeImage(idx)}
                    className="absolute top-1 right-1 bg-black text-white text-[8px] font-black px-1 py-0.5"
                  >
                    {t.remove_image}
                  </button>
                </div>
              ))}
              {images.length < 6 && (
                <label className="aspect-square border-2 border-dashed border-black flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <i className="fa fa-plus text-xl mb-1"></i>
                  <span className="text-[10px] font-black uppercase tracking-widest">{images.length}/6</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 pt-4 border-t-2 border-black pt-10">
          <button 
            type="submit" 
            className="flex-grow bg-black text-white py-5 font-black tracking-widest hover:bg-gray-800 transition-all shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)] active:translate-x-1 active:translate-y-1 active:shadow-none uppercase text-xs"
          >
            {t.publish}
          </button>
          <button 
            type="button"
            onClick={() => onNavigate('home')}
            className="px-12 border-2 border-black font-black tracking-widest hover:bg-gray-100 transition-all uppercase text-xs py-5"
          >
            {t.cancel}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Upload;
