'use client';

import { useState } from 'react';
import { Lock, Mail, ArrowRight, UserPlus } from 'lucide-react';
import { login, signup } from './actions';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    if (isLogin) {
      const result = await login(formData);
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      }
    } else {
      const result = await signup(formData);
      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        setSuccess(result.success);
        setIsLogin(true); // Switch back to login view after successful signup
      }
      setIsLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-brand-black)] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--color-brand-purple)]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[var(--color-brand-gold)]/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="text-center mb-10">
          <Link href="/" className="inline-block text-4xl font-black tracking-tighter text-white mb-2 hover:scale-105 transition-transform">
            FV<span className="text-[var(--color-brand-gold)]">HATS</span>
          </Link>
          <p className="text-gray-400 font-medium tracking-widest uppercase text-sm">
            Panel de Administración
          </p>
        </div>

        <div className="bg-[#0a0a0a] rounded-3xl border border-white/10 p-8 shadow-2xl backdrop-blur-xl">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta Administrador'}
          </h2>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-400 text-sm text-center">
              {success}
            </div>
          )}

          <form action={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="email" 
                  name="email"
                  defaultValue="fvhats10@gmail.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
                  placeholder="admin@fvhats.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input 
                  type="password" 
                  name="password"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:border-[var(--color-brand-gold)] transition-colors"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-[var(--color-brand-gold)] text-black font-bold py-4 rounded-xl mt-4 hover:bg-yellow-500 transition-colors flex items-center justify-center active:scale-95 disabled:opacity-50 disabled:active:scale-100"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Entrar al Panel' : 'Registrar Administrador'}
                  {isLogin ? <ArrowRight className="ml-2 w-5 h-5" /> : <UserPlus className="ml-2 w-5 h-5" />}
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }}
              className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-4"
            >
              {isLogin ? '¿Primera vez? Crea tu cuenta de admin' : 'Ya tengo cuenta, iniciar sesión'}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
