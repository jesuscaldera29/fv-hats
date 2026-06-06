'use client';

import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function Catalog() {
  const { addToCart } = useCart();
  
  // Mock data for catalog
  const products = [
    {
      id: 1,
      name: "Classic Black Snapback",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600",
      category: "Snapback"
    },
    {
      id: 2,
      name: "Urban Gold Edition",
      price: "$34.99",
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=600",
      category: "Premium"
    },
    {
      id: 3,
      name: "Purple Haze Trucker",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1556306535-0f09a536f01f?auto=format&fit=crop&q=80&w=600",
      category: "Trucker"
    },
    {
      id: 4,
      name: "Minimalist White Cap",
      price: "$27.99",
      image: "https://images.unsplash.com/photo-1521369909029-2afed882baee?auto=format&fit=crop&q=80&w=600",
      category: "Dad Hat"
    },
    {
      id: 5,
      name: "Vintage Denim Cap",
      price: "$31.99",
      image: "https://images.unsplash.com/photo-1534215754734-18e55d13e346?auto=format&fit=crop&q=80&w=600",
      category: "Dad Hat"
    },
    {
      id: 6,
      name: "Neon Nights Trucker",
      price: "$26.99",
      image: "https://images.unsplash.com/photo-1580428180098-24b353d7e9d9?auto=format&fit=crop&q=80&w=600",
      category: "Trucker"
    },
    {
      id: 7,
      name: "Camo Essential",
      price: "$28.99",
      image: "https://images.unsplash.com/photo-1552554705-cb665bbbc5bc?auto=format&fit=crop&q=80&w=600",
      category: "Snapback"
    },
    {
      id: 8,
      name: "Royal Purple Exclusive",
      price: "$39.99",
      image: "https://images.unsplash.com/photo-1575428652377-a2d80b2273fd?auto=format&fit=crop&q=80&w=600",
      category: "Premium"
    }
  ];

  const categories = ["Todos", "Snapback", "Trucker", "Dad Hat", "Premium"];

  return (
    <div className="bg-[var(--color-brand-black)] min-h-screen pt-10 pb-24">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10"
      >
        <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">CATÁLOGO</h1>
        <p className="text-gray-400 max-w-2xl text-lg">
          Explora nuestra colección completa. Diseños exclusivos para cada estilo.
        </p>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Filters */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="w-full md:w-64 flex-shrink-0 space-y-8"
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-white font-bold uppercase tracking-wider text-sm flex items-center">
                <Filter className="w-4 h-4 mr-2" /> Categorías
              </h3>
            </div>
            <ul className="space-y-2">
              {categories.map((cat, idx) => (
                <li key={cat}>
                  <button className={`text-left w-full px-3 py-2 rounded-lg transition-colors ${idx === 0 ? 'bg-[var(--color-brand-purple)] text-white font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-wider text-sm mb-4">Rango de Precio</h3>
            <div className="flex items-center space-x-4">
              <input type="number" placeholder="Min" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]" />
              <span className="text-gray-500">-</span>
              <input type="number" placeholder="Max" className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]" />
            </div>
          </div>
        </motion.div>

        {/* Product Grid */}
        <div className="flex-1">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex justify-between items-center mb-6"
          >
            <span className="text-gray-400 text-sm">{products.length} productos</span>
            <button className="flex items-center text-white text-sm bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors">
              Ordenar por <ChevronDown className="ml-2 w-4 h-4" />
            </button>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product, idx) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 * idx }}
                className="group bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors flex flex-col"
              >
                <Link href={`/catalog/${product.id}`} className="relative aspect-square overflow-hidden block">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider">
                    {product.category}
                  </div>
                </Link>
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white group-hover:text-[var(--color-brand-gold)] transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-[var(--color-brand-purple)] font-medium mt-1 text-lg">{product.price}</p>
                  </div>
                  <button 
                    onClick={() => addToCart({ id: product.id, name: product.name, price: parseFloat(product.price.replace('$', '')), image: product.image })}
                    className="w-full mt-4 bg-white/5 hover:bg-[var(--color-brand-gold)] text-white hover:text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center active:scale-95"
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" /> Agregar
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
          
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-12 flex justify-center"
          >
            <button className="border border-white/20 text-white px-8 py-3 rounded-full font-bold hover:bg-white/10 transition-colors active:scale-95">
              Cargar Más
            </button>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
