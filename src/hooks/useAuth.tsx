import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

// Credenciales fijas
const USUARIO = 'El Mike';
const PASSWORD = 'Miguel1nmiguel0n';
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
    signUp: (email: string, password: string, nombre: string, negocio: string) => Promise<void>;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function getSavedUser(): DemoUser | null {
    try {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved) return JSON.parse(saved);
    } catch { /* ignore */ }
    // Default logged in as Owner so reload never logs out
    return {
        displayName: 'La Primavera (Dueña)',
        email: 'vero@verduraspro.com',
        uid: 'owner-001',
    };
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<DemoUser | null>(getSavedUser);
    const [loading] = useState(false);

    useEffect(() => {
        if (user) {
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
        } else {
            localStorage.removeItem(AUTH_STORAGE_KEY);
        }
    }, [user]);

    const signIn = async (usuario: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        if (usuario === USUARIO && password === PASSWORD) {
            const loggedUser = {
                displayName: 'La Primavera (Dueña)',
                email: 'vero@verduraspro.com',
                uid: 'owner-001',
            };
            setUser(loggedUser);
            localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
        } else {
            throw { code: 'auth/wrong-password' };
        }
    };

    const signUp = async (_email: string, _password: string, nombre: string, _negocio: string) => {
        await new Promise(resolve => setTimeout(resolve, 400));
        const loggedUser = {
            displayName: nombre || 'La Primavera (Dueña)',
            email: 'vero@verduraspro.com',
            uid: 'owner-001',
        };
        setUser(loggedUser);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(loggedUser));
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
