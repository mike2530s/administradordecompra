import React, { useState, useEffect } from 'react';
import { WifiOff, ServerOff, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SERVER_URL = import.meta.env.VITE_SERVER_URL || 'http://192.168.1.149:3001';

export const OfflineBanner: React.FC = () => {
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
  const [serverOnline, setServerOnline] = useState<boolean>(true);
  const [checking, setChecking] = useState<boolean>(false);

  const checkServerStatus = async () => {
    setChecking(true);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000);
      const res = await fetch(`${SERVER_URL}/api/health`, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (res.ok) {
        setServerOnline(true);
      } else {
        setServerOnline(false);
      }
    } catch {
      setServerOnline(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      checkServerStatus();
    };
    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    checkServerStatus();
    const interval = setInterval(checkServerStatus, 30000);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, []);

  if (isOnline && serverOnline) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        className="sticky top-16 z-20 w-full"
      >
        {!isOnline ? (
          <div className="bg-amber-600 text-white px-4 py-2 text-xs font-bold shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <WifiOff className="w-4 h-4 animate-pulse shrink-0 text-amber-200" />
              <span>
                <strong>Sin conexión a internet:</strong> Estás navegando en modo fuera de línea con catálogo guardado en tu dispositivo.
              </span>
            </div>

            <button
              onClick={checkServerStatus}
              className="bg-white/20 hover:bg-white/30 text-white px-2.5 py-1 rounded-lg text-[11px] font-black shrink-0 transition-colors flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} /> Reintentar
            </button>
          </div>
        ) : !serverOnline ? (
          <div className="bg-slate-800 text-slate-100 px-4 py-2 text-xs font-medium border-b border-slate-700 shadow-md flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ServerOff className="w-4 h-4 text-amber-400 animate-pulse shrink-0" />
              <span>
                <strong>Servidor Local ThinkPad T410 (192.168.1.149):</strong> Fuera de línea. Usando copia local en tu dispositivo.
              </span>
            </div>

            <button
              onClick={checkServerStatus}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shrink-0 transition-colors flex items-center gap-1"
            >
              <RefreshCw className={`w-3 h-3 ${checking ? 'animate-spin' : ''}`} /> Probar Conexión
            </button>
          </div>
        ) : null}
      </motion.div>
    </AnimatePresence>
  );
};

export default OfflineBanner;
