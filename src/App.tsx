/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Layers, 
  Plus, 
  RefreshCcw, 
  Users,
  AlertCircle,
  Github
} from 'lucide-react';
import { Developer, DeveloperFormData } from './types';
import { developerService } from './services/developerService';
import { supabase } from './lib/supabase';
import DeveloperCard from './components/DeveloperCard';
import DeveloperForm from './components/DeveloperForm';
import SearchFilters from './components/SearchFilters';
import AuthScreen from './components/AuthScreen';
import { Session } from '@supabase/supabase-js';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [currentOwnerId, setCurrentOwnerId] = useState<string>('');

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        setCurrentOwnerId(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        setCurrentOwnerId(session.user.id);
      } else {
        setCurrentOwnerId('');
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchDevelopers = async () => {
    setIsLoading(true);
    try {
      const data = await developerService.getDevelopers();
      setDevelopers(data);
    } catch (err) {
      setError('Falha ao carregar desenvolvedores.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopers();
  }, [session]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const handleOpenCreate = () => {
    setEditingDeveloper(null);
    setIsFormOpen(true);
  };

  const handleOpenEdit = (developer: Developer) => {
    setEditingDeveloper(developer);
    setIsFormOpen(true);
  };

  const handleSubmitForm = async (data: DeveloperFormData) => {
    try {
      if (editingDeveloper) {
        const updated = await developerService.updateDeveloper(editingDeveloper.id, data);
        setDevelopers((prev) => prev.map((d) => (d.id === editingDeveloper.id ? updated : d)));
      } else {
        const newDev = await developerService.addDeveloper(data);
        setDevelopers((prev) => [newDev, ...prev]);
      }
    } catch (err) {
      console.error(err);
      alert('Erro ao salvar desenvolvedor.');
    }
  };

  const filteredDevelopers = useMemo(() => {
    return developers.filter((dev) => {
      const matchesSearch = 
        dev.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dev.interestArea.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesArea = areaFilter === 'Todas' || dev.currentArea === areaFilter;
      return matchesSearch && matchesArea;
    });
  }, [developers, searchTerm, areaFilter]);

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-black text-gray-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Header / Hero Section */}
      <header className="relative py-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-end mb-8">
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/50 text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Sign Out
            </button>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit"
              >
                <Terminal className="w-4 h-4 text-brand-primary" />
                <span className="text-[10px] font-bold text-brand-primary uppercase tracking-widest">Enterprise Dev Directory</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-7xl md:text-8xl font-[900] uppercase tracking-tighter leading-none"
              >
                DEV<span className="text-brand-primary text-glow italic">CONNECT.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-lg text-gray-400 max-w-xl font-medium leading-relaxed"
              >
                O hub definitivo de talentos técnicos. Conecte-se com desenvolvedores de alta performance, 
                compartilhe seu perfil profissional e impulsione sua carreira criando conexões que geram oportunidades reais. ⚡
              </motion.p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleOpenCreate}
              className="flex items-center gap-4 px-10 py-6 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest transition-all neon-glow shadow-brand-primary/60 group relative overflow-hidden"
            >
              <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" />
              Ingressar na Plataforma
            </motion.button>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-col md:flex-row items-center p-8 border border-white/10 bg-surface-card/40 backdrop-blur-2xl rounded-3xl relative overflow-hidden gap-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/5 to-transparent pointer-events-none" />
            
            {/* User Count */}
            <div className="flex items-center gap-6 relative z-10 shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <Users className="w-7 h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] mb-1">Membros Ativos no Hub</span>
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-mono font-black text-white">
                    {developers.length}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[10px] font-mono text-emerald-500 font-bold tracking-tighter uppercase">Protocolo: LIVE</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Developers Ticker */}
            <div className="flex-1 w-full overflow-hidden relative z-10 hidden md:block">
              <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#020203] to-transparent z-20" />
              <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#020203] to-transparent z-20" />
              
              <motion.div 
                animate={{ x: [0, -2000] }}
                transition={{ 
                  duration: 40, 
                  repeat: Infinity, 
                  ease: "linear"
                }}
                className="flex items-center whitespace-nowrap gap-12"
              >
                {/* We repeat the list multiple times to ensure a seamless infinite loop */}
                {Array.from({ length: 10 }).map((_, repeatIdx) => (
                  <React.Fragment key={repeatIdx}>
                    {developers.map((dev) => (
                      <div key={`${repeatIdx}-${dev.id}`} className="flex items-center gap-4">
                        <span className="text-xs font-mono font-black text-white/50 uppercase tracking-[0.2em]">
                          {dev.name.split(' ')[0]} <span className="text-brand-primary font-light">[{dev.currentArea || 'DEV'}]</span>
                        </span>
                        <div className="w-1.5 h-1.5 rounded-full bg-white/10" />
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </motion.div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pb-40">
        <SearchFilters 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          areaFilter={areaFilter}
          onAreaFilterChange={setAreaFilter}
        />

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40 gap-6">
            <div className="relative">
              <RefreshCcw className="w-12 h-12 text-brand-primary animate-spin" />
              <div className="absolute inset-0 blur-xl bg-brand-primary/20 animate-pulse" />
            </div>
            <p className="text-gray-500 font-mono text-xs tracking-[0.2em] font-bold">SYNCHRONIZING_DATABASE...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-40 gap-4 text-red-500">
            <AlertCircle className="w-12 h-12" />
            <p className="font-bold uppercase tracking-[0.1em]">{error}</p>
            <button onClick={fetchDevelopers} className="text-brand-primary hover:text-brand-secondary transition-colors font-bold uppercase text-xs tracking-widest">Recarregar Sistema</button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              <AnimatePresence mode="popLayout">
                {filteredDevelopers.map((dev) => (
                  <DeveloperCard 
                    key={dev.id} 
                    developer={dev} 
                    onEdit={dev.ownerId === currentOwnerId ? handleOpenEdit : undefined}
                  />
                ))}
              </AnimatePresence>
            </div>
            
            {filteredDevelopers.length === 0 && (
              <div className="flex flex-col items-center justify-center py-40 gap-4 text-gray-600 border border-dashed border-white/5 rounded-4xl bg-white/[0.01]">
                <Layers className="w-16 h-16 opacity-10" />
                <p className="text-xl font-bold uppercase tracking-tight text-gray-500">Nenhum nó encontrado</p>
                <p className="text-sm opacity-60">Ajuste os parâmetros de busca ou filtros.</p>
              </div>
            )}
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-16 bg-surface-card/30">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-start justify-between gap-12">
          <div className="flex flex-col gap-4">
            <p className="text-3xl font-black tracking-tighter uppercase leading-none">Dev<span className="text-brand-primary">Connect.</span></p>
            <p className="text-gray-500 text-sm max-w-[340px] leading-relaxed">
              Elevando o networking profissional para desenvolvedores através de uma interface de alta performance e tecnologia de ponta.
            </p>
          </div>
          <div className="flex gap-12">
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Recursos</p>
              <nav className="flex flex-col gap-2 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Comunidade</a>
                <a href="#" className="hover:text-white transition-colors">Documentação</a>
                <a href="#" className="hover:text-white transition-colors">API Open Source</a>
              </nav>
            </div>
            <div className="flex flex-col gap-4">
              <p className="text-[10px] font-bold text-indigo-500 uppercase tracking-widest">Plataforma</p>
              <nav className="flex flex-col gap-2 text-sm text-gray-400">
                <a href="#" className="hover:text-white transition-colors">Segurança</a>
                <a href="#" className="hover:text-white transition-colors">Termos</a>
                <a href="#" className="hover:text-white transition-colors">SLA</a>
              </nav>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-4">
          <p className="text-gray-500 text-[11px] uppercase font-black tracking-[0.2em] flex items-center gap-2">
            © 2026 • Desenvolvido por <span className="text-white hover:text-brand-primary transition-colors cursor-default">Patricia Oliveira</span>
          </p>
          <a 
            href="https://github.com/Savarezi" 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-2 rounded-full border border-white/10 hover:border-brand-primary/50 text-gray-400 hover:text-white transition-all bg-white/[0.02]"
          >
            <Github className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">Connect on GitHub</span>
          </a>
        </div>
      </footer>

      {/* Modals */}
      <DeveloperForm 
        isOpen={isFormOpen} 
        onClose={() => setIsFormOpen(false)} 
        onSubmit={handleSubmitForm}
        initialDeveloper={editingDeveloper}
      />
    </div>
  );
}
