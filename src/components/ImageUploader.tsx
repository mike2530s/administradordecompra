import React, { useState } from 'react';
import { Upload, Image as ImageIcon, CheckCircle, AlertCircle, RefreshCw, Camera } from 'lucide-react';

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

    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      // 1. Client-side Image Compression (Canvas)
      const compressedBase64 = await compressImage(file);
      setPreview(compressedBase64);
      onImageUploaded(compressedBase64);
      setSuccessMsg('Imagen optimizada y guardada exitosamente.');

      // Try uploading to server if you want, but now we just use the compressed Base64
      // which is small enough (<150KB) to sync safely across all devices via the products JSON.
      try {
        await fetch(DEFAULT_SERVER_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: compressedBase64 })
        });
      } catch (e) {
          // Ignore server upload failure, base64 is already saved in SQLite/Local storage via useProductos
      }

    } catch (err) {
      console.error(err);
      setError('Error al procesar la imagen.');
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file: File): Promise<string> => {
      return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = (event) => {
              const img = new Image();
              img.src = event.target?.result as string;
              img.onload = () => {
                  const canvas = document.createElement('canvas');
                  const MAX_WIDTH = 800;
                  const MAX_HEIGHT = 800;
                  let width = img.width;
                  let height = img.height;

                  if (width > height) {
                      if (width > MAX_WIDTH) {
                          height *= MAX_WIDTH / width;
                          width = MAX_WIDTH;
                      }
                  } else {
                      if (height > MAX_HEIGHT) {
                          width *= MAX_HEIGHT / height;
                          height = MAX_HEIGHT;
                      }
                  }

                  canvas.width = width;
                  canvas.height = height;
                  const ctx = canvas.getContext('2d');
                  ctx?.drawImage(img, 0, 0, width, height);
                  
                  // Compress to WebP or JPEG
                  const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
                  resolve(dataUrl);
              };
              img.onerror = (error) => reject(error);
          };
          reader.onerror = (error) => reject(error);
      });
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
          <div className="flex flex-wrap gap-2">
            <label className="inline-flex items-center px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium rounded-lg cursor-pointer shadow-sm hover:shadow transition-all duration-150 active:scale-95">
              <Upload className="w-4 h-4 mr-1.5" />
              <span>{loading ? 'Subiendo...' : 'Galería'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
            <label className="inline-flex items-center px-3 py-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-medium rounded-lg cursor-pointer shadow-sm hover:shadow transition-all duration-150 active:scale-95">
              <Camera className="w-4 h-4 mr-1.5" />
              <span>{loading ? 'Subiendo...' : 'Cámara'}</span>
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileChange}
                disabled={loading}
              />
            </label>
          </div>
          <p className="text-[11px] text-gray-500">
            Sube la verdura del día. Almacenada de forma segura en el servidor.
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
