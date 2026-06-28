'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Search, Edit2, Trash2, X, Loader2, Save, ImagePlus, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import ImageUploader from '@/components/admin/ImageUploader';
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductImages,
  addProductImage,
  deleteProductImage,
} from '@/app/admin/actions';

type Product = {
  id: number;
  name: string;
  description: string;
  rich_description: string | null;
  price: number;
  image: string;
  category: string;
  stock: number;
  is_active: boolean;
  is_featured: boolean;
};

type ProductImage = {
  id: number;
  product_id: number;
  image_url: string;
  sort_order: number;
};

const CATEGORIES = ['Snapback', 'Trucker', 'Dad Hat', 'Premium', 'Fitted', 'Beanie'];

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Gallery state
  const [galleryProductId, setGalleryProductId] = useState<number | null>(null);
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    rich_description: '',
    price: '',
    image: '',
    category: CATEGORIES[0],
    stock: '0',
    is_active: true,
    is_featured: false,
  });

  // Delete confirmation
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const showToast = useCallback((message: string, type: 'success' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  }, []);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    const data = await getProducts();
    setProducts(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const openCreateModal = () => {
    setEditingProduct(null);
    setFormData({
      name: '',
      description: '',
      rich_description: '',
      price: '',
      image: '',
      category: CATEGORIES[0],
      stock: '0',
      is_active: true,
      is_featured: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      rich_description: product.rich_description || '',
      price: String(product.price),
      image: product.image,
      category: product.category,
      stock: String(product.stock),
      is_active: product.is_active,
      is_featured: product.is_featured,
    });
    setIsModalOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.price || !formData.image) {
      showToast('Nombre, precio e imagen son obligatorios', 'error');
      return;
    }

    setSaving(true);
    const payload = {
      name: formData.name,
      description: formData.description,
      rich_description: formData.rich_description || undefined,
      price: parseFloat(formData.price),
      image: formData.image,
      category: formData.category,
      stock: parseInt(formData.stock) || 0,
      is_active: formData.is_active,
      is_featured: formData.is_featured,
    };

    let result;
    if (editingProduct) {
      result = await updateProduct(editingProduct.id, payload);
    } else {
      result = await createProduct(payload);
    }

    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast(editingProduct ? 'Producto actualizado' : 'Producto creado', 'success');
      setIsModalOpen(false);
      loadProducts();
    }
    setSaving(false);
  };

  const handleDelete = async (id: number) => {
    const result = await deleteProduct(id);
    if (result.error) {
      showToast(result.error, 'error');
    } else {
      showToast('Producto eliminado', 'success');
      loadProducts();
    }
    setDeleteConfirm(null);
  };

  const toggleActive = async (product: Product) => {
    const result = await updateProduct(product.id, { is_active: !product.is_active });
    if (!result.error) {
      loadProducts();
    }
  };

  // Gallery
  const openGallery = async (productId: number) => {
    setGalleryProductId(productId);
    setGalleryLoading(true);
    const images = await getProductImages(productId);
    setGalleryImages(images);
    setGalleryLoading(false);
  };

  const handleAddGalleryImage = async (url: string) => {
    if (!galleryProductId) return;
    await addProductImage(galleryProductId, url, galleryImages.length);
    const images = await getProductImages(galleryProductId);
    setGalleryImages(images);
    showToast('Imagen añadida a la galería', 'success');
  };

  const handleDeleteGalleryImage = async (imageId: number) => {
    await deleteProductImage(imageId);
    if (galleryProductId) {
      const images = await getProductImages(galleryProductId);
      setGalleryImages(images);
    }
    showToast('Imagen eliminada de la galería', 'success');
  };

  // Filtering
  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesStatus =
      !filterStatus ||
      (filterStatus === 'Activo' && p.is_active) ||
      (filterStatus === 'Inactivo' && !p.is_active);
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const uniqueCategories = [...new Set(products.map((p) => p.category))];

  return (
    <div>
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-6 right-6 z-[100] px-6 py-3 rounded-xl font-medium shadow-2xl animate-[slideIn_0.3s_ease] ${
            toast.type === 'success'
              ? 'bg-green-500/90 text-white'
              : 'bg-red-500/90 text-white'
          }`}
        >
          {toast.message}
        </div>
      )}

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-black text-white">Productos</h1>
          <p className="text-gray-400">Gestiona el catálogo de tu tienda.</p>
        </div>
        <button
          onClick={openCreateModal}
          className="bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]"
            />
          </div>
          <div className="flex space-x-2">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]"
            >
              <option value="">Categoría</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]"
            >
              <option value="">Estado</option>
              <option>Activo</option>
              <option>Inactivo</option>
            </select>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-[var(--color-brand-gold)] animate-spin" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg mb-2">No hay productos</p>
            <p className="text-sm">Crea tu primer producto para empezar</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#0a0a0a] text-xs uppercase text-gray-500">
                <tr>
                  <th className="px-6 py-4 font-medium">Producto</th>
                  <th className="px-6 py-4 font-medium">Categoría</th>
                  <th className="px-6 py-4 font-medium">Precio</th>
                  <th className="px-6 py-4 font-medium">Inventario</th>
                  <th className="px-6 py-4 font-medium">Estado</th>
                  <th className="px-6 py-4 font-medium text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-4">
                        <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                        <span className="text-white font-medium">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4 text-white font-medium">
                      ${Number(product.price).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">{product.stock} unds.</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleActive(product)}
                        className={`px-2 py-1 rounded-full text-xs font-bold cursor-pointer transition-colors ${
                          product.is_active
                            ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                            : 'bg-red-500/20 text-red-400 hover:bg-red-500/30'
                        }`}
                      >
                        {product.is_active ? 'Activo' : 'Inactivo'}
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => openGallery(product.id)}
                          title="Galería de imágenes"
                          className="text-gray-400 hover:text-[var(--color-brand-purple)] transition-colors p-1"
                        >
                          <ImagePlus className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => openEditModal(product)}
                          title="Editar"
                          className="text-gray-400 hover:text-white transition-colors p-1"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {deleteConfirm === product.id ? (
                          <div className="flex items-center space-x-1">
                            <button
                              onClick={() => handleDelete(product.id)}
                              className="text-red-400 hover:text-red-300 text-xs font-bold"
                            >
                              Sí
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(null)}
                              className="text-gray-500 hover:text-white text-xs"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirm(product.id)}
                            title="Eliminar"
                            className="text-gray-400 hover:text-red-400 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">
                {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Image */}
              <ImageUploader
                currentImage={formData.image || null}
                onImageUploaded={(url) => setFormData({ ...formData, image: url })}
                onImageRemoved={() => setFormData({ ...formData, image: '' })}
                label="Imagen Principal *"
                aspectRatio="aspect-video"
              />

              {/* Name + Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                    placeholder="Nombre del producto"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Categoría
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price + Stock */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Precio *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
                    placeholder="0"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Descripción Corta
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={2}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)] resize-none"
                  placeholder="Descripción breve del producto..."
                />
              </div>

              {/* Rich Description */}
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">
                  Descripción Completa (HTML)
                </label>
                <textarea
                  value={formData.rich_description}
                  onChange={(e) => setFormData({ ...formData, rich_description: e.target.value })}
                  rows={6}
                  className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)] resize-none font-mono text-xs"
                  placeholder="<h2>Título</h2><p>Descripción detallada con HTML...</p>"
                />
                <p className="text-xs text-gray-600 mt-1">
                  Puedes usar etiquetas HTML: &lt;h2&gt;, &lt;h3&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, &lt;img&gt;
                </p>
              </div>

              {/* Toggles */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="w-5 h-5 rounded bg-[#0a0a0a] border-white/20 text-[var(--color-brand-gold)] focus:ring-[var(--color-brand-gold)]"
                  />
                  <span className="text-sm text-gray-300 flex items-center">
                    <Eye className="w-4 h-4 mr-1" /> Activo
                  </span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-5 h-5 rounded bg-[#0a0a0a] border-white/20 text-[var(--color-brand-gold)] focus:ring-[var(--color-brand-gold)]"
                  />
                  <span className="text-sm text-gray-300">⭐ Destacado</span>
                </label>
              </div>
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
                    {editingProduct ? 'Actualizar' : 'Crear Producto'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Gallery Modal */}
      {galleryProductId && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/70 backdrop-blur-sm overflow-y-auto py-8 px-4">
          <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-white/10">
              <h2 className="text-xl font-bold text-white">Galería de Imágenes</h2>
              <button
                onClick={() => setGalleryProductId(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              <ImageUploader
                currentImage={null}
                onImageUploaded={handleAddGalleryImage}
                label="Agregar Imagen a la Galería"
                aspectRatio="aspect-video"
              />

              {galleryLoading ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="w-6 h-6 text-[var(--color-brand-gold)] animate-spin" />
                </div>
              ) : galleryImages.length === 0 ? (
                <p className="text-gray-500 text-center py-4 text-sm">
                  No hay imágenes adicionales en la galería
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-3">
                  {galleryImages.map((img) => (
                    <div
                      key={img.id}
                      className="relative aspect-square rounded-lg overflow-hidden group border border-white/10"
                    >
                      <Image
                        src={img.image_url}
                        alt="Gallery"
                        fill
                        className="object-cover"
                        unoptimized
                      />
                      <button
                        onClick={() => handleDeleteGalleryImage(img.id)}
                        className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
