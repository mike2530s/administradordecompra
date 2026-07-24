import { useState, useMemo, useEffect } from 'react';
import { useProductos, type Producto } from '@/hooks/useProductos';
import { ShoppingBag, Plus, Minus, Check, Sparkles, Clock, Phone, User, Store, ShieldCheck, Download, Smartphone, Banknote, CreditCard, Zap, Share2, ChevronUp, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CartItem {
    producto: Producto;
    cantidad: number; // en kg o unidades
}

export default function PedidoExpress() {
    const { productos } = useProductos();
    const [cart, setCart] = useState<Record<string, number>>({});

    // PWA Install Prompt state
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
    const [showInstallBanner, setShowInstallBanner] = useState(false);
    const [showIOSInstructions, setShowIOSInstructions] = useState(false);

    // Form fields for Pickup in Store
    const [nombre, setNombre] = useState('');
    const [telefono, setTelefono] = useState('');
    const [horaRecojoOption, setHoraRecojoOption] = useState('Lo antes posible (15-30 min)');

    // Stylized Custom Time Picker State
    const [pickerHora, setPickerHora] = useState(2); // 1-12
    const [pickerMinuto, setPickerMinuto] = useState(30); // 0, 15, 30, 45
    const [pickerPeriodo, setPickerPeriodo] = useState<'AM' | 'PM'>('PM');

    const [notas, setNotas] = useState('');
    const [metodoPago, setMetodoPago] = useState<'efectivo' | 'transferencia'>('efectivo');
    const [pedidoEnviado, setPedidoEnviado] = useState(false);

    // Format stylized time string
    const horaCustomFormatted = useMemo(() => {
        const h = pickerHora < 10 ? `0${pickerHora}` : `${pickerHora}`;
        const m = pickerMinuto < 10 ? `0${pickerMinuto}` : `${pickerMinuto}`;
        return `${h}:${m} ${pickerPeriodo}`;
    }, [pickerHora, pickerMinuto, pickerPeriodo]);

    // Quick preset time slots
    const timePresets = ['10:00 AM', '11:30 AM', '01:00 PM', '02:30 PM', '04:00 PM', '05:30 PM', '07:00 PM'];

    const applyPresetSlot = (slotStr: string) => {
        const parts = slotStr.split(' ');
        const timeParts = parts[0].split(':');
        setPickerHora(parseInt(timeParts[0], 10));
        setPickerMinuto(parseInt(timeParts[1], 10));
        setPickerPeriodo(parts[1] as 'AM' | 'PM');
    };

    // Detect PWA Install prompt on Android/Chrome & iOS
    useEffect(() => {
        const handleBeforeInstall = (e: Event) => {
            e.preventDefault();
            setDeferredPrompt(e);
            setShowInstallBanner(true);
        };

        window.addEventListener('beforeinstallprompt', handleBeforeInstall);

        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
        const isStandalone = window.matchMedia('(display-mode: standalone)').matches;

        if (isIOS && !isStandalone) {
            setShowInstallBanner(true);
        }

        return () => {
            window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        };
    }, []);

    const handleInstallPWA = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                setShowInstallBanner(false);
            }
            setDeferredPrompt(null);
        } else {
            setShowIOSInstructions(true);
        }
    };

    // Filter active/in-stock products
    const productosDisponibles = useMemo(() => {
        return productos.filter(p => (p.stockKg ?? 10) > 0);
    }, [productos]);

    const updateQuantity = (productoId: string, delta: number) => {
        setCart(prev => {
            const actual = prev[productoId] || 0;
            const producto = productos.find(p => p.id === productoId);
            const step = producto?.unidad === 'unidad' ? 1 : 0.5;
            const nueva = Math.max(0, actual + delta * step);

            if (nueva === 0) {
                const copy = { ...prev };
                delete copy[productoId];
                return copy;
            }
            return { ...prev, [productoId]: nueva };
        });
    };

    const cartItems: CartItem[] = useMemo(() => {
        return Object.entries(cart)
            .map(([id, cantidad]) => {
                const producto = productos.find(p => p.id === id);
                if (!producto) return null;
                return { producto, cantidad };
            })
            .filter((item): item is CartItem => item !== null);
    }, [cart, productos]);

    const totalOrder = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + (item.producto.precioVenta * item.cantidad), 0);
    }, [cartItems]);

    const totalArticulos = useMemo(() => {
        return cartItems.reduce((sum, item) => sum + item.cantidad, 0);
    }, [cartItems]);

    const handleSendWhatsAppOrder = (e: React.FormEvent) => {
        e.preventDefault();

        if (cartItems.length === 0) {
            alert('Por favor selecciona al menos una verdura para tu pedido.');
            return;
        }

        if (!nombre.trim() || !telefono.trim()) {
            alert('Por favor completa tu Nombre y Teléfono para tener listo tu pedido en la tienda.');
            return;
        }

        const displayHora = horaRecojoOption === 'personalizada' ? `A las ${horaCustomFormatted}` : horaRecojoOption;

        let message = `*PEDIDO VERDULERÍA LA PRIMAVERA*\n`;
        message += `-----------------------------------\n`;
        message += `*Cliente:* ${nombre}\n`;
        message += `*Teléfono:* ${telefono}\n`;
        message += `*Modalidad:* Recoger en Tienda / Local\n`;
        message += `*Hora estimada de recojo:* ${displayHora}\n`;
        message += `*Pago:* ${metodoPago === 'efectivo' ? 'Efectivo al recoger' : 'Transferencia Bancaria'}\n`;
        if (notas) message += `*Notas:* ${notas}\n`;
        message += `-----------------------------------\n`;
        message += `*VERDURAS A PREPARAR:*\n\n`;

        cartItems.forEach((item, index) => {
            const subtotal = item.producto.precioVenta * item.cantidad;
            const unidadLabel = item.producto.unidad === 'unidad' ? 'unid' : 'kg';
            message += `${index + 1}. *${item.producto.nombre}* - ${item.cantidad} ${unidadLabel} x $${item.producto.precioVenta} = *$${subtotal.toFixed(2)}*\n`;
        });

        message += `-----------------------------------\n`;
        message += `*TOTAL A PAGAR AL RECOGER:* *$${totalOrder.toFixed(2)} MXN*\n\n`;
        message += `¡Gracias! Paso a la tienda por mi pedido preparado.`;

        const shopPhone = '524151024887';
        const encodedMsg = encodeURIComponent(message);
        const waUrl = `https://wa.me/${shopPhone}?text=${encodedMsg}`;

        setPedidoEnviado(true);
        window.open(waUrl, '_blank');
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-800 pb-36 font-sans antialiased">
            {/* Header Banner - Official La Primavera Logo */}
            <header className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white shadow-lg sticky top-0 z-30 border-b border-emerald-600/30">
                <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                        <img
                            src="/logo.png"
                            alt="Verdulería La Primavera"
                            className="w-11 h-11 rounded-xl object-contain bg-white/95 p-1 shadow-md shrink-0 border border-emerald-200"
                        />
                        <div>
                            <h1 className="text-base sm:text-lg font-extrabold tracking-tight flex items-center gap-1.5 flex-wrap">
                                Verdulería La Primavera
                                <span className="bg-amber-400 text-emerald-950 text-[10px] uppercase font-black px-2 py-0.5 rounded-full tracking-wider shadow-xs">
                                    Frescos
                                </span>
                            </h1>
                            <p className="text-[11px] sm:text-xs text-emerald-100 flex items-center gap-1">
                                <Store className="w-3 h-3 shrink-0" /> Pide desde tu celular y pasa a recoger sin filas.
                            </p>
                        </div>
                    </div>

                    <a
                        href="/login"
                        className="text-xs font-semibold bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg border border-white/20 transition-all shrink-0"
                    >
                        Dueña
                    </a>
                </div>
            </header>

            <main className="max-w-4xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4">
                {/* PWA Install Banner */}
                {showInstallBanner && (
                    <motion.div
                        initial={{ scale: 0.95, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="bg-gradient-to-r from-emerald-900 to-teal-900 text-white p-3.5 rounded-2xl shadow-md flex items-center justify-between gap-3 border border-emerald-700/50"
                    >
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/30 flex items-center justify-center shrink-0 text-emerald-300">
                                <Smartphone className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-xs font-extrabold text-white flex items-center gap-1">
                                    Instalar App en Celular
                                </p>
                                <p className="text-[11px] text-emerald-200">
                                    Agrégala a tu pantalla de inicio para pedir en 1 segundo.
                                </p>
                            </div>
                        </div>

                        <button
                            onClick={handleInstallPWA}
                            className="px-3.5 py-2 bg-emerald-500 hover:bg-emerald-400 text-emerald-950 font-black text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all shrink-0 active:scale-95 cursor-pointer"
                        >
                            <Download className="w-3.5 h-3.5" />
                            <span>Instalar</span>
                        </button>
                    </motion.div>
                )}

                {/* Pickup Banner Notification */}
                <div className="bg-gradient-to-r from-emerald-500/10 via-emerald-400/5 to-transparent border-l-4 border-emerald-500 p-3 sm:p-4 rounded-r-xl shadow-xs flex items-start gap-2.5">
                    <Sparkles className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 animate-pulse" />
                    <div className="text-xs text-emerald-950 leading-relaxed">
                        <span className="font-bold">Ahorra tiempo:</span> Pide desde aquí tus verduras. Nosotros las pesamos y empaquetamos para que solo llegues a **pagar y recoger al local**.
                    </div>
                </div>

                {/* Section 1: Item Cards */}
                <section className="space-y-3">
                    <div className="flex items-center justify-between">
                        <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                            <span>1. Selecciona lo que vas a Recoger</span>
                            <span className="text-xs font-normal text-slate-500">({productosDisponibles.length})</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {productosDisponibles.map((producto) => {
                            const cantidadEnCarrito = cart[producto.id] || 0;
                            const isSelected = cantidadEnCarrito > 0;

                            return (
                                <motion.div
                                    key={producto.id}
                                    layout
                                    className={`relative bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs flex flex-col justify-between ${isSelected ? 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/10' : 'border-slate-200'
                                        }`}
                                >
                                    {/* Responsive Image Header */}
                                    <div className="relative h-40 sm:h-44 bg-slate-100 overflow-hidden group">
                                        <img
                                            src={producto.imagenUrl || 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80'}
                                            alt={producto.nombre}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent flex flex-col justify-between p-3">
                                            <div className="flex justify-between items-start">
                                                {producto.destacadoHoy && (
                                                    <span className="bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider flex items-center gap-1">
                                                        <Sparkles className="w-3 h-3" /> Foto de Hoy
                                                    </span>
                                                )}
                                                <span className="ml-auto bg-black/70 backdrop-blur-md text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                                                    ${producto.precioVenta.toFixed(2)} / {producto.unidad}
                                                </span>
                                            </div>
                                            <h3 className="text-base font-bold text-white drop-shadow-md">
                                                {producto.nombre}
                                            </h3>
                                        </div>
                                    </div>

                                    {/* Stepper */}
                                    <div className="p-3 bg-white flex items-center justify-between border-t border-slate-100">
                                        <div>
                                            <p className="text-[11px] text-slate-500 font-medium">
                                                Disponible: {producto.stockKg ?? 10} {producto.unidad}s
                                            </p>
                                            {isSelected && (
                                                <p className="text-xs font-extrabold text-emerald-600">
                                                    Subtotal: ${(producto.precioVenta * cantidadEnCarrito).toFixed(2)}
                                                </p>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-xl">
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(producto.id, -1)}
                                                disabled={!isSelected}
                                                className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-sm transition-all active:scale-90 ${isSelected
                                                        ? 'bg-white text-slate-800 shadow-xs hover:bg-slate-200'
                                                        : 'text-slate-300 cursor-not-allowed'
                                                    }`}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="w-11 text-center text-xs font-black text-slate-800">
                                                {cantidadEnCarrito > 0 ? `${cantidadEnCarrito} ${producto.unidad === 'unidad' ? '' : 'kg'}` : '0'}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => updateQuantity(producto.id, 1)}
                                                className="w-9 h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:scale-90 text-white flex items-center justify-center font-bold text-sm shadow-xs transition-all"
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </section>

                {/* Section 2: Pickup Form & Stylized Time Picker */}
                <section className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
                    <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
                        <span>2. Datos para Tener Listo tu Pedido en Tienda</span>
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    </h2>

                    <form onSubmit={handleSendWhatsAppOrder} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <User className="w-3.5 h-3.5 text-emerald-600" /> Tu Nombre *
                                </label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Ej: Doña María Pérez"
                                    value={nombre}
                                    onChange={e => setNombre(e.target.value)}
                                    className="w-full px-3.5 py-3 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <Phone className="w-3.5 h-3.5 text-emerald-600" /> Celular / WhatsApp *
                                </label>
                                <input
                                    type="tel"
                                    required
                                    placeholder="Ej: 55 1234 5678"
                                    value={telefono}
                                    onChange={e => setTelefono(e.target.value)}
                                    className="w-full px-3.5 py-3 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1">
                                    <Clock className="w-3.5 h-3.5 text-emerald-600" /> ¿A qué hora pasas a recoger?
                                </label>
                                <select
                                    value={horaRecojoOption}
                                    onChange={e => setHoraRecojoOption(e.target.value)}
                                    className="w-full px-3.5 py-3 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none font-semibold text-slate-800"
                                >
                                    <option value="Lo antes posible (15-30 min)">Lo antes posible (15-30 min)</option>
                                    <option value="En 1 hora">En 1 hora</option>
                                    <option value="Por la tarde (después de 4pm)">Por la tarde (después de 4pm)</option>
                                    <option value="Mañana por la mañana">Mañana por la mañana</option>
                                    <option value="personalizada">Elegir hora exacta (Selector Estilizado)</option>
                                </select>
                            </div>
                        </div>

                        {/* STYLIZED TIME PICKER CARD */}
                        <AnimatePresence>
                            {horaRecojoOption === 'personalizada' && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-gradient-to-br from-emerald-50 via-teal-50/60 to-slate-50 border-2 border-emerald-500/40 p-4 rounded-2xl shadow-sm space-y-4"
                                >
                                    <div className="flex items-center justify-between border-b border-emerald-200/60 pb-2.5">
                                        <div className="flex items-center gap-2">
                                            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                                                <Clock className="w-4 h-4" />
                                            </div>
                                            <span className="text-xs font-extrabold text-emerald-950 uppercase tracking-wider">
                                                Selector de Hora Estilizado
                                            </span>
                                        </div>

                                        <span className="text-xs font-black text-emerald-700 bg-white px-3 py-1 rounded-full border border-emerald-300 shadow-xs">
                                            Recojo a las: {horaCustomFormatted}
                                        </span>
                                    </div>

                                    {/* Presets chips */}
                                    <div className="space-y-1">
                                        <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                                            Horarios Frecuentes:
                                        </p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {timePresets.map((preset) => (
                                                <button
                                                    key={preset}
                                                    type="button"
                                                    onClick={() => applyPresetSlot(preset)}
                                                    className={`px-2.5 py-1 text-xs font-bold rounded-lg border transition-all active:scale-95 ${horaCustomFormatted === preset
                                                            ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                                                            : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-400 hover:bg-emerald-50'
                                                        }`}
                                                >
                                                    {preset}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Interactive Steppers */}
                                    <div className="flex items-center justify-center gap-3 pt-1">
                                        {/* Hora Stepper */}
                                        <div className="flex flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={() => setPickerHora(h => h === 12 ? 1 : h + 1)}
                                                className="w-10 h-7 rounded-t-lg bg-white border border-slate-200 hover:bg-emerald-100 flex items-center justify-center text-slate-700 transition-all active:scale-95"
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </button>
                                            <div className="w-16 h-12 bg-white border-x border-slate-200 flex items-center justify-center font-black text-xl text-slate-900 shadow-inner">
                                                {pickerHora < 10 ? `0${pickerHora}` : pickerHora}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPickerHora(h => h === 1 ? 12 : h - 1)}
                                                className="w-10 h-7 rounded-b-lg bg-white border border-slate-200 hover:bg-emerald-100 flex items-center justify-center text-slate-700 transition-all active:scale-95"
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                            <span className="text-[10px] text-slate-500 font-bold mt-1">HORA</span>
                                        </div>

                                        <span className="text-2xl font-black text-emerald-600 pb-4">:</span>

                                        {/* Minutos Stepper */}
                                        <div className="flex flex-col items-center">
                                            <button
                                                type="button"
                                                onClick={() => setPickerMinuto(m => (m + 15) % 60)}
                                                className="w-10 h-7 rounded-t-lg bg-white border border-slate-200 hover:bg-emerald-100 flex items-center justify-center text-slate-700 transition-all active:scale-95"
                                            >
                                                <ChevronUp className="w-4 h-4" />
                                            </button>
                                            <div className="w-16 h-12 bg-white border-x border-slate-200 flex items-center justify-center font-black text-xl text-slate-900 shadow-inner">
                                                {pickerMinuto < 10 ? `0${pickerMinuto}` : pickerMinuto}
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setPickerMinuto(m => (m - 15 + 60) % 60)}
                                                className="w-10 h-7 rounded-b-lg bg-white border border-slate-200 hover:bg-emerald-100 flex items-center justify-center text-slate-700 transition-all active:scale-95"
                                            >
                                                <ChevronDown className="w-4 h-4" />
                                            </button>
                                            <span className="text-[10px] text-slate-500 font-bold mt-1">MINUTOS</span>
                                        </div>

                                        {/* AM / PM Toggle */}
                                        <div className="flex flex-col justify-center gap-1 pl-2">
                                            <button
                                                type="button"
                                                onClick={() => setPickerPeriodo('AM')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${pickerPeriodo === 'AM'
                                                        ? 'bg-emerald-600 text-white shadow-xs'
                                                        : 'bg-white text-slate-600 border border-slate-200'
                                                    }`}
                                            >
                                                AM
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPickerPeriodo('PM')}
                                                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${pickerPeriodo === 'PM'
                                                        ? 'bg-emerald-600 text-white shadow-xs'
                                                        : 'bg-white text-slate-600 border border-slate-200'
                                                    }`}
                                            >
                                                PM
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 pt-1">
                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Forma de Pago al Recoger en Mostrador
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        type="button"
                                        onClick={() => setMetodoPago('efectivo')}
                                        className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${metodoPago === 'efectivo'
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <Banknote className="w-4 h-4 text-emerald-600" />
                                        <span>Efectivo al recoger</span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setMetodoPago('transferencia')}
                                        className={`py-2.5 px-3 text-xs font-semibold rounded-xl border transition-all flex items-center justify-center gap-1.5 ${metodoPago === 'transferencia'
                                                ? 'bg-emerald-50 border-emerald-500 text-emerald-800 font-bold shadow-xs'
                                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                                            }`}
                                    >
                                        <CreditCard className="w-4 h-4 text-emerald-600" />
                                        <span>Transferencia previa</span>
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-700 mb-1">
                                    Instrucciones Específicas (Opcional)
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej: Tomate verde no muy maduro / Papas chicas"
                                    value={notas}
                                    onChange={e => setNotas(e.target.value)}
                                    className="w-full px-3.5 py-3 text-base sm:text-xs bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all outline-none"
                                />
                            </div>
                        </div>
                    </form>
                </section>
            </main>

            {/* Mobile Bottom Order Bar */}
            <AnimatePresence>
                {totalArticulos > 0 && (
                    <motion.div
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-0 inset-x-0 bg-slate-900/95 backdrop-blur-md border-t border-slate-800 text-white p-3.5 z-40 shadow-2xl"
                    >
                        <div className="max-w-4xl mx-auto flex items-center justify-between gap-2.5">
                            <div className="flex items-center space-x-2.5">
                                <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shadow-lg font-bold shrink-0">
                                    <ShoppingBag className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] sm:text-xs text-slate-400">
                                        Total a pagar al recoger:
                                    </p>
                                    <p className="text-base sm:text-lg font-black text-emerald-400 leading-tight">
                                        ${totalOrder.toFixed(2)} MXN
                                    </p>
                                </div>
                            </div>

                            <button
                                onClick={handleSendWhatsAppOrder}
                                className="px-4 sm:px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 active:scale-95 font-black text-xs sm:text-sm text-white rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all cursor-pointer shrink-0"
                            >
                                <Zap className="w-4 h-4 fill-white shrink-0" />
                                <span>PEDIR PARA RECOGER</span>
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Success Modal */}
            <AnimatePresence>
                {pedidoEnviado && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-white rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl">
                            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                                <Check className="w-8 h-8" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900">
                                ¡Pedido Enviado a la Tienda!
                            </h3>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                Se abrió WhatsApp con tu lista. Presiona "Enviar" para que en la tienda lo empaqueten y lo tengan listo cuando pases a recoger.
                            </p>
                            <button
                                onClick={() => setPedidoEnviado(false)}
                                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* iOS Installation Instructions Modal */}
            <AnimatePresence>
                {showIOSInstructions && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 z-50"
                    >
                        <div className="bg-white rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl">
                            <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                                <Smartphone className="w-7 h-7 text-emerald-600" />
                            </div>
                            <h3 className="text-base font-bold text-slate-900">
                                Instalar en iPhone / iPad
                            </h3>
                            <div className="text-xs text-slate-600 space-y-2.5 text-left bg-slate-50 p-4 rounded-2xl border border-slate-200">
                                <p className="flex items-center gap-2">
                                    <span className="font-bold bg-emerald-600 text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]">1</span>
                                    Toca el botón <strong>Compartir <Share2 className="w-3.5 h-3.5 inline text-emerald-600" /></strong> en Safari.
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-bold bg-emerald-600 text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]">2</span>
                                    Selecciona <strong>"Añadir a la pantalla de inicio" <Plus className="w-3.5 h-3.5 inline text-emerald-600" /></strong>.
                                </p>
                                <p className="flex items-center gap-2">
                                    <span className="font-bold bg-emerald-600 text-white w-5 h-5 rounded-full inline-flex items-center justify-center text-[10px]">3</span>
                                    ¡Listo! Tendrás la aplicación en tu celular.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowIOSInstructions(false)}
                                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all"
                            >
                                Entendido
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
