import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Leaf, ArrowRight, ArrowLeft, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const { signIn } = useAuth();
    const navigate = useNavigate();
    const [usuario, setUsuario] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await signIn(usuario, password);
        } catch {
            setError('Usuario o contraseña incorrectos');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)' }}>
            {/* Particles */}
            {[...Array(12)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        width: Math.random() * 15 + 5,
                        height: Math.random() * 15 + 5,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.2, 0.6, 0.2],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <div className="flex-1 flex items-center justify-center px-6 py-12 relative z-10">
                <motion.div
                    className="w-full max-w-sm"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            transition={{ type: 'spring', stiffness: 200 }}
                            className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 shadow-lg"
                        >
                            <Leaf className="w-8 h-8 text-white" />
                        </motion.div>
                        <h1 className="text-2xl font-bold text-white">VerdurasPro</h1>
                        <p className="text-green-100 text-sm mt-1">Ingresa tus credenciales</p>
                    </div>

                    {/* Login Card */}
                    <Card className="border-0 shadow-2xl rounded-2xl bg-white dark:bg-gray-900">
                        <CardContent className="p-6">
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="space-y-2">
                                    <Label htmlFor="usuario" className="text-gray-700 dark:text-gray-300 text-sm font-medium">Usuario</Label>
                                    <Input
                                        id="usuario"
                                        type="text"
                                        placeholder="Tu nombre de usuario"
                                        value={usuario}
                                        onChange={(e) => setUsuario(e.target.value)}
                                        required
                                        className="h-12 rounded-xl border-gray-200 dark:border-gray-700 focus:border-green-400 focus:ring-green-400 bg-gray-50/50 dark:bg-gray-800 placeholder:text-gray-400"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-700 dark:text-gray-300 text-sm font-medium">Contraseña</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            type={showPassword ? 'text' : 'password'}
                                            placeholder="Tu contraseña"
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            required
                                            className="h-12 rounded-xl pr-12 border-gray-200 dark:border-gray-700 focus:border-green-400 focus:ring-green-400 bg-gray-50/50 dark:bg-gray-800 placeholder:text-gray-400"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                        >
                                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                        </button>
                                    </div>
                                </div>

                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="bg-red-50 dark:bg-red-950 text-red-600 text-sm px-4 py-3 rounded-xl text-center font-medium"
                                    >
                                        {error}
                                    </motion.div>
                                )}

                                <Button
                                    type="submit"
                                    disabled={loading || !usuario || !password}
                                    className="w-full h-12 rounded-xl font-bold text-base gap-2"
                                    style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 100%)' }}
                                >
                                    {loading ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <>
                                            Entrar
                                            <ArrowRight size={18} />
                                        </>
                                    )}
                                </Button>
                            </form>

                            <button
                                onClick={() => navigate('/welcome')}
                                className="w-full flex items-center justify-center gap-2 mt-5 text-sm text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <ArrowLeft size={16} /> Volver al inicio
                            </button>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
