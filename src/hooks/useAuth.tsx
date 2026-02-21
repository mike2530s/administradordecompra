import { createContext, useContext, useState, type ReactNode } from 'react';

// Credenciales fijas
const USUARIO = 'El Mike';
const PASSWORD = 'Miguel1nmiguel0n';

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

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<DemoUser | null>(null);
    const [loading] = useState(false);

    const signIn = async (usuario: string, password: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        if (usuario === USUARIO && password === PASSWORD) {
            setUser({
                displayName: 'El Mike',
                email: 'mike@verduraspro.com',
                uid: 'mike-001',
            });
        } else {
            throw { code: 'auth/wrong-password' };
        }
    };

    const signUp = async (_email: string, _password: string, nombre: string, _negocio: string) => {
        await new Promise(resolve => setTimeout(resolve, 800));
        setUser({
            displayName: nombre,
            email: 'mike@verduraspro.com',
            uid: 'mike-001',
        });
    };

    const signOut = async () => {
        setUser(null);
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
