'use client';

import { useEffect, useState, useCallback } from 'react';
import { Save, Loader2, RotateCcw } from 'lucide-react';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  getSettings,
  updateSettings,
  getSiteContent,
  updateSiteContentBulk,
} from '@/app/admin/actions';

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Settings
  const [settings, setSettingsState] = useState({
    whatsapp_number: '',
    contact_email: '',
    contact_phone: '',
    promo_banner_text: '',
    hero_banner_url: '',
    logo_url: '',
  });

  // Site Content
  const [content, setContent] = useState<Record<string, string>>({});

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [settingsData, contentData] = await Promise.all([
        getSettings(),
        getSiteContent(),
      ]);

      if (settingsData) {
        setSettingsState({
          whatsapp_number: settingsData.whatsapp_number || '',
          contact_email: settingsData.contact_email || '',
          contact_phone: settingsData.contact_phone || '',
          promo_banner_text: settingsData.promo_banner_text || '',
          hero_banner_url: settingsData.hero_banner_url || '',
          logo_url: settingsData.logo_url || '',
        });
      }

      setContent(contentData);
      setLoading(false);
    }
    load();
  }, []);

  const handleSaveAll = async () => {
    setSaving(true);

    // Save settings
    const settingsResult = await updateSettings(settings);
    if (settingsResult.error) {
      showToast('Error al guardar configuración: ' + settingsResult.error, 'error');
      setSaving(false);
      return;
    }

    // Save site content
    const contentResult = await updateSiteContentBulk(content);
    if (contentResult.error) {
      showToast('Error al guardar contenido: ' + contentResult.error, 'error');
      setSaving(false);
      return;
    }

    showToast('¡Todos los cambios guardados exitosamente!', 'success');
    setSaving(false);
  };

  const updateContent = (key: string, value: string) => {
    setContent((prev) => ({ ...prev, [key]: value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-[var(--color-brand-gold)] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl font-medium shadow-2xl ${
            toast.type === 'success'
              ? 'bg-green-500/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white">Configuración</h1>
          <p className="text-gray-400">Administra todos los textos, imágenes y datos de tu tienda.</p>
        </div>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl transition-colors flex items-center shadow-lg disabled:opacity-50"
        >
          {saving ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              <Save className="w-5 h-5 mr-2" /> Guardar Todo
            </>
          )}
        </button>
      </div>

      <div className="space-y-8">

        {/* ====== LOGO ====== */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-1">Logo de la Tienda</h3>
          <p className="text-gray-500 text-sm mb-4">Se mostrará en el Navbar y Footer. Si no hay imagen, se usará el texto &quot;FVHATS&quot;.</p>
          <div className="max-w-xs">
            <ImageUploader
              currentImage={settings.logo_url || null}
              onImageUploaded={(url) => setSettingsState({ ...settings, logo_url: url })}
              onImageRemoved={() => setSettingsState({ ...settings, logo_url: '' })}
              label=""
              aspectRatio="aspect-[3/1]"
            />
          </div>
        </div>

        {/* ====== HERO SECTION ====== */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🎯 Sección Hero (Portada)</h3>
          <div className="space-y-4">
            <ImageUploader
              currentImage={settings.hero_banner_url || null}
              onImageUploaded={(url) => setSettingsState({ ...settings, hero_banner_url: url })}
              onImageRemoved={() => setSettingsState({ ...settings, hero_banner_url: '' })}
              label="Imagen de Fondo del Hero"
              aspectRatio="aspect-[21/9]"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Badge (texto pequeño arriba)</label>
                <input
                  type="text"
                  value={content.hero_badge || ''}
                  onChange={(e) => updateContent('hero_badge', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Botón CTA Principal</label>
                <input
                  type="text"
                  value={content.hero_cta_primary || ''}
                  onChange={(e) => updateContent('hero_cta_primary', e.target.value)}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Título Línea 1</label>
              <input
                type="text"
                value={content.hero_title_line1 || ''}
                onChange={(e) => updateContent('hero_title_line1', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Título Línea 2 (con degradado)</label>
              <input
                type="text"
                value={content.hero_title_line2 || ''}
                onChange={(e) => updateContent('hero_title_line2', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subtítulo</label>
              <textarea
                value={content.hero_subtitle || ''}
                onChange={(e) => updateContent('hero_subtitle', e.target.value)}
                rows={2}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)] resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Botón CTA Secundario</label>
              <input
                type="text"
                value={content.hero_cta_secondary || ''}
                onChange={(e) => updateContent('hero_cta_secondary', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
          </div>
        </div>

        {/* ====== FEATURES SECTION ====== */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">⭐ Sección Features (3 columnas)</h3>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-[#0a0a0a] rounded-xl p-4 border border-white/5">
                <p className="text-xs text-[var(--color-brand-gold)] font-bold mb-3 uppercase">Feature {i}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Título</label>
                    <input
                      type="text"
                      value={content[`feature_${i}_title`] || ''}
                      onChange={(e) => updateContent(`feature_${i}_title`, e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Descripción</label>
                    <input
                      type="text"
                      value={content[`feature_${i}_desc`] || ''}
                      onChange={(e) => updateContent(`feature_${i}_desc`, e.target.value)}
                      className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ====== FEATURED PRODUCTS SECTION ====== */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🔥 Sección Productos Destacados</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Badge</label>
              <input
                type="text"
                value={content.featured_badge || ''}
                onChange={(e) => updateContent('featured_badge', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Título</label>
              <input
                type="text"
                value={content.featured_title || ''}
                onChange={(e) => updateContent('featured_title', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
          </div>
        </div>

        {/* ====== CTA / NEWSLETTER SECTION ====== */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📧 Sección CTA / Newsletter</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Título</label>
              <input
                type="text"
                value={content.cta_title || ''}
                onChange={(e) => updateContent('cta_title', e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Subtítulo</label>
              <textarea
                value={content.cta_subtitle || ''}
                onChange={(e) => updateContent('cta_subtitle', e.target.value)}
                rows={2}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)] resize-none"
              />
            </div>
          </div>
        </div>

        {/* ====== CONTACT / FOOTER INFO ====== */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📞 Información de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Número de WhatsApp (Ventas)</label>
              <input
                type="text"
                value={settings.whatsapp_number}
                onChange={(e) => setSettingsState({ ...settings, whatsapp_number: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
              <p className="text-xs text-gray-500 mt-1">Incluye el código de país sin el signo +</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
              <input
                type="email"
                value={settings.contact_email}
                onChange={(e) => setSettingsState({ ...settings, contact_email: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Teléfono (para Footer)</label>
              <input
                type="text"
                value={settings.contact_phone}
                onChange={(e) => setSettingsState({ ...settings, contact_phone: e.target.value })}
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
          </div>
        </div>

        {/* ====== PROMO BANNER ====== */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">🏷️ Banner Promocional</h3>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje Promocional (Banner Superior)</label>
            <input
              type="text"
              value={settings.promo_banner_text}
              onChange={(e) => setSettingsState({ ...settings, promo_banner_text: e.target.value })}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
            />
          </div>
        </div>

        {/* ====== FOOTER ====== */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">📝 Footer — Descripción</h3>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Descripción de la marca (Footer)</label>
            <textarea
              value={content.footer_description || ''}
              onChange={(e) => updateContent('footer_description', e.target.value)}
              rows={3}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)] resize-none"
            />
          </div>
        </div>

        {/* Save button at bottom too */}
        <div className="flex justify-end pb-8">
          <button
            onClick={handleSaveAll}
            disabled={saving}
            className="bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl transition-colors flex items-center shadow-lg disabled:opacity-50"
          >
            {saving ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" /> Guardar Todos los Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
