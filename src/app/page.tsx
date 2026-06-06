'use client';

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Star, ShieldCheck, Truck } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { motion } from "framer-motion";

export default function Home() {
  const { addToCart } = useCart();
  
  // Mock data for featured products
  const featuredProducts = [
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
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/80 to-[var(--color-brand-black)] z-10" />
          <motion.div
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="w-full h-full"
          >
            <Image 
              src="https://images.unsplash.com/photo-1517554619711-2eb2a1d2e1b9?auto=format&fit=crop&q=80&w=1920" 
              alt="Hero Background" 
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.span 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-[var(--color-brand-gold)] font-bold tracking-widest uppercase mb-4 block text-sm"
          >
            Nueva Colección 2026
          </motion.span>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-3xl sm:text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter leading-tight break-words"
          >
            ELEVA TU ESTILO <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-brand-gold)] to-[var(--color-brand-purple)]">
              A OTRO NIVEL
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="text-gray-300 text-lg md:text-xl mb-10 max-w-2xl mx-auto font-light"
          >
            Gorras premium con diseños exclusivos. Encuentra la pieza perfecta que define tu actitud.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/catalog" className="w-full sm:w-auto bg-[var(--color-brand-gold)] text-black px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-yellow-400 transition-all flex items-center justify-center transform hover:scale-105">
              Ver Catálogo <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="#destacados" className="w-full sm:w-auto border border-white/20 text-white px-8 py-4 rounded-full font-bold uppercase tracking-wide hover:bg-white/10 transition-all flex items-center justify-center">
              Más Vendidos
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 bg-[#0a0a0a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            {[
              { icon: Star, title: "Calidad Premium", desc: "Materiales de la más alta calidad para mayor durabilidad.", color: "text-[var(--color-brand-gold)]" },
              { icon: Truck, title: "Envíos Rápidos", desc: "Entrega segura a todo el país en tiempo récord.", color: "text-[var(--color-brand-purple)]" },
              { icon: ShieldCheck, title: "Compra Segura", desc: "Checkout fácil y rápido directo desde WhatsApp.", color: "text-[var(--color-brand-gold)]" }
            ].map((feature, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="flex flex-col items-center p-6 rounded-2xl bg-white/5 hover:bg-white/10 transition-colors"
              >
                <feature.icon className={`h-10 w-10 mb-4 ${feature.color}`} />
                <h3 className="text-white font-bold mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section id="destacados" className="py-20 bg-[var(--color-brand-black)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex justify-between items-end mb-12"
          >
            <div>
              <span className="text-[var(--color-brand-purple)] font-bold tracking-widest uppercase text-sm block mb-2">
                Selección Exclusiva
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight break-words">MÁS VENDIDOS</h2>
            </div>
            <Link href="/catalog" className="text-gray-400 hover:text-[var(--color-brand-gold)] flex items-center transition-colors pb-2">
              Ver todos <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {featuredProducts.map((product, idx) => (
              <motion.div 
                key={product.id} 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="group cursor-pointer"
              >
                <div className="relative aspect-square overflow-hidden rounded-2xl bg-white/5 mb-4">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button 
                      onClick={() => addToCart({ id: product.id, name: product.name, price: parseFloat(product.price.replace('$', '')), image: product.image })}
                      className="bg-[var(--color-brand-gold)] text-black px-6 py-2 rounded-full font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 active:scale-95"
                    >
                      Añadir al Carrito
                    </button>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{product.category}</p>
                  <h3 className="text-lg font-bold text-white group-hover:text-[var(--color-brand-gold)] transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[var(--color-brand-purple)] font-medium mt-1">{product.price}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter / CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[var(--color-brand-purple)] opacity-20 z-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-brand-black)] to-transparent z-0" />
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto px-4 text-center relative z-10"
        >
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-6 break-words">ÚNETE A LA FAMILIA FV</h2>
          <p className="text-gray-300 text-lg mb-8">
            Recibe acceso anticipado a nuevas colecciones y descuentos exclusivos.
          </p>
          <form className="flex flex-col sm:flex-row max-w-md mx-auto gap-2" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Tu correo electrónico" 
              className="flex-1 bg-white/10 border border-white/20 rounded-full px-6 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
            />
            <button type="submit" className="bg-white text-black px-8 py-3 rounded-full font-bold hover:bg-[var(--color-brand-gold)] transition-colors active:scale-95">
              Suscribirme
            </button>
          </form>
        </motion.div>
      </section>

    </div>
  );
}
