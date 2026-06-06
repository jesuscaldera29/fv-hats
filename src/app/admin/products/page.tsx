'use client';

import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import Image from 'next/image';

export default function AdminProducts() {
  const products = [
    {
      id: 1,
      name: "Classic Black Snapback",
      price: "$29.99",
      image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&q=80&w=600",
      category: "Snapback",
      stock: 45,
      status: 'Activo'
    },
    {
      id: 2,
      name: "Urban Gold Edition",
      price: "$34.99",
      image: "https://images.unsplash.com/photo-1576871337622-98d48d1cf531?auto=format&fit=crop&q=80&w=600",
      category: "Premium",
      stock: 12,
      status: 'Activo'
    },
    {
      id: 3,
      name: "Purple Haze Trucker",
      price: "$24.99",
      image: "https://images.unsplash.com/photo-1556306535-0f09a536f01f?auto=format&fit=crop&q=80&w=600",
      category: "Trucker",
      stock: 0,
      status: 'Agotado'
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-white">Productos</h1>
          <p className="text-gray-400">Gestiona el catálogo de tu tienda.</p>
        </div>
        <button className="bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-6 rounded-xl transition-colors flex items-center">
          <Plus className="w-5 h-5 mr-2" /> Nuevo Producto
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <div className="relative w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Buscar producto..." 
              className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]"
            />
          </div>
          <div className="flex space-x-2">
            <select className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]">
              <option>Categoría</option>
              <option>Snapback</option>
              <option>Trucker</option>
            </select>
            <select className="bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-2 text-white text-sm focus:outline-none focus:border-[var(--color-brand-gold)]">
              <option>Estado</option>
              <option>Activo</option>
              <option>Agotado</option>
            </select>
          </div>
        </div>

        {/* Table */}
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
              {products.map((product) => (
                <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-white/5">
                        <Image src={product.image} alt={product.name} fill className="object-cover" />
                      </div>
                      <span className="text-white font-medium">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">{product.category}</td>
                  <td className="px-6 py-4 text-white font-medium">{product.price}</td>
                  <td className="px-6 py-4">{product.stock} unds.</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                      product.status === 'Activo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white mr-3 transition-colors">
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-red-400 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
