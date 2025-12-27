
import { User, Algorithm, Comment } from '../types';

/** 
 * 【重要提示】
 * 要实现“所有人可见”，请按照以下步骤操作：
 * 1. 访问 https://supabase.com/ 并创建一个免费项目。
 * 2. 在项目设置 (Settings -> API) 中找到 Project URL 和 API Key。
 * 3. 将其粘贴到下方变量中。
 */
// Fix: Add explicit : string type to prevent TypeScript from treating these as literal types which causes comparison errors in isCloudEnabled
const SUPABASE_URL: string = ''; // 示例: https://xyz.supabase.co
const SUPABASE_ANON_KEY: string = 'sb_publishable_7AadCVbWR7J-5Wyzor1H4A_OMxcbWhK'; // 你提供的 Key

const USERS_KEY = 'cubehub_users';
const CURRENT_USER_KEY = 'currentUser';
const LANG_KEY = 'cubehub_lang';

export const StorageService = {
  // 检查是否已配置云端
  isCloudEnabled: (): boolean => SUPABASE_URL !== '' && SUPABASE_ANON_KEY !== '',

  // --- 用户相关 (保持 LocalStorage，因为本版本暂不涉及云端统一鉴权) ---
  getUsers: (): User[] => JSON.parse(localStorage.getItem(USERS_KEY) || '[]'),
  setUsers: (users: User[]) => localStorage.setItem(USERS_KEY, JSON.stringify(users)),
  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem(CURRENT_USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  },
  setCurrentUser: (user: User | null) => {
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  },
  updateUserInList: (updatedUser: User) => {
    const users = StorageService.getUsers();
    const idx = users.findIndex(u => u.id === updatedUser.id);
    if (idx !== -1) {
      users[idx] = updatedUser;
      StorageService.setUsers(users);
    }
    const current = StorageService.getCurrentUser();
    if (current && current.id === updatedUser.id) {
      StorageService.setCurrentUser(updatedUser);
    }
  },

  // --- 语言设置 ---
  getLanguage: (): 'en' | 'zh' => (localStorage.getItem(LANG_KEY) as 'en' | 'zh') || 'zh',
  setLanguage: (lang: 'en' | 'zh') => localStorage.setItem(LANG_KEY, lang),

  // --- 云端公式相关 (核心：全员共享) ---
  getAlgorithms: async (): Promise<Algorithm[]> => {
    if (!StorageService.isCloudEnabled()) {
      console.warn("CubeHub: Supabase URL missing. Falling back to local storage.");
      return JSON.parse(localStorage.getItem('cubehub_algorithms') || '[]');
    }
    
    try {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/algorithms?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      if (!resp.ok) throw new Error("Failed to fetch");
      return await resp.json();
    } catch (e) {
      console.error("Cloud fetch failed", e);
      return JSON.parse(localStorage.getItem('cubehub_algorithms') || '[]');
    }
  },

  saveAlgorithm: async (alg: Algorithm): Promise<boolean> => {
    // 同步到本地备份
    const local = JSON.parse(localStorage.getItem('cubehub_algorithms') || '[]');
    localStorage.setItem('cubehub_algorithms', JSON.stringify([...local, alg]));

    if (!StorageService.isCloudEnabled()) return true;

    try {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/algorithms`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({
          ...alg,
          created_at: new Date().toISOString()
        })
      });
      return resp.ok;
    } catch (e) {
      console.error("Cloud save failed", e);
      return false;
    }
  },

  // --- 云端评论相关 ---
  getComments: async (): Promise<Comment[]> => {
    if (!StorageService.isCloudEnabled()) return JSON.parse(localStorage.getItem('cubehub_comments') || '[]');
    
    try {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/comments?select=*&order=created_at.desc`, {
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
        }
      });
      return await resp.json();
    } catch (e) {
      return [];
    }
  },

  saveComment: async (comment: Comment): Promise<boolean> => {
    const local = JSON.parse(localStorage.getItem('cubehub_comments') || '[]');
    localStorage.setItem('cubehub_comments', JSON.stringify([...local, comment]));

    if (!StorageService.isCloudEnabled()) return true;

    try {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/comments`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...comment,
          created_at: new Date().toISOString()
        })
      });
      return resp.ok;
    } catch (e) {
      return false;
    }
  }
};
