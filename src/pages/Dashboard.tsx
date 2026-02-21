import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    TrendingUp, DollarSign, BarChart3, Star,
    AlertTriangle, Package, ArrowUpRight, ArrowDownRight,
} from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';
import { formatearMoneda, formatearPorcentaje } from '@/lib/calculations';

// Demo data
const gananciasDiarias = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i);
    const ganancia = Math.random() * 400 - 50;
    return {
        fecha: `${date.getDate()}/${date.getMonth() + 1}`,
        ganancia: Math.round(ganancia),
    };
});

const margenPorProducto = [
    { nombre: 'Tomates', margen: 45 },
    { nombre: 'Zanahorias', margen: 40 },
    { nombre: 'Chiles', margen: 38 },
    { nombre: 'Jitomates', margen: 35 },
    { nombre: 'Papas', margen: 30 },
    { nombre: 'Cebollas', margen: 25 },
    { nombre: 'Calabazas', margen: 20 },
    { nombre: 'Pimientos', margen: 15 },
    { nombre: 'Espinacas', margen: 8 },
    { nombre: 'Lechugas', margen: 5 },
].sort((a, b) => b.margen - a.margen);

const inversionVsRetorno = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - 6 + i);
    const inversion = 800 + Math.random() * 400;
    const retorno = inversion * (1.2 + Math.random() * 0.3);
    return {
        dia: ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][date.getDay()],
        inversion: Math.round(inversion),
        retorno: Math.round(retorno),
    };
});

const distribucionGanancias = [
    { nombre: 'Tomates', valor: 450, color: '#22C55E' },
    { nombre: 'Zanahorias', valor: 320, color: '#3B82F6' },
    { nombre: 'Chiles', valor: 280, color: '#8B5CF6' },
    { nombre: 'Papas', valor: 200, color: '#F59E0B' },
    { nombre: 'Otros', valor: 150, color: '#94A3B8' },
];

const productosTabla = [
    { nombre: 'Tomates', stock: 25, margen: 45, ganancia: 450, estado: 'alto', accion: 'Comprar más' },
    { nombre: 'Zanahorias', stock: 30, margen: 40, ganancia: 320, estado: 'alto', accion: 'Mantener' },
    { nombre: 'Papas', stock: 50, margen: 30, ganancia: 200, estado: 'medio', accion: 'Mantener' },
    { nombre: 'Cebollas', stock: 20, margen: 25, ganancia: 150, estado: 'medio', accion: 'Monitorear' },
    { nombre: 'Pimientos', stock: 15, margen: 15, ganancia: 80, estado: 'bajo', accion: 'Reducir' },
    { nombre: 'Lechugas', stock: 10, margen: 5, ganancia: 15, estado: 'critico', accion: 'Evitar' },
];

const recomendaciones = {
    verdes: [
        { nombre: 'Tomates', margen: 45, accion: 'Compra más' },
        { nombre: 'Zanahorias', margen: 40, accion: 'Mantén' },
    ],
    amarillos: [
        { nombre: 'Cebollas', margen: 15, accion: 'Reduce cantidad' },
        { nombre: 'Pimientos', margen: 12, accion: 'Monitorea precios' },
    ],
    rojos: [
        { nombre: 'Lechugas', margen: 5, accion: 'Deja de comprar' },
        { nombre: 'Espinacas', margen: -2, accion: 'No comprar más' },
    ],
};

function getMargenColor(margen: number) {
    if (margen >= 40) return '#22C55E';
    if (margen >= 25) return '#16A34A';
    if (margen >= 15) return '#F59E0B';
    if (margen >= 10) return '#EF4444';
    return '#DC2626';
}

function getEstadoInfo(estado: string) {
    switch (estado) {
        case 'alto': return { color: 'bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-400', emoji: '🟢' };
        case 'medio': return { color: 'bg-yellow-50 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-400', emoji: '🟡' };
        case 'bajo': return { color: 'bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-400', emoji: '🟠' };
        case 'critico': return { color: 'bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-400', emoji: '🔴' };
        default: return { color: 'bg-gray-50 text-gray-700 dark:bg-gray-800 dark:text-gray-400', emoji: '⚪' };
    }
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.08 },
    },
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const tooltipStyle: any = {
    contentStyle: {
        borderRadius: 12,
        border: 'none',
        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
        fontSize: 12,
    },
};

export default function Dashboard() {
    return (
        <motion.div
            className="space-y-5 max-w-[1400px] mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
        >
            {/* Page Title */}
            <motion.div variants={itemVariants}>
                <h1 className="text-xl font-bold text-[#1A1A1A] dark:text-gray-100">Dashboard</h1>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">Resumen de tu negocio</p>
            </motion.div>

            {/* Hero card — Today's earnings */}
            <motion.div variants={itemVariants}>
                <Card className="border border-green-100 dark:border-green-900 shadow-none bg-green-50/50 dark:bg-green-950/30 overflow-hidden">
                    <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <div className="flex items-center gap-2 mb-1.5">
                                    <DollarSign className="w-4 h-4 text-green-500" />
                                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Ganancia de Hoy</span>
                                </div>
                                <p className="text-4xl font-bold text-[#1A1A1A] dark:text-gray-100 tracking-tight">$250</p>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full text-xs font-semibold">
                                        <ArrowUpRight size={12} /> +35%
                                    </span>
                                    <span className="text-xs text-gray-400">vs ayer</span>
                                </div>
                            </div>
                            <div className="hidden sm:flex w-14 h-14 bg-green-100/80 dark:bg-green-900/50 rounded-2xl items-center justify-center">
                                <TrendingUp className="w-7 h-7 text-green-500" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Metric Cards — list style */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {[
                    { label: 'Ganancia Semana', value: '$1,200', icon: BarChart3, delta: '+12%', deltaUp: true, color: '#22C55E' },
                    { label: 'Ganancia Mes', value: '$4,500', icon: DollarSign, delta: '+8%', deltaUp: true, color: '#22C55E' },
                    { label: 'Margen Promedio', value: '38%', icon: TrendingUp, delta: '+2.5%', deltaUp: true, color: '#22C55E' },
                    { label: 'Mejor Producto', value: 'Tomates', icon: Star, delta: '45% margen', deltaUp: true, color: '#F59E0B' },
                    { label: 'Peor Producto', value: 'Lechugas', icon: AlertTriangle, delta: '5% margen', deltaUp: false, color: '#EF4444' },
                    { label: 'Inventario Actual', value: '$2,300', icon: Package, delta: '150 kg total', deltaUp: true, color: '#3B82F6' },
                ].map((metric, i) => (
                    <Card key={i} className="border border-[#F0F0F0] dark:border-gray-800 shadow-none dark:bg-gray-900 hover:border-gray-200 dark:hover:border-gray-700 transition-colors">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-xs text-gray-400 dark:text-gray-500 font-medium">{metric.label}</p>
                                    <p className="text-xl font-bold text-[#1A1A1A] dark:text-gray-100 mt-0.5">{metric.value}</p>
                                    <div className="flex items-center gap-1 mt-1">
                                        {metric.deltaUp ? (
                                            <ArrowUpRight size={12} style={{ color: metric.color }} />
                                        ) : (
                                            <ArrowDownRight size={12} className="text-red-500" />
                                        )}
                                        <span className="text-[11px] font-semibold" style={{ color: metric.deltaUp ? metric.color : '#EF4444' }}>
                                            {metric.delta}
                                        </span>
                                    </div>
                                </div>
                                <div
                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                    style={{ backgroundColor: `${metric.color}10` }}
                                >
                                    <metric.icon size={20} style={{ color: metric.color }} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </motion.div>

            {/* Charts Row 1 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Daily Profit Chart */}
                <Card className="border border-[#F0F0F0] dark:border-gray-800 shadow-none dark:bg-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-gray-100">Ganancia Diaria</h3>
                                <p className="text-[11px] text-gray-400">Últimos 30 días</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={gananciasDiarias}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                                    <XAxis dataKey="fecha" tick={{ fontSize: 10 }} stroke="#D1D5DB" interval={4} />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#D1D5DB" />
                                    <Tooltip {...tooltipStyle}
                                        formatter={(value: number | undefined) => [formatearMoneda(value ?? 0), 'Ganancia']}
                                    />
                                    <Bar dataKey="ganancia" radius={[3, 3, 0, 0]}>
                                        {gananciasDiarias.map((entry, index) => (
                                            <Cell key={index} fill={entry.ganancia >= 0 ? '#22C55E' : '#EF4444'} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Margin by Product */}
                <Card className="border border-[#F0F0F0] dark:border-gray-800 shadow-none dark:bg-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-gray-100">Margen por Producto</h3>
                                <p className="text-[11px] text-gray-400">Top 10 productos</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={margenPorProducto} layout="vertical">
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                                    <XAxis type="number" domain={[0, 50]} tick={{ fontSize: 10 }} stroke="#D1D5DB" />
                                    <YAxis dataKey="nombre" type="category" width={75} tick={{ fontSize: 10 }} stroke="#D1D5DB" />
                                    <Tooltip {...tooltipStyle}
                                        formatter={(value: number | undefined) => [formatearPorcentaje(value ?? 0), 'Margen']}
                                    />
                                    <Bar dataKey="margen" radius={[0, 3, 3, 0]}>
                                        {margenPorProducto.map((entry, index) => (
                                            <Cell key={index} fill={getMargenColor(entry.margen)} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Charts Row 2 */}
            <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Investment vs Return */}
                <Card className="border border-[#F0F0F0] dark:border-gray-800 shadow-none dark:bg-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-gray-100">Inversión vs Retorno</h3>
                                <p className="text-[11px] text-gray-400">Últimos 7 días</p>
                            </div>
                            <div className="flex items-center gap-3 text-[11px]">
                                <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                                    <span className="text-gray-400">Inversión</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
                                    <span className="text-gray-400">Retorno</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={inversionVsRetorno}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#F5F5F5" />
                                    <XAxis dataKey="dia" tick={{ fontSize: 10 }} stroke="#D1D5DB" />
                                    <YAxis tick={{ fontSize: 10 }} stroke="#D1D5DB" />
                                    <Tooltip {...tooltipStyle}
                                        formatter={(value: number | undefined) => [formatearMoneda(value ?? 0)]}
                                    />
                                    <Line type="monotone" dataKey="inversion" stroke="#3B82F6" strokeWidth={2} dot={{ r: 3 }} name="Inversión" />
                                    <Line type="monotone" dataKey="retorno" stroke="#22C55E" strokeWidth={2} dot={{ r: 3 }} name="Retorno" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>

                {/* Profit Distribution */}
                <Card className="border border-[#F0F0F0] dark:border-gray-800 shadow-none dark:bg-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-gray-100">Distribución de Ganancias</h3>
                                <p className="text-[11px] text-gray-400">Por producto</p>
                            </div>
                        </div>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={distribucionGanancias}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={55}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="valor"
                                        nameKey="nombre"
                                        strokeWidth={0}
                                    >
                                        {distribucionGanancias.map((entry, index) => (
                                            <Cell key={index} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip {...tooltipStyle}
                                        formatter={(value: number | undefined) => [formatearMoneda(value ?? 0), 'Ganancia']}
                                    />
                                    <Legend
                                        verticalAlign="bottom"
                                        height={32}
                                        formatter={(value) => <span className="text-[11px] text-gray-500">{value}</span>}
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Products Table */}
            <motion.div variants={itemVariants}>
                <Card className="border border-[#F0F0F0] dark:border-gray-800 shadow-none dark:bg-gray-900">
                    <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                            <div>
                                <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-gray-100">Productos</h3>
                                <p className="text-[11px] text-gray-400">Estado actual de inventario y rentabilidad</p>
                            </div>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-[#F5F5F5] dark:border-gray-800">
                                        <th className="text-left py-2.5 px-2 text-gray-400 font-medium text-[11px] uppercase tracking-wider">Producto</th>
                                        <th className="text-right py-2.5 px-2 text-gray-400 font-medium text-[11px] uppercase tracking-wider">Stock</th>
                                        <th className="text-right py-2.5 px-2 text-gray-400 font-medium text-[11px] uppercase tracking-wider">Margen</th>
                                        <th className="text-right py-2.5 px-2 text-gray-400 font-medium text-[11px] uppercase tracking-wider">Ganancia</th>
                                        <th className="text-center py-2.5 px-2 text-gray-400 font-medium text-[11px] uppercase tracking-wider">Estado</th>
                                        <th className="text-right py-2.5 px-2 text-gray-400 font-medium text-[11px] uppercase tracking-wider">Acción</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {productosTabla.map((producto, i) => {
                                        const estadoInfo = getEstadoInfo(producto.estado);
                                        return (
                                            <tr key={i} className="border-b border-[#FAFAFA] dark:border-gray-800/50 hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors">
                                                <td className="py-2.5 px-2 font-medium text-[#1A1A1A] dark:text-gray-100 text-sm">{producto.nombre}</td>
                                                <td className="py-2.5 px-2 text-right text-gray-500 dark:text-gray-400 text-sm">{producto.stock} kg</td>
                                                <td className="py-2.5 px-2 text-right">
                                                    <span style={{ color: getMargenColor(producto.margen) }} className="font-semibold text-sm">
                                                        {formatearPorcentaje(producto.margen)}
                                                    </span>
                                                </td>
                                                <td className="py-2.5 px-2 text-right font-semibold text-green-600 text-sm">
                                                    +{formatearMoneda(producto.ganancia)}
                                                </td>
                                                <td className="py-2.5 px-2 text-center">
                                                    <Badge className={`${estadoInfo.color} text-[10px] font-medium px-2`}>
                                                        {estadoInfo.emoji} {producto.estado}
                                                    </Badge>
                                                </td>
                                                <td className="py-2.5 px-2 text-right">
                                                    <span className={`text-xs font-medium ${producto.estado === 'alto' ? 'text-green-600' :
                                                        producto.estado === 'medio' ? 'text-yellow-600' :
                                                            'text-red-600'
                                                        }`}>
                                                        {producto.accion}
                                                    </span>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={itemVariants}>
                <Card className="border border-[#F0F0F0] dark:border-gray-800 shadow-none dark:bg-gray-900">
                    <CardContent className="p-5">
                        <div className="mb-3">
                            <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-gray-100 flex items-center gap-2">
                                💡 Recomendaciones para Hoy
                            </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                            {/* Green */}
                            <div className="bg-green-50/70 dark:bg-green-950/30 rounded-xl p-3.5 border border-green-100 dark:border-green-900">
                                <p className="text-xs font-semibold text-green-700 dark:text-green-400 mb-2.5">🟢 Rentables</p>
                                <div className="space-y-1.5">
                                    {recomendaciones.verdes.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-[11px]">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">{item.nombre}</span>
                                            <span className="text-green-600 dark:text-green-400 font-semibold">{item.margen}% → {item.accion}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Yellow */}
                            <div className="bg-amber-50/70 dark:bg-amber-950/30 rounded-xl p-3.5 border border-amber-100 dark:border-amber-900">
                                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-2.5">🟡 Monitorear</p>
                                <div className="space-y-1.5">
                                    {recomendaciones.amarillos.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-[11px]">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">{item.nombre}</span>
                                            <span className="text-amber-600 dark:text-amber-400 font-semibold">{item.margen}% → {item.accion}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            {/* Red */}
                            <div className="bg-red-50/70 dark:bg-red-950/30 rounded-xl p-3.5 border border-red-100 dark:border-red-900">
                                <p className="text-xs font-semibold text-red-700 dark:text-red-400 mb-2.5">🔴 No Rentables</p>
                                <div className="space-y-1.5">
                                    {recomendaciones.rojos.map((item, i) => (
                                        <div key={i} className="flex items-center justify-between text-[11px]">
                                            <span className="text-gray-600 dark:text-gray-400 font-medium">{item.nombre}</span>
                                            <span className="text-red-600 dark:text-red-400 font-semibold">{item.margen}% → {item.accion}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </motion.div>
    );
}
