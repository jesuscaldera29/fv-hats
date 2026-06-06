'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Package, Settings, Home, LogOut, LayoutDashboard } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Productos', href: '/admin/products', icon: Package },
    { name: 'Configuración', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-64 bg-[var(--color-brand-black)] border-r border-white/10 hidden md:flex flex-col">
        <div className="p-6">
          <h2 className="text-white font-black text-xl tracking-wider">ADMIN PANEL</h2>
          <p className="text-[var(--color-brand-gold)] text-xs font-bold uppercase mt-1">FV Hats</p>
        </div>
        
        <nav className="flex-1 px-4 space-y-2 mt-4">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive 
                    ? 'bg-[var(--color-brand-purple)] text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10 space-y-2">
          <Link
            href="/"
            className="flex items-center space-x-3 px-4 py-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
          >
            <Home className="w-5 h-5" />
            <span className="font-medium">Volver a Tienda</span>
          </Link>
          <button className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-white/5 rounded-lg transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}
