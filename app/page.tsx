// app/page.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Navigation,
  Search,
  MapPin,
  Calendar,
  Shield,
  Star,
  ArrowRight,
  Bus,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-cyan-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      {/* Top Bar with Logo and Theme Toggle */}
      <div className="absolute top-0 left-0 right-0 z-50 px-6 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center shadow-lg">
            <Navigation className="h-6 w-6 text-white" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-blue-500 bg-clip-text text-transparent">
            Travyotei
          </span>
        </Link>
        <ThemeToggle />
      </div>

      {/* Hero Section */}
      <div className="relative min-h-screen flex items-center justify-center px-4 py-20">
        <div className="max-w-7xl mx-auto w-full">
          {/* Main Content */}
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center px-4 py-2 bg-cyan-500/10 rounded-full border border-cyan-500/20 text-cyan-600 dark:text-cyan-400 text-sm font-bold uppercase tracking-widest mb-8"
            >
              Bienvenue sur Travyotei
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-tight"
            >
              Voyagez en toute
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500">
                Simplicité
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto mb-16"
            >
              La plateforme numérique qui connecte les voyageurs aux meilleures agences de transport au Cameroun
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link href="/agencies">
                <button className="group px-8 py-4 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl hover:scale-105 transition-all flex items-center gap-2">
                  Découvrir les agences
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </Link>
              <Link href="/search">
                <button className="px-8 py-4 bg-white dark:bg-slate-900 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 rounded-xl font-bold text-lg hover:border-cyan-500 dark:hover:border-cyan-500 transition-all flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Rechercher un trajet
                </button>
              </Link>
            </motion.div>
          </div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto mb-16"
          >
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                <Search className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Recherche facile
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Trouvez rapidement les meilleurs trajets selon vos critères
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Agences vérifiées
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Toutes nos agences partenaires sont certifiées et fiables
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200 dark:border-slate-800 hover:border-cyan-500 dark:hover:border-cyan-500 transition-all hover:shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center mb-4">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                Disponible 24/7
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Consultez les horaires et réservez à tout moment
              </p>
            </div>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
          >
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">50+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Agences</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">200+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Trajets/jour</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">1000+</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium">Voyageurs</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-2">4.8</div>
              <div className="text-sm text-slate-600 dark:text-slate-400 font-medium flex items-center justify-center gap-1">
                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                Satisfaction
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
