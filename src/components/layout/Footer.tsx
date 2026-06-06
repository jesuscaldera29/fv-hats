import Link from 'next/link';
import { Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer id="contacto" className="bg-[#0a0a0a] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-black tracking-tighter text-white block">
              FV<span className="text-[var(--color-brand-gold)]">HATS</span>
            </Link>
            <p className="text-gray-400 max-w-xs text-sm leading-relaxed">
              Elevando tu estilo con la mejor selección de gorras premium. Diseño, calidad y actitud en cada pieza.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <Link href="/" className="hover:text-[var(--color-brand-gold)] transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-[var(--color-brand-gold)] transition-colors">Catálogo</Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-[var(--color-brand-gold)] transition-colors">Preguntas Frecuentes</Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold uppercase tracking-wider mb-4">Contacto</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-[var(--color-brand-purple)]" />
                <span>+52 1 234 567 8900</span>
              </li>
              <li className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-[var(--color-brand-purple)]" />
                <span>Envíos a todo el país</span>
              </li>
            </ul>
            
            <div className="flex space-x-4 mt-6">
              {/* Add social media links here later */}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} FV Hats. Todos los derechos reservados.</p>
          <p className="mt-2 md:mt-0">Diseñado con excelencia.</p>
        </div>
      </div>
    </footer>
  );
}
