'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Truck, Shield, Star, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';
import { getProduct, getProductImages } from '@/app/admin/actions';

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  rich_description: string | null;
  image: string;
  category: string;
};

type ProductImage = {
  id: number;
  image_url: string;
};

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [galleryImages, setGalleryImages] = useState<ProductImage[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (!id) return;
      const productId = Number(id);
      const [productData, imagesData] = await Promise.all([
        getProduct(productId),
        getProductImages(productId),
      ]);

      if (productData) {
        setProduct(productData);
        setSelectedImage(productData.image);
      }
      setGalleryImages(imagesData);
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="bg-[var(--color-brand-black)] min-h-screen flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-[var(--color-brand-gold)] animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="bg-[var(--color-brand-black)] min-h-screen pt-20 text-center">
        <h1 className="text-2xl font-bold text-white">Producto no encontrado</h1>
        <Link href="/catalog" className="text-[var(--color-brand-gold)] mt-4 inline-block hover:underline">
          Volver al catálogo
        </Link>
      </div>
    );
  }

  const allImages = [
    { id: 0, image_url: product.image },
    ...galleryImages,
  ];

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image,
      });
    }
  };

  return (
    <div className="bg-[var(--color-brand-black)] min-h-screen pt-8 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <Link href="/catalog" className="inline-flex items-center text-gray-400 hover:text-white transition-colors mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al Catálogo
        </Link>

        <div className="bg-[#0a0a0a] rounded-3xl border border-white/5 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Image Gallery */}
            <div className="p-4 lg:p-6">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-white/5 mb-4">
                <Image 
                  src={selectedImage} 
                  alt={product.name} 
                  fill 
                  className="object-cover"
                  priority
                  unoptimized
                />
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                  {product.category}
                </div>
              </div>

              {/* Thumbnails */}
              {allImages.length > 1 && (
                <div className="flex space-x-3 overflow-x-auto pb-2">
                  {allImages.map((img) => (
                    <button
                      key={img.id}
                      onClick={() => setSelectedImage(img.image_url)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                        selectedImage === img.image_url
                          ? 'border-[var(--color-brand-gold)] opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    >
                      <Image src={img.image_url} alt="Thumbnail" fill className="object-cover" unoptimized />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-1 mb-4 text-[var(--color-brand-gold)]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                {product.name}
              </h1>
              
              <div className="text-3xl font-bold text-[var(--color-brand-purple)] mb-6">
                ${Number(product.price).toFixed(2)}
              </div>
              
              {product.description && (
                <p className="text-gray-400 text-lg mb-8 leading-relaxed border-b border-white/10 pb-8">
                  {product.description}
                </p>
              )}

              <div className="space-y-6 mb-8">
                <div className="flex items-center text-gray-300">
                  <Truck className="w-5 h-5 mr-4 text-[var(--color-brand-gold)]" />
                  <span>Envío gratis a todo el país disponible</span>
                </div>
                <div className="flex items-center text-gray-300">
                  <Shield className="w-5 h-5 mr-4 text-[var(--color-brand-gold)]" />
                  <span>Garantía de calidad de 30 días</span>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <div className="flex items-center justify-between border border-white/20 rounded-xl px-4 py-3 bg-white/5 sm:w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-gray-400 hover:text-white text-xl font-medium px-2"
                  >-</button>
                  <span className="text-white font-bold">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-gray-400 hover:text-white text-xl font-medium px-2"
                  >+</button>
                </div>
                
                <button 
                  onClick={handleAddToCart}
                  className="flex-1 bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-4 rounded-xl transition-colors flex items-center justify-center text-lg transform hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Añadir al Carrito
                </button>
              </div>

            </div>
          </div>
        </div>

        {/* Detailed Description Section (Rich Text) */}
        {product.rich_description && (
          <div className="mt-16 bg-[#0a0a0a] rounded-3xl border border-white/5 p-8 lg:p-12">
            <div 
              className="rich-text-container max-w-4xl mx-auto"
              dangerouslySetInnerHTML={{ __html: product.rich_description }}
            />
          </div>
        )}

      </div>
    </div>
  );
}
