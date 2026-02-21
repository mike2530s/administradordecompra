import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { ProductosProvider } from '@/hooks/useProductos';
import { ThemeProvider } from '@/hooks/useTheme';

import Welcome from '@/pages/Welcome';
import LoginPage from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Compras from '@/pages/Compras';
import Ventas from '@/pages/Ventas';
import Productos from '@/pages/Productos';
import Analisis from '@/pages/Analisis';
import Historial from '@/pages/Historial';
import Configuracion from '@/pages/Configuracion';
import AppLayout from '@/components/layout/AppLayout';
import CompraForm from '@/components/forms/CompraForm';
import VentaForm from '@/components/forms/VentaForm';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function ProtectedRoutes() {
  const { user, loading } = useAuth();
  const [showCompraForm, setShowCompraForm] = useState(false);
  const [showVentaForm, setShowVentaForm] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/welcome" replace />;
  }

  return (
    <>
      <Routes>
        <Route
          element={
            <AppLayout
              onNewCompra={() => setShowCompraForm(true)}
              onNewVenta={() => setShowVentaForm(true)}
            />
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/compras" element={<Compras />} />
          <Route path="/ventas" element={<Ventas />} />
          <Route path="/productos" element={<Productos />} />
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/historial" element={<Historial />} />
          <Route path="/configuracion" element={<Configuracion />} />
        </Route>
      </Routes>

      <CompraForm open={showCompraForm} onClose={() => setShowCompraForm(false)} />
      <VentaForm open={showVentaForm} onClose={() => setShowVentaForm(false)} />
    </>
  );
}

function AppRoutes() {
  const { user, loading } = useAuth();

  return (
    <Routes>
      <Route
        path="/welcome"
        element={
          !loading && user ? <Navigate to="/" replace /> : <Welcome />
        }
      />
      <Route
        path="/login"
        element={
          !loading && user ? <Navigate to="/" replace /> : <LoginPage />
        }
      />
      <Route path="/*" element={<ProtectedRoutes />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <ProductosProvider>
              <AppRoutes />
            </ProductosProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
