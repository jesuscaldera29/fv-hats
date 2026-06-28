'use client';

import Image from "next/image";
import Link from "next/link";
import { Filter, ChevronDown, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { getProducts } from "@/app/admin/actions";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
};

export default function Catalog() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [sortOrder, setSortOrder] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [showSortMenu, setShowSortMenu] = useState(false);

  useEffect(() => {
    async function load() {
      const data = await getProducts(true);
      setProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const categories = ['Todos', ...new Set(products.map((p) => p.category))];

  let filteredProducts = selectedCategory === 'Todos'
    ? products
    : products.filter((p) => p.category === selectedCategory);

  // Sort
  if (sortOrder === 'price_asc') {
    filteredProducts = [...filteredProducts].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sortOrder === 'price_desc') {
    filteredProducts = [...filteredProducts].sort((a, b) => Number(b.price) - Number(a.price));
  }

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
              {categories.map((cat) => (
                <li key={cat}>
                  <button
                    onClick={() => setSelectedCategory(cat)}
                    className={`text-left w-full px-3 py-2 rounded-lg transition-colors ${
                      selectedCategory === cat
                        ? 'bg-[var(--color-brand-purple)] text-white font-medium'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
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
            <span className="text-gray-400 text-sm">{filteredProducts.length} productos</span>
            <div className="relative">
              <button
                onClick={() => setShowSortMenu(!showSortMenu)}
                className="flex items-center text-white text-sm bg-white/5 px-4 py-2 rounded-lg hover:bg-white/10 transition-colors"
              >
                Ordenar por <ChevronDown className="ml-2 w-4 h-4" />
              </button>
              {showSortMenu && (
                <div className="absolute right-0 top-full mt-1 bg-[#111] border border-white/10 rounded-lg shadow-xl z-10 min-w-[160px]">
                  {[
                    { label: 'Más recientes', value: 'newest' as const },
                    { label: 'Precio: menor', value: 'price_asc' as const },
                    { label: 'Precio: mayor', value: 'price_desc' as const },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setSortOrder(opt.value); setShowSortMenu(false); }}
                      className={`block w-full text-left px-4 py-2.5 text-sm transition-colors ${
                        sortOrder === opt.value ? 'text-[var(--color-brand-gold)]' : 'text-gray-400 hover:text-white'
                      } hover:bg-white/5`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>

          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-[var(--color-brand-gold)] animate-spin" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-lg">No hay productos en esta categoría</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product, idx) => (
                <motion.div 
                  key={product.id} 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.05 * idx }}
                  className="group bg-[#0a0a0a] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-colors flex flex-col"
                >
                  <Link href={`/catalog/${product.id}`} className="relative aspect-square overflow-hidden block">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover transform group-hover:scale-110 transition-transform duration-700"
                      unoptimized
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
                      <p className="text-[var(--color-brand-purple)] font-medium mt-1 text-lg">
                        ${Number(product.price).toFixed(2)}
                      </p>
                    </div>
                    <button 
                      onClick={() => addToCart({ id: product.id, name: product.name, price: Number(product.price), image: product.image })}
                      className="w-full mt-4 bg-white/5 hover:bg-[var(--color-brand-gold)] text-white hover:text-black font-bold py-3 rounded-xl transition-all flex items-center justify-center active:scale-95"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" /> Agregar
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
