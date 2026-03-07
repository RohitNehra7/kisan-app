import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiFetch } from '../services/api';

interface Post {
  id: string;
  author: string;
  district: string;
  crop: string;
  price: number;
  message: string;
  created_at: string;
  likes: number;
}

const FarmerForum: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPost, setNewPost] = useState({ crop: 'Wheat', price: '', message: '' });
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await apiFetch('/api/forum/posts');
      const result = await response.json();
      if (result.success) setPosts(result.data);
    } catch (err) {
      console.error('Failed to fetch posts:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const postData = {
        author: 'Anonymous Farmer',
        district: 'Hisar',
        crop: newPost.crop,
        price: parseFloat(newPost.price),
        message: newPost.message
      };

      const response = await apiFetch('/api/forum/posts', {
        method: 'POST',
        body: JSON.stringify(postData)
      });
      
      const result = await response.json();
      if (result.success) {
        setPosts([result.data, ...posts]);
        setNewPost({ crop: 'Wheat', price: '', message: '' });
        setShowAdd(false);
      }
    } catch (err) {
      console.error('Failed to post update:', err);
    }
  };

  const formatTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000 / 60); // minutes
    if (diff < 1) return 'Just now';
    if (diff < 60) return `${diff}m ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 pb-32">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h1 className="text-4xl font-black text-primary italic uppercase tracking-tighter leading-none">Kisan Chaupal</h1>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 ml-1">Connect with 10,000+ Haryana Farmers</p>
        </div>
        <button 
          onClick={() => setShowAdd(!showAdd)}
          className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl shadow-xl transition-all active:scale-90 ${showAdd ? 'bg-slate-900 text-white rotate-45' : 'bg-primary text-white shadow-primary/20'}`}
        >
          ➕
        </button>
      </div>

      <AnimatePresence>
        {showAdd && (
          <motion.div 
            initial={{ height: 0, opacity: 0, scale: 0.95 }}
            animate={{ height: 'auto', opacity: 1, scale: 1 }}
            exit={{ height: 0, opacity: 0, scale: 0.95 }}
            className="overflow-hidden mb-10"
          >
            <form onSubmit={handlePost} className="bg-white border border-slate-200 rounded-[2.5rem] p-8 flex flex-col gap-5 shadow-2xl">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Crop Name</label>
                  <input type="text" value={newPost.crop} onChange={e => setNewPost({...newPost, crop: e.target.value})} className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary/20" placeholder="e.g. Wheat" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Price (₹)</label>
                  <input type="number" value={newPost.price} onChange={e => setNewPost({...newPost, price: e.target.value})} className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold focus:ring-2 focus:ring-primary/20" placeholder="0.00" />
                </div>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Your Update</label>
                <textarea value={newPost.message} onChange={e => setNewPost({...newPost, message: e.target.value})} className="bg-slate-50 border-none rounded-2xl px-5 py-4 font-bold h-32 focus:ring-2 focus:ring-primary/20" placeholder="What's happening in your mandi today?" />
              </div>
              <button type="submit" className="bg-primary text-white py-5 rounded-3xl font-black uppercase tracking-tight shadow-xl shadow-primary/20 hover:bg-slate-900 transition-colors">Post to Community</button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex flex-col gap-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <div className="w-10 h-10 border-4 border-primary/10 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-400 font-black uppercase text-[10px] tracking-widest">Gathering Community Intelligence...</p>
          </div>
        ) : posts.map((post, i) => (
          <motion.div 
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-[2rem] border border-slate-100 p-8 shadow-sm hover:shadow-xl transition-all duration-300 group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-2xl group-hover:bg-primary/5 transition-colors">👤</div>
                <div>
                  <h4 className="font-black text-slate-900 text-lg leading-none">{post.author}</h4>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{post.district} • {formatTime(post.created_at)}</p>
                </div>
              </div>
              <span className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tight border border-emerald-100 italic">
                {post.crop} @ ₹{post.price.toLocaleString()}
              </span>
            </div>
            <p className="text-slate-600 font-medium leading-relaxed mb-6 text-lg">"{post.message}"</p>
            <div className="flex items-center gap-6 pt-6 border-t border-slate-50">
              <button className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-all active:scale-90">
                <span className="text-2xl">❤️</span>
                <span className="text-xs font-black">{post.likes}</span>
              </button>
              <button className="flex items-center gap-2 text-slate-400 hover:text-primary transition-all active:scale-90">
                <span className="text-2xl">💬</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Discussion</span>
              </button>
              <button className="ml-auto text-slate-300 hover:text-primary transition-colors">
                <span className="text-xl">🔖</span>
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FarmerForum;
