import { Save } from 'lucide-react';

export default function AdminSettings() {
  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-white">Configuración</h1>
        <p className="text-gray-400">Administra los datos generales de la tienda y métodos de contacto.</p>
      </div>

      <div className="space-y-8">
        
        {/* Contact Info */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Información de Contacto</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Número de WhatsApp (Ventas)</label>
              <input 
                type="text" 
                defaultValue="5212345678900"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
              <p className="text-xs text-gray-500 mt-1">Incluye el código de país sin el signo +</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
              <input 
                type="email" 
                defaultValue="contacto@fvhats.com"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-bold text-white mb-4">Apariencia</h3>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje Promocional (Banner Superior)</label>
              <input 
                type="text" 
                defaultValue="Envíos gratis en compras mayores a $99.00"
                className="w-full bg-[#0a0a0a] border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[var(--color-brand-gold)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Imagen de Fondo (Hero Banner)</label>
              <div className="flex items-center space-x-4">
                <div className="flex-1 bg-[#0a0a0a] border border-white/10 border-dashed rounded-lg p-6 text-center">
                  <p className="text-gray-400 text-sm">Arrastra tu imagen aquí o haz clic para subir</p>
                  <button className="mt-2 text-[var(--color-brand-gold)] text-sm font-bold">Seleccionar archivo</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button className="bg-[var(--color-brand-gold)] hover:bg-yellow-500 text-black font-bold py-3 px-8 rounded-xl transition-colors flex items-center shadow-lg">
            <Save className="w-5 h-5 mr-2" /> Guardar Cambios
          </button>
        </div>

      </div>
    </div>
  );
}
