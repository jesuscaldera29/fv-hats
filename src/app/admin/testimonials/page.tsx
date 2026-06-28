'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Edit2, Trash2, X, Loader2, Save, Star, MessageSquareQuote } from 'lucide-react';
import Image from 'next/image';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
} from '@/app/admin/actions';

type Testimonial = {
  id: number;
  name: string;
  text: string;
  rating: number;
  avatar_url: string | null;
  is_active: boolean;
};

export default function AdminTestimonials() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    text: '',
    rating: 5,
    avatar_url: '',
    is_active: true,
  });

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadTestimonials = useCallback(async () => {
    setLoading(true);
    const data = await getTestimonials();
    setTestimonials(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadTestimonials();
  }, [loadTestimonials]);

  const openCreateModal = () => {
    setEditingId(null);
    setFormData({ name: '', text: '', rating: 5, avatar_url: '', is_active: true });
    setIsModalOpen(true);
  };

  const openEditModal = (t: Testimonial) => {
    setEditingId(t.id);
    setFormData({
      name: t.name,
      text: t.text,
      rating: t.rating,
      avatar_url: t.avatar_url || '',
      is_active: t.is_active,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.text) {
      showToast('Nombre y texto son obligatorios', 'error');
      return;
    }

    setSaving(true);
    const payload = {
      name: formData.name,
      text: formData.text,
      rating: formData.rating,
      avatar_url: formData.avatar_url || undefined,
      is_active: formData.is_active,
    };

    let result;
    if (editingId) {
      result = await updateTestimonial(editingId, payload);
    } else {
      result = await createTestimonial(payload);
    }

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast(editingId ? 'Testimonio actualizado' : 'Testimonio creado', 'success');
      setIsModalOpen(false);
      loadTestimonials();
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteTestimonial(id);
    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Testimonio eliminado', 'success');
      loadTestimonials();
    }
    setDeleteConfirm(null);
  };

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl font-medium shadow-2xl ${
            toast.type === 'success' ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Testimonios</h1>
          <p className="text-gray-400">Gestiona los testimonios que se muestran en la landing.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Nuevo Testimonio
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 text-[var(--color-brand-gold)] animate-spin" />
        </div>
      ) : testimonials.length === 0 ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-16 text-center">
          <MessageSquareQuote className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400 text-lg mb-2">No hay testimonios aún</p>
          <p className="text-gray-600 text-sm">Crea tu primer testimonio para que aparezca en la landing</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((t) => (
            <div
              key={t.id}
              className={`bg-white/5 border rounded-2xl p-6 relative transition-colors ${
                t.is_active ? 'border-white/10' : 'border-red-500/20 opacity-60'
              }`}
            >
              {/* Status badge */}
              {!t.is_active && (
                <span className="absolute top-3 right-3 text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full font-medium">
                  Oculto
                </span>
              )}

              {/* Avatar + Name */}
              <div className="flex items-center space-x-3 mb-4">
                {t.avatar_url ? (
                  <div className="relative w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Image src={t.avatar_url} alt={t.name} fill className="object-cover" unoptimized />
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[var(--color-brand-purple)]/30 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                    {t.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-white font-bold">{t.name}</p>
                  <div className="flex space-x-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${
                          i < t.rating ? 'text-[var(--color-brand-gold)] fill-current' : 'text-gray-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Text */}
              <p className="text-gray-400 text-sm leading-relaxed mb-4 line-clamp-4">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* Actions */}
              <div className="flex items-center justify-end space-x-2 border-t border-white/5 pt-3">
                <button
                  onClick={() => openEditModal(t)}
                  className="text-gray-400 hover:text-white transition-colors p-1.5"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                {deleteConfirm === t.id ? (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-bold"
                    >
                      Eliminar
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(null)}
                      className="text-gray-500 hover:text-white text-xs"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setDeleteConfirm(t.id)}
                    className="text-gray-400 hover:text-red-400 transition-colors p-1.5"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingId ? 'Editar Testimonio' : 'Nuevo Testimonio'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* Avatar */}
              <div className="flex justify-center">
                <div className="w-32">
                  <ImageUploader
                    currentImage={formData.avatar_url || null}
                    onImageUploaded={(url) => setFormData({ ...formData, avatar_url: url })}
                    onImageRemoved={() => setFormData({ ...formData, avatar_url: '' })}
                    label="Avatar"
                    aspectRatio="aspect-square"
                    className="text-center"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Nombre *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                  placeholder="Nombre del cliente"
                />
              </div>

              {/* Text */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Testimonio *</label>
                <textarea
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  rows={4}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)] resize-none"
                  placeholder="Lo que el cliente dijo sobre tu producto..."
                />
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Calificación</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 ${
                          star <= formData.rating
                            ? 'text-[var(--color-brand-gold)] fill-current'
                            : 'text-gray-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Active toggle */}
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-5 h-5 rounded bg-[#0a0a0a] border-white/20"
                />
                <span className="text-sm text-gray-300">Visible en la landing</span>
              </label>
            </div>

            <div className="flex justify-end p-6 border-t border-white/10 space-x-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-3 text-gray-400 hover:text-white transition-colors font-medium"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl transition-colors flex items-center disabled:opacity-50"
              >
                {saving ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {editingId ? 'Actualizar' : 'Crear'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
