import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

const API_URL = import.meta.env.VITE_API_URL || 'http://192.168.1.149:3001';
const AUTH_STORAGE_KEY = 'verduras_pro_auth_user_v1';

interface DemoUser {
    displayName: string;
    email: string;
    uid: string;
}

interface AuthContextType {
    user: DemoUser | null;
    loading: boolean;
    signIn: (usuario: string, password: string) => Promise<void>;
    signUp: (nombre: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getSavedUser(): DemoUser | null {
    try {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    return {
        displayName: 'La Primavera (Administrador)',
        email: 'vero@verduraspro.com',
        uid: 'owner-001',
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<DemoUser | null>(getSavedUser);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, [user]);

    const signIn = async (usuario: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch(API_URL + '/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ usuario, password }),
            });
            const data = await res.json();
            if (!res.ok) throw { code: 'auth/wrong-password', message: data.error };
            const loggedUser = {
                displayName: data.displayName,
                email: 'vero@verduraspro.com',
                uid: 'owner-001',
            };
            setUser(loggedUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
        } finally {
            setLoading(false);
        }
    };

    const signUp = async (nombre: string, password: string) => {
        setLoading(true);
        try {
            const res = await fetch(API_URL + '/api/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nombre, password }),
            });
            const data = await res.json();
            if (!res.ok) throw { code: 'auth/register-failed', message: data.error };
            const loggedUser = {
                displayName: data.displayName,
                email: 'vero@verduraspro.com',
                uid: 'owner-001',
            };
            setUser(loggedUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        setUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
    };

    return (
        <AuthContext.Provider value={{ user, loading, signIn, signUp, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
