import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db, isFirebaseEnabled } from '../config/firebase';
import { getDefaultUsers } from '../data/mockFacilities';

const AuthContext = createContext(null);

const USERS_KEY = 'sportsN_users';
const SESSION_KEY = 'sportsN_currentUser';

function initFallbackUsers() {
  if (!localStorage.getItem(USERS_KEY)) {
    localStorage.setItem(USERS_KEY, JSON.stringify(getDefaultUsers()));
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  const isAdmin = currentUser?.role === 'admin';

  useEffect(() => {
    if (isFirebaseEnabled) {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            const userDoc = await getDoc(doc(db, 'users', user.uid));
            const userData = {
              uid: user.uid,
              name: user.displayName || '사용자',
              email: user.email,
              phone: '010-0000-0000',
              role: 'user',
            };
            if (userDoc.exists()) {
              Object.assign(userData, userDoc.data());
            }
            setCurrentUser(userData);
          } catch (err) {
            console.error('Error fetching user doc:', err);
            setCurrentUser({
              uid: user.uid,
              name: user.displayName || '사용자',
              email: user.email,
              phone: '010-0000-0000',
              role: 'user',
            });
          }
        } else {
          setCurrentUser(null);
          setIsAdminMode(false);
        }
        setLoading(false);
      });
      return () => unsubscribe();
    }

    initFallbackUsers();
    const stored =
      sessionStorage.getItem(SESSION_KEY) || localStorage.getItem(SESSION_KEY);
    if (stored) {
      setCurrentUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const register = useCallback(async ({ name, email, phone, password }) => {
    const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';

    if (isFirebaseEnabled) {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      await setDoc(doc(db, 'users', cred.user.uid), { name, email, phone, role });
      return cred.user;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    if (users.some((u) => u.email === email)) {
      throw new Error('이미 가입된 이메일 주소입니다.');
    }
    users.push({ name, email, phone, password, role });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }, []);

  const login = useCallback(async ({ email, password }) => {
    if (isFirebaseEnabled) {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      return cred.user;
    }

    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const user = users.find((u) => u.email === email && u.password === password);
    if (!user) {
      throw new Error('이메일 또는 비밀번호가 잘못되었습니다.');
    }
    const { password: _, ...safeUser } = user;
    setCurrentUser(safeUser);
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(safeUser));
    return safeUser;
  }, []);

  const loginWithGoogle = useCallback(async () => {
    if (!isFirebaseEnabled) {
      throw new Error('Google 로그인은 Firebase 환경에서만 지원됩니다.');
    }

    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    const userDoc = await getDoc(doc(db, 'users', user.uid));
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        name: user.displayName || 'Google User',
        email: user.email,
        phone: '010-0000-0000',
        role: user.email?.includes('admin') ? 'admin' : 'user',
      });
    }
    return user;
  }, []);

  const logout = useCallback(async () => {
    setIsAdminMode(false);
    if (isFirebaseEnabled) {
      await signOut(auth);
    } else {
      setCurrentUser(null);
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY);
    }
  }, []);

  const toggleAdminMode = useCallback((checked) => {
    setIsAdminMode(checked);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        isAdmin,
        isAdminMode,
        isFirebaseEnabled,
        register,
        login,
        loginWithGoogle,
        logout,
        toggleAdminMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
