'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Truck, Shield, Star } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useState } from 'react';

// Using mock data for now with rich HTML descriptions
const mockProducts = [
  {
    id: 1,
    name: "Classic Black Snapback",
    price: 29.99,
    description: "La gorra clásica que no puede faltar en tu colección. Diseño minimalista con logo bordado en 3D.",
    htmlDescription: `
      <h2>Diseño Atemporal</h2>
      <p>La <strong>Classic Black Snapback</strong> es el pilar de cualquier estilo urbano. Diseñada para aquellos que aprecian el minimalismo sin comprometer la calidad.</p>
      
      <h3>Detalles Premium</h3>
      <ul>
        <li>Logotipo frontal bordado en relieve 3D de alta definición.</li>
        <li>Banda absorbente interior de algodón para máximo confort.</li>
        <li>Ajuste clásico tipo Snapback para todas las medidas.</li>
      </ul>

      <img src="https://images.unsplash.com/photo-1556306535-0f09a536f01f?auto=format&fit=crop&q=80&w=800" alt="Detalle lateral de gorra" />
      
      <h3>Materiales</h3>
      <p>Fabricada con una mezcla de 80% algodón orgánico y 20% poliéster reciclado, garantizando resistencia al desgaste y pérdida de color con el tiempo.</p>
    `,
    image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600",
    category: "Snapback"
  },
  {
    id: 2,
    name: "Urban Gold Edition",
    price: 34.99,
    description: "Edición limitada con detalles dorados reflectantes. Perfecta para destacar en la ciudad.",
    htmlDescription: `
      <h2>Exclusividad Urbana</h2>
      <p>Nuestra <strong>Urban Gold Edition</strong> es una pieza de colección limitada. Hemos diseñado esta gorra combinando la oscuridad de la noche urbana con destellos dorados inconfundibles.</p>
      
      <h3>¿Por qué elegir esta edición?</h3>
      <ul>
        <li>Detalles en hilo de oro de 18k sintético en el logo frontal.</li>
        <li>Visera inferior verde clásica para protección solar superior.</li>
        <li>Edición de unidades limitadas, nunca se volverá a producir.</li>
      </ul>

      <video autoplay loop muted playsinline>
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4">
        Tu navegador no soporta videos.
      </video>
      
      <p>Lleva tu estilo a otro nivel y haz que las miradas se centren en ti con esta pieza exclusiva de FV Hats.</p>
    `,
    image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=600",
    category: "Premium"
  },
];

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  // Fallback to first product if ID not found in mock data
  const product = mockProducts.find(p => p.id === Number(id)) || mockProducts[0];

  const handleAddToCart = () => {
    // Add multiple times based on quantity
    for (let i = 0; i < quantity; i++) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image
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
            <div className="relative aspect-square lg:aspect-auto lg:h-[600px] bg-white/5">
              <Image 
                src={product.image} 
                alt={product.name} 
                fill 
                className="object-cover"
                priority
              />
              <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                {product.category}
              </div>
            </div>

            {/* Product Info */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <div className="flex items-center space-x-1 mb-4 text-[var(--color-brand-gold)]">
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <Star className="w-4 h-4 fill-current" />
                <span className="text-gray-400 text-sm ml-2">(45 opiniones)</span>
              </div>

              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
                {product.name}
              </h1>
              
              <div className="text-3xl font-bold text-[var(--color-brand-purple)] mb-6">
                ${product.price}
              </div>
              
              <p className="text-gray-400 text-lg mb-8 leading-relaxed border-b border-white/10 pb-8">
                {product.description}
              </p>

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
        <div className="mt-16 bg-[#0a0a0a] rounded-3xl border border-white/5 p-8 lg:p-12">
          <div 
            className="rich-text-container max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: product.htmlDescription || '' }}
          />
        </div>

      </div>
    </div>
  );
}
