import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Leaf, ArrowRight, TrendingUp, ShoppingCart, BarChart3 } from 'lucide-react';

export default function Welcome() {
    const navigate = useNavigate();

    const features = [
        { icon: ShoppingCart, text: 'Registra compras y ventas' },
        { icon: TrendingUp, text: 'Calcula ganancias al instante' },
        { icon: BarChart3, text: 'Analiza tu rendimiento' },
    ];

    return (
        <div className="min-h-screen flex flex-col overflow-hidden relative" style={{ background: 'linear-gradient(135deg, #22C55E 0%, #16A34A 50%, #15803D 100%)' }}>
            {/* Animated particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div
                    key={i}
                    className="absolute rounded-full bg-white/10"
                    style={{
                        width: Math.random() * 20 + 5,
                        height: Math.random() * 20 + 5,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.3, 0.8, 0.3],
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 2,
                    }}
                />
            ))}

            <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
                {/* Logo */}
                <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                    className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6 shadow-xl"
                >
                    <Leaf className="w-10 h-10 text-white" />
                </motion.div>

                {/* Title */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-4xl font-bold text-white mb-2 text-center"
                >
                    VerdurasPro
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                    className="text-green-100 text-center mb-10 text-lg"
                >
                    Tu negocio de verduras, simplificado
                </motion.p>

                {/* Features */}
                <div className="space-y-3 mb-10 w-full max-w-xs">
                    {features.map((f, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.9 + i * 0.15 }}
                            className="flex items-center gap-3 bg-white/15 backdrop-blur-sm rounded-xl px-4 py-3"
                        >
                            <f.icon className="w-5 h-5 text-white flex-shrink-0" />
                            <span className="text-white text-sm font-medium">{f.text}</span>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3, duration: 0.5 }}
                >
                    <Button
                        onClick={() => navigate('/login')}
                        className="h-14 px-10 rounded-2xl text-lg font-bold shadow-2xl hover:shadow-3xl transition-all duration-300 bg-white text-green-700 hover:bg-white/90 gap-3"
                    >
                        Iniciar Sesión
                        <ArrowRight size={22} />
                    </Button>
                </motion.div>
            </div>

            {/* Footer */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.5 }}
                className="text-center pb-8 relative z-10"
            >
                <p className="text-green-200 text-xs">© 2026 VerdurasPro</p>
            </motion.div>
        </div>
    );
}
