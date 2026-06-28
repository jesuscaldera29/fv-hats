'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Menu, X, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { getSettings } from '@/app/admin/actions';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();
  const { setIsCartOpen, totalItems } = useCart();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    async function loadLogo() {
      const settings = await getSettings();
      if (settings?.logo_url) {
        setLogoUrl(settings.logo_url);
      }
    }
    loadLogo();
  }, []);

  const navLinks = [
    { name: 'Inicio', href: '/' },
    { name: 'Catálogo', href: '/catalog' },
    { name: 'Contacto', href: '#contacto' },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-md bg-black/80 border-b border-white/10 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              {logoUrl ? (
                <Image
                  src={logoUrl}
                  alt="Logo"
                  width={120}
                  height={40}
                  className="h-10 w-auto object-contain"
                  unoptimized
                />
              ) : (
                <span className="text-2xl font-black tracking-tighter text-white">
                  FV<span className="text-[var(--color-brand-gold)]">HATS</span>
                </span>
              )}
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-medium uppercase tracking-wider transition-colors duration-200 hover:text-[var(--color-brand-gold)] ${
                  pathname === link.href ? 'text-[var(--color-brand-gold)]' : 'text-gray-300'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Icons (Cart & Admin) */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/admin" className="text-gray-300 hover:text-white transition-colors">
              <User className="h-5 w-5" />
            </Link>
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-300 hover:text-[var(--color-brand-gold)] transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-brand-purple)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative text-gray-300 hover:text-[var(--color-brand-gold)] transition-colors mr-4"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-[var(--color-brand-purple)] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X className="h-7 w-7" /> : <Menu className="h-7 w-7" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0F0F0F] border-b border-white/10 absolute w-full">
          <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-4 text-base font-medium text-center border-b border-white/5 uppercase tracking-wider text-gray-300 hover:text-[var(--color-brand-gold)]"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-4 text-base font-medium text-center uppercase tracking-wider text-gray-300 hover:text-[var(--color-brand-purple)]"
            >
              Admin Dashboard
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
