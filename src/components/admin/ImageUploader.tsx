'use client';

import { useState, useRef, useCallback } from 'react';
import Image from 'next/image';
import { Upload, X, Loader2 } from 'lucide-react';
import { uploadImage } from '@/app/admin/actions';

interface ImageUploaderProps {
  currentImage?: string | null;
  onImageUploaded: (url: string) => void;
  onImageRemoved?: () => void;
  label?: string;
  className?: string;
  aspectRatio?: string;
}

export default function ImageUploader({
  currentImage,
  onImageUploaded,
  onImageRemoved,
  label = 'Subir Imagen',
  className = '',
  aspectRatio = 'aspect-video',
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError('Solo se permiten archivos de imagen');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('La imagen no debe superar 5MB');
      return;
    }

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);

    const result = await uploadImage(formData);

    if (result.error) {
      setError(result.error);
    } else if (result.url) {
      onImageUploaded(result.url);
    }
    setIsUploading(false);
  }, [onImageUploaded]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
    // Reset input so the same file can be uploaded again if needed
    e.target.value = '';
  }, [handleUpload]);

  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
      )}

      {currentImage ? (
        <div className={`relative ${aspectRatio} rounded-xl overflow-hidden border border-white/10 group`}>
          <Image
            src={currentImage}
            alt="Preview"
            fill
            className="object-cover"
            unoptimized
          />
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-white/30 transition-colors"
            >
              Cambiar
            </button>
            {onImageRemoved && (
              <button
                type="button"
                onClick={onImageRemoved}
                className="bg-red-500/80 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-red-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
          className={`${aspectRatio} border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all ${
            isDragging
              ? 'border-[var(--color-brand-gold)] bg-[var(--color-brand-gold)]/5'
              : 'border-white/10 hover:border-white/30 bg-[#0a0a0a]'
          } ${isUploading ? 'pointer-events-none opacity-60' : ''}`}
        >
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-[var(--color-brand-gold)] animate-spin" />
          ) : (
            <>
              <Upload className="w-8 h-8 text-gray-500 mb-2" />
              <p className="text-gray-400 text-sm text-center px-4">
                Arrastra una imagen aquí o haz clic para seleccionar
              </p>
              <p className="text-gray-600 text-xs mt-1">PNG, JPG, WebP (máx. 5MB)</p>
            </>
          )}
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {error && (
        <p className="text-red-400 text-xs mt-2">{error}</p>
      )}
    </div>
  );
}
