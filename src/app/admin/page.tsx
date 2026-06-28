'use client';

import { Activity, DollarSign, Package, Users } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getProducts, getTestimonials } from '@/app/admin/actions';
import Link from 'next/link';

export default function AdminDashboard() {
  const [productCount, setProductCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [testimonialCount, setTestimonialCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [products, testimonials] = await Promise.all([
        getProducts(),
        getTestimonials(),
      ]);
      setProductCount(products.length);
      setActiveCount(products.filter((p: { is_active: boolean }) => p.is_active).length);
      setTestimonialCount(testimonials.length);
      setLoading(false);
    }
    load();
  }, []);

  const stats = [
    { name: 'Productos Totales', value: loading ? '...' : String(productCount), icon: Package, color: 'text-[var(--color-brand-gold)]' },
    { name: 'Productos Activos', value: loading ? '...' : String(activeCount), icon: Activity, color: 'text-green-400' },
    { name: 'Testimonios', value: loading ? '...' : String(testimonialCount), icon: Users, color: 'text-[var(--color-brand-purple)]' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-gray-400 text-sm font-medium">{stat.name}</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stat.value}</h3>
              </div>
              <div className={`p-3 rounded-lg bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link
              href="/admin/products"
              className="w-full bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              <Package className="w-4 h-4 mr-2" /> Gestionar Productos
            </Link>
            <Link
              href="/admin/testimonials"
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              <Users className="w-4 h-4 mr-2" /> Gestionar Testimonios
            </Link>
            <Link
              href="/admin/settings"
              className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center"
            >
              Configurar Landing & Logo
            </Link>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Guía Rápida</h3>
          <div className="space-y-4 text-sm text-gray-400">
            <div className="flex items-start space-x-3">
              <span className="text-[var(--color-brand-gold)] font-bold text-lg">1</span>
              <p>Ve a <strong className="text-white">Productos</strong> para agregar gorras con imágenes, precios y descripción completa.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-[var(--color-brand-gold)] font-bold text-lg">2</span>
              <p>En <strong className="text-white">Testimonios</strong> agrega reseñas de clientes con su foto y calificación.</p>
            </div>
            <div className="flex items-start space-x-3">
              <span className="text-[var(--color-brand-gold)] font-bold text-lg">3</span>
              <p>En <strong className="text-white">Configuración</strong> edita todos los textos de la landing, el logo, imágenes de fondo y datos de contacto.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
