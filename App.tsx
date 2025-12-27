
import React, { useState, useEffect } from 'react';
import { User, Algorithm, Comment, Page } from './types';
import { StorageService } from './services/storage';
import { translations } from './translations';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Upload from './pages/Upload';
import Profile from './pages/Profile';
import About from './pages/About';
import AlgorithmDetail from './pages/AlgorithmDetail';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [pageParams, setPageParams] = useState<any>({});
  const [currentUser, setCurrentUser] = useState<User | null>(StorageService.getCurrentUser());
  const [algorithms, setAlgorithms] = useState<Algorithm[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [lang, setLang] = useState<'en' | 'zh'>(StorageService.getLanguage());
  const [loading, setLoading] = useState<boolean>(true);

  const t = translations[lang];

  // 初始化获取云端数据
  const fetchData = async () => {
    setLoading(true);
    try {
      const [algs, comms] = await Promise.all([
        StorageService.getAlgorithms(),
        StorageService.getComments()
      ]);
      setAlgorithms(algs);
      setComments(comms);
    } catch (e) {
      console.error("Data fetch error", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const [page, queryString] = hash.split('?');
      const params = new URLSearchParams(queryString);
      const paramsObj = Object.fromEntries(params.entries());

      if (['home', 'login', 'register', 'upload', 'profile', 'about', 'detail'].includes(page)) {
        setCurrentPage(page as Page);
        setPageParams(paramsObj);
      } else {
        setCurrentPage('home');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const navigate = (page: string, params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    window.location.hash = query ? `${page}?${query}` : page;
  };

  const handleLogout = () => {
    StorageService.setCurrentUser(null);
    setCurrentUser(null);
    navigate('home');
  };

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'zh' : 'en';
    setLang(newLang);
    StorageService.setLanguage(newLang);
  };

  const toggleCollect = (id: string) => {
    if (!currentUser) {
      alert(lang === 'zh' ? "请先登录以收藏公式。" : "Please login to save algorithms.");
      navigate('login');
      return;
    }
    const updatedUser = { ...currentUser };
    if (updatedUser.collections.includes(id)) {
      updatedUser.collections = updatedUser.collections.filter(cid => cid !== id);
    } else {
      updatedUser.collections.push(id);
    }
    StorageService.updateUserInList(updatedUser);
    setCurrentUser(updatedUser);
  };

  const toggleFollow = (username: string) => {
    if (!currentUser) {
      alert(lang === 'zh' ? "请先登录以关注贡献者。" : "Please login to follow contributors.");
      navigate('login');
      return;
    }
    if (currentUser.username === username) {
      alert(lang === 'zh' ? "你不能关注你自己。" : "You cannot follow yourself.");
      return;
    }
    const updatedUser = { ...currentUser };
    if (updatedUser.following.includes(username)) {
      updatedUser.following = updatedUser.following.filter(u => u !== username);
    } else {
      updatedUser.following.push(username);
    }
    StorageService.updateUserInList(updatedUser);
    setCurrentUser(updatedUser);
  };

  const handleUpload = async (data: { cube_type: string, title: string, category: string, algorithm: string, images: string[] }) => {
    if (!currentUser) return;
    const newAlg: Algorithm = {
      id: Date.now().toString(),
      ...data,
      contributor: currentUser.username,
      stars: 0,
      comment_ids: []
    };
    
    setLoading(true);
    const success = await StorageService.saveAlgorithm(newAlg);
    if (success) {
      setAlgorithms(prev => [...prev, newAlg]);
      navigate('home');
    } else {
      alert("Upload failed. Database connection error.");
    }
    setLoading(false);
  };

  const handleAddComment = async (content: string) => {
    if (!currentUser || !pageParams.id) return;
    const newComment: Comment = {
      id: Date.now().toString(),
      algorithm_id: pageParams.id,
      content,
      author: currentUser.username,
      create_time: new Date().toLocaleString(lang === 'zh' ? 'zh-CN' : 'en-US'),
      like_count: 0
    };

    const success = await StorageService.saveComment(newComment);
    if (success) {
      setComments(prev => [...prev, newComment]);
      // 此处简化，不修改算法表，直接由前端按 algorithm_id 过滤
    }
  };

  const handleDeleteComment = (id: string) => {
    // 简化处理：目前只在本地列表移除，云端删除逻辑需配合 Supabase Delete API
    setComments(prev => prev.filter(c => c.id !== id));
  };

  const renderPage = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-40">
          <div className="w-16 h-16 bg-black animate-ping mb-8"></div>
          <p className="font-black tracking-[0.3em] uppercase animate-pulse">Synchronizing with Hub...</p>
        </div>
      );
    }

    switch (currentPage) {
      case 'home':
        return <Home 
          algorithms={algorithms} 
          currentUser={currentUser} 
          onNavigate={navigate} 
          onToggleCollect={toggleCollect} 
          onToggleFollow={toggleFollow}
          t={t}
        />;
      case 'login':
        return <Login 
          onLogin={(user) => { setCurrentUser(user); navigate('home'); }} 
          onNavigate={navigate} 
          t={t}
        />;
      case 'register':
        return <Register onNavigate={navigate} t={t} />;
      case 'upload':
        if (!currentUser) return <Login onLogin={(user) => { setCurrentUser(user); navigate('home'); }} onNavigate={navigate} t={t} />;
        return <Upload onUpload={handleUpload} onNavigate={navigate} t={t} />;
      case 'profile':
        const allUsers = StorageService.getUsers();
        const profileUser = pageParams.user ? allUsers.find(u => u.username === pageParams.user) || null : currentUser;
        return <Profile 
          viewUser={profileUser} 
          currentUser={currentUser} 
          algorithms={algorithms} 
          comments={comments} 
          onNavigate={navigate}
          onToggleCollect={toggleCollect}
          onToggleFollow={toggleFollow}
          t={t}
        />;
      case 'about':
        return <About t={t} />;
      case 'detail':
        const alg = algorithms.find(a => a.id === pageParams.id);
        if (!alg) return <div className="text-center py-20 font-black">{lang === 'zh' ? '未找到公式' : 'ALGORITHM NOT FOUND'}</div>;
        return <AlgorithmDetail 
          algorithm={alg} 
          currentUser={currentUser} 
          comments={comments} 
          onAddComment={handleAddComment} 
          onDeleteComment={handleDeleteComment} 
          onToggleCollect={toggleCollect} 
          onToggleFollow={toggleFollow} 
          onNavigate={navigate}
          t={t}
        />;
      default:
        return <Home algorithms={algorithms} currentUser={currentUser} onNavigate={navigate} onToggleCollect={toggleCollect} onToggleFollow={toggleFollow} t={t} />;
    }
  };

  return (
    <div className="min-h-screen pb-20">
      <Navbar 
        currentUser={currentUser} 
        onLogout={handleLogout} 
        onNavigate={navigate} 
        toggleLanguage={toggleLanguage} 
        lang={lang}
        t={t}
      />
      <main>
        {renderPage()}
      </main>
    </div>
  );
};

export default App;
