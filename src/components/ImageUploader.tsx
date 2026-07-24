import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';

interface ImageUploaderProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  label?: string;
}

// Configurable IP for ThinkPad T410 Debian server
const DEFAULT_SERVER_URL = import.meta.env.VITE_IMAGE_UPLOAD_URL || 'http://192.168.1.149:3001/api/upload';

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  onImageUploaded,
  label = 'Foto del Día (Verdura Fresca)'
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | undefined>(currentImageUrl);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError('Por favor selecciona un archivo de imagen válido (JPG, PNG, WEBP).');
      return;
    }

    // Immediate local preview
    const localUrl = URL.createObjectURL(file);
    setPreview(localUrl);
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    const formData = new FormData();
    formData.append('imagen', file);

    try {
      // Attempt upload to physical ThinkPad T410 server @ 192.168.1.149
      const response = await fetch(DEFAULT_SERVER_URL, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          setPreview(data.url);
          onImageUploaded(data.url);
          setSuccessMsg('¡Foto subida con éxito a tu servidor Debian!');
        }
      } else {
        throw new Error('Servidor remoto devolvió código ' + response.status);
      }
    } catch (err) {
      console.warn('Upload al servidor físico falló, usando vista previa local:', err);
      // Fallback: Read as Data URL so image persists in LocalStorage
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Url = reader.result as string;
        setPreview(base64Url);
        onImageUploaded(base64Url);
        setSuccessMsg('Imagen guardada localmente (Servidor Debian offline)');
      };
      reader.readAsDataURL(file);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
        {label}
      </label>
      
      <div className="flex items-center space-x-4">
        {/* Thumbnail Preview */}
        <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 flex items-center justify-center overflow-hidden shrink-0 group">
          {preview ? (
            <img
              src={preview}
              alt="Foto verdura"
              className="w-full h-full object-cover rounded-lg group-hover:scale-105 transition-transform duration-200"
            />
          ) : (
            <ImageIcon className="w-8 h-8 text-gray-400" />
          )}
          {loading && (
            <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex items-center justify-center text-white">
              <RefreshCw className="w-6 h-6 animate-spin" />
            </div>
          )}
        </div>

        {/* Upload Controls */}
        <div className="flex-1 space-y-2">
          <label className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg cursor-pointer shadow-sm hover:shadow transition-all duration-150 active:scale-95">
            <Upload className="w-4 h-4 mr-2" />
            <span>{loading ? 'Subiendo a 192.168.1.149...' : 'Subir Foto de Hoy'}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              disabled={loading}
            />
          </label>
          <p className="text-[11px] text-gray-500">
            Sube la verdura del día. Almacenada directamente en tu servidor ThinkPad T410.
          </p>

          {successMsg && (
            <div className="flex items-center text-xs text-emerald-600 font-medium">
              <CheckCircle className="w-3.5 h-3.5 mr-1" /> {successMsg}
            </div>
          )}
          {error && (
            <div className="flex items-center text-xs text-rose-600 font-medium">
              <AlertCircle className="w-3.5 h-3.5 mr-1" /> {error}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageUploader;
