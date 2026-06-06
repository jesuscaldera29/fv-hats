'use client';

import { useCart } from '@/context/CartContext';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import { playSuccessSound } from '@/utils/sounds';

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, updateQuantity, removeFromCart, totalPrice } = useCart();

  if (!isCartOpen) return null;

  const handleCheckout = () => {
    playSuccessSound();
    
    const phoneNumber = "5212345678900"; // Reemplazar con número real desde Settings
    
    let message = "Hola FV Hats, me gustaría hacer el siguiente pedido:\n\n";
    items.forEach((item) => {
      message += `- ${item.quantity}x ${item.name} (${item.price})\n`;
    });
    message += `\n*Total estimado: $${totalPrice.toFixed(2)}*`;
    message += "\n\nPor favor, confirmarme disponibilidad y métodos de pago.";

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    // Give sound a moment to start playing before jumping to WA
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 300);
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-[var(--color-brand-black)] border-l border-white/10 shadow-2xl z-[70] flex flex-col transform transition-transform duration-300 ease-in-out">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white flex items-center">
            <ShoppingBag className="w-5 h-5 mr-2 text-[var(--color-brand-gold)]" /> Tu Carrito
          </h2>
          <button 
            onClick={() => setIsCartOpen(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <ShoppingBag className="w-16 h-16 mb-4 opacity-20" />
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-white/5 flex-shrink-0">
                  <Image src={item.image} alt={item.name} fill className="object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-medium text-sm line-clamp-2">{item.name}</h3>
                    <p className="text-[var(--color-brand-purple)] font-bold mt-1 text-sm">{item.price}</p>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-3 bg-white/5 rounded-full px-3 py-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-white text-xs font-bold">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-400 hover:text-red-300 text-xs font-medium underline"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-white/10 bg-[#0a0a0a]">
            <div className="flex justify-between items-center mb-6">
              <span className="text-gray-400">Total</span>
              <span className="text-2xl font-black text-white">${totalPrice.toFixed(2)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center transform hover:scale-[1.02]"
            >
              Comprar por WhatsApp
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              Serás redirigido a WhatsApp para confirmar tu pedido.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
