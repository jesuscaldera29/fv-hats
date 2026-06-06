import { Activity, DollarSign, Package, Users } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { name: 'Ventas Totales (Mes)', value: '$4,231.00', icon: DollarSign, color: 'text-green-400' },
    { name: 'Pedidos Pendientes', value: '12', icon: Activity, color: 'text-[var(--color-brand-purple)]' },
    { name: 'Productos Activos', value: '45', icon: Package, color: 'text-[var(--color-brand-gold)]' },
    { name: 'Visitas Hoy', value: '342', icon: Users, color: 'text-blue-400' },
  ];

  return (
    <div>
      <h1 className="text-3xl font-black text-white mb-8">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
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
            <div className="text-xs text-gray-500">
              <span className="text-green-400 font-medium">+12%</span> vs mes anterior
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Pedidos Recientes (Vía WhatsApp)</h3>
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-[#0a0a0a] rounded-xl border border-white/5">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 rounded-full bg-[var(--color-brand-purple)]/20 flex items-center justify-center text-[var(--color-brand-purple)] font-bold">
                    {`#${1020 + i}`}
                  </div>
                  <div>
                    <p className="text-white font-medium">Cliente Anónimo</p>
                    <p className="text-gray-400 text-xs">Hace {i * 2} horas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-bold">${(89.99 * i).toFixed(2)}</p>
                  <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-500 rounded-full font-medium">
                    Pendiente
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <button className="w-full bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-4 rounded-xl transition-colors flex items-center justify-center">
              <Package className="w-4 h-4 mr-2" /> Añadir Producto
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-colors text-center">
              Actualizar Banners
            </button>
            <button className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 px-4 rounded-xl transition-colors text-center">
              Configurar WhatsApp
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
