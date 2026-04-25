/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, animate } from 'motion/react';
import { 
  Terminal, 
  Code2, 
  Cpu, 
  Layers, 
  Plus, 
  RefreshCcw, 
  Users,
  AlertCircle,
  Github,
  MessageSquare,
  Trophy,
  Activity,
  Zap,
  Sparkles,
  Lock
} from 'lucide-react';
import { Developer, DeveloperFormData } from './types';
import { developerService } from './services/developerService';
import { geminiService } from './services/geminiService';
import { supabase } from './lib/supabase';
import DeveloperCard from './components/DeveloperCard';
import DeveloperForm from './components/DeveloperForm';
import SearchFilters from './components/SearchFilters';
import AuthScreen from './components/AuthScreen';
import ForumScreen from './components/ForumScreen';
import { Session } from '@supabase/supabase-js';

function AnimatedCounter({ value }: { value: number }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, { duration: 2, ease: "easeOut" });
    return () => controls.stop();
  }, [value]);

  useEffect(() => {
    return rounded.on("change", (latest) => setDisplayValue(latest));
  }, [rounded]);

  return <span>{displayValue}</span>;
}

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [developers, setDevelopers] = useState<Developer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isRankingOpen, setIsRankingOpen] = useState(false);
  const [isAccessBlocked, setIsAccessBlocked] = useState(false);
  const [hasLoadedOnce, setHasLoadedOnce] = useState(false);
  const [editingDeveloper, setEditingDeveloper] = useState<Developer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [areaFilter, setAreaFilter] = useState('Todas');
  const [currentOwnerId, setCurrentOwnerId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'directory' | 'forum'>('directory');
  
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

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
      setHasLoadedOnce(true);
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

  const hasProfile = useMemo(() => {
    if (!currentOwnerId) return false;
    return developers.some(dev => dev.ownerId === currentOwnerId);
  }, [developers, currentOwnerId]);

  const checkProfileAccess = () => {
    // Se ainda está carregando a primeira vez, não bloqueia
    if (!hasLoadedOnce && isLoading) return true;
    
    if (!hasProfile) {
      setIsAccessBlocked(true);
      return false;
    }
    return true;
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

  const eliteDevelopers = useMemo(() => {
    return developers
      .filter(dev => (dev.contributions || 0) > 0)
      .sort((a, b) => (b.contributions || 0) - (a.contributions || 0))
      .slice(0, 5);
  }, [developers]);

  if (!session) {
    return <AuthScreen />;
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-brand-primary/30 relative flex flex-col">
      {/* Mouse Spotlight Background */}
      <motion.div 
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-[600px] h-[600px] bg-brand-primary/10 blur-[120px] rounded-full pointer-events-none z-0"
      />

      {/* Persistent Navigation Bar (Optional: only if you want it always visible at top) */}
      {/* For now, I will keep the Hero structure but fix the branching */}

      <AnimatePresence mode="wait">
        {activeTab === 'forum' ? (
          <motion.div
            key="forum"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            <ForumScreen 
              onBack={() => setActiveTab('directory')} 
              currentUserId={currentOwnerId}
            />
          </motion.div>
        ) : (
          <motion.div
            key="directory"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-1"
          >
            {/* Header / Hero Section */}
            <header className="relative py-20 overflow-hidden">
              <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
              <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
              
              <div className="max-w-7xl mx-auto px-4 sm:px-6">
                <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-4">
                  <nav className="flex flex-wrap items-center justify-center gap-2 p-2 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl">
                    <button 
                      onClick={() => setActiveTab('directory')}
                      className={`flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                        activeTab === 'directory' 
                          ? 'bg-white/10 text-white border border-white/20' 
                          : 'text-gray-500 hover:text-white'
                      }`}
                    >
                      Hub de Devs
                    </button>
                    <button 
                      onClick={() => checkProfileAccess() && setActiveTab('forum')}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-indigo-500/5 text-indigo-400/50 hover:text-indigo-400 border border-indigo-500/10 hover:border-indigo-500/30"
                    >
                      Comunidade
                    </button>
                    <button 
                      onClick={() => checkProfileAccess() && setIsRankingOpen(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:border-amber-500/40"
                    >
                      Ranking
                    </button>
                  </nav>
                  <button onClick={handleLogout} className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-widest">
                    Sign Out
                  </button>
                </div>

                <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 w-fit">
                      <Terminal className="w-4 h-4 text-brand-primary" />
                      <span className="text-[10px] font-bold text-brand-primary uppercase tracking-[0.3em]">Protocol_Dev_Hub</span>
                    </div>
                    <h1 className="text-6xl sm:text-8xl font-black uppercase tracking-tighter leading-[0.8] italic">
                      DEV<span className="text-brand-primary text-glow">CONNECT.</span>
                    </h1>
                    <p className="text-lg text-gray-500 max-w-xl font-medium">O ecossistema definitivo para talentos técnicos. Conecte-se, evolua sua rede e compartilhe conhecimento. ⚡</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ boxShadow: ["0 0 20px rgba(139, 92, 246, 0.3)", "0 0 60px rgba(139, 92, 246, 0.6)", "0 0 20px rgba(139, 92, 246, 0.3)"] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    onClick={handleOpenCreate}
                    className="px-10 py-6 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-sm"
                  >
                    Crie seu DEV_CARD
                  </motion.button>
                </div>

                {/* Stats Bar */}
                <div className="p-8 border border-white/10 bg-surface-card/40 backdrop-blur-2xl rounded-3xl flex items-center gap-12">
                  <div className="flex items-center gap-6">
                    <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                      <Users className="w-7 h-7" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest block mb-1">Membros Ativos</span>
                      <div className="flex items-baseline gap-3">
                        <span className="text-4xl font-mono font-black text-white"><AnimatedCounter value={developers.length} /></span>
                        <span className="text-[10px] font-mono text-emerald-500 font-bold uppercase tracking-widest animate-pulse italic">Online</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 pb-32">
              <SearchFilters searchTerm={searchTerm} onSearchChange={setSearchTerm} areaFilter={areaFilter} onAreaFilterChange={setAreaFilter} />
              <div className="mt-12">
                {isLoading ? (
                  <div className="py-40 flex flex-col items-center gap-6">
                    <RefreshCcw className="w-12 h-12 text-brand-primary animate-spin" />
                    <span className="text-xs font-mono text-gray-500 tracking-widest uppercase font-black">Syncing_Nodes...</span>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    <AnimatePresence>
                      {filteredDevelopers.map(dev => (
                        <DeveloperCard key={dev.id} developer={dev} onEdit={dev.ownerId === currentOwnerId ? handleOpenEdit : undefined} onTagClick={setAreaFilter} />
                      ))}
                    </AnimatePresence>
                  </div>
                )}
              </div>
            </main>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer (Common for both directory and forum if you want, but sticking to directory footer inside directory or outside) */}
      <footer className="border-t border-white/5 py-12 bg-surface-card/30 mt-auto">
        <div className="max-w-7xl mx-auto px-6 flex flex-col items-center gap-6">
          <p className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-500">DevConnect Protocol v1.0</p>
          <div className="flex items-center gap-4">
             <span className="text-gray-600">© 2026</span>
             <div className="w-1 h-1 bg-white/10 rounded-full" />
             <span className="text-gray-500 italic">Built for Excellence</span>
          </div>
        </div>
      </footer>

      {/* Global Modals */}
      <DeveloperForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} onSubmit={handleSubmitForm} initialDeveloper={editingDeveloper} />
      
      <AnimatePresence>
        {isRankingOpen && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsRankingOpen(false)} className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="w-full max-w-2xl bg-surface-card border border-white/10 rounded-[3rem] p-12 relative shadow-2xl max-h-[85vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-12">
                <h3 className="text-4xl font-black uppercase italic tracking-tighter">Elite <span className="text-amber-500">Ranking.</span></h3>
                <button onClick={() => setIsRankingOpen(false)} className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-all">
                  <Plus className="w-6 h-6 rotate-45 text-white/50" />
                </button>
              </div>
              <div className="space-y-4">
                {eliteDevelopers.map((dev, idx) => (
                  <div key={dev.id} className="flex items-center gap-6 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 hover:border-amber-500/30 transition-all">
                    <span className="text-5xl font-black italic opacity-10 font-mono w-16">{String(idx + 1).padStart(2, '0')}</span>
                    <div className="flex-1">
                      <p className="text-xl font-black uppercase italic">{dev.name}</p>
                      <p className="text-xs text-gray-500 font-bold uppercase tracking-widest">{dev.currentArea}</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end text-amber-500">
                        <Zap className="w-4 h-4 fill-current" />
                        <span className="text-2xl font-black font-mono">{dev.contributions || 0}</span>
                      </div>
                      <span className="text-[8px] font-black uppercase text-gray-600 tracking-widest">Tokens_Gerados</span>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isAccessBlocked && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsAccessBlocked(false)} className="absolute inset-0 bg-black/80 backdrop-blur-md" />
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="w-full max-w-sm bg-surface-card border border-white/10 rounded-[2.5rem] p-10 relative shadow-2xl text-center">
              <div className="w-20 h-20 bg-brand-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-8 text-brand-primary">
                <Lock className="w-10 h-10" />
              </div>
              <h3 className="text-3xl font-black uppercase italic tracking-tighter mb-4">Membro <span className="text-brand-primary">Bloqueado.</span></h3>
              <p className="text-gray-400 text-sm font-medium mb-10">Para acessar a comunidade e o Ranking Elite, você precisa primeiro registrar seu DEV_CARD.</p>
              <div className="space-y-4">
                <button onClick={() => { setIsAccessBlocked(false); handleOpenCreate(); }} className="w-full py-5 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-xl shadow-brand-primary/30">Criar meu Card agora</button>
                <button onClick={() => setIsAccessBlocked(false)} className="w-full py-3 text-gray-500 hover:text-white font-bold uppercase tracking-widest text-[10px]">Ainda não</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
