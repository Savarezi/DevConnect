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
  Sparkles
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

  const eliteDevelopers = useMemo(() => {
    return developers
      .filter(dev => (dev.contributions || 0) > 0)
      .sort((a, b) => (b.contributions || 0) - (a.contributions || 0))
      .slice(0, 5);
  }, [developers]);

  if (!session) {
    return <AuthScreen />;
  }

  if (activeTab === 'forum') {
    return (
      <ForumScreen 
        onBack={() => setActiveTab('directory')} 
        currentUserId={currentOwnerId}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#020203] text-white selection:bg-brand-primary/30 relative">
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
      
      {/* Header / Hero Section */}
      <header className="relative py-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[120px] -z-10" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4 sm:gap-0">
            <nav className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl shadow-2xl w-full sm:w-auto">
              <button 
                onClick={() => setActiveTab('directory')}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all relative group ${
                  activeTab === 'directory' 
                    ? 'bg-white/10 text-white border border-white/20' 
                    : 'text-gray-500 hover:text-white'
                }`}
              >
                <div className={`w-1.5 h-1.5 rounded-full ${activeTab === 'directory' ? 'bg-brand-primary animate-pulse' : 'bg-gray-700'}`} />
                Hub de Devs
              </button>
              
              <button 
                onClick={() => setActiveTab('forum')}
                className={`flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all relative overflow-hidden group ${
                  activeTab === 'forum' 
                    ? 'bg-brand-primary text-white shadow-[0_0_30px_rgba(139,92,246,0.4)] border border-brand-primary/50' 
                    : 'bg-indigo-500/5 text-indigo-400/50 hover:text-indigo-400 border border-indigo-500/10 hover:border-indigo-500/30'
                }`}
              >
                {/* Subtle glass effect only for Community */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                
                <MessageSquare className={`w-4 h-4 ${activeTab === 'forum' ? 'text-white' : 'text-indigo-500/50 group-hover:text-indigo-400'}`} />
                <span>Comunidade</span>
                
                {/* Experimental "Live" dot for Forum */}
                <div className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
                </div>
              </button>

              <div className="h-6 w-px bg-white/10 mx-2" />

              <button 
                onClick={() => setIsRankingOpen(true)}
                className="flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-2 sm:py-3 rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] sm:tracking-[0.2em] transition-all bg-amber-500/10 text-amber-500 border border-amber-500/20 hover:bg-amber-500/20 hover:border-amber-500/40 relative group"
              >
                <Trophy className="w-4 h-4" />
                Ranking
                <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-500 rounded-full border-2 border-[#020203] animate-pulse" />
              </button>
            </nav>
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
                <Terminal className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary" />
                <span className="text-[9px] sm:text-[10px] font-bold text-brand-primary uppercase tracking-widest">Enterprise Dev Directory</span>
              </motion.div>
              
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl sm:text-7xl md:text-8xl font-[900] uppercase tracking-tighter leading-[0.9]"
              >
                DEV<span className="text-brand-primary text-glow italic">CONNECT.</span>
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-base sm:text-lg text-gray-400 max-w-xl font-medium leading-relaxed"
              >
                O hub definitivo de talentos técnicos. Conecte-se com desenvolvedores de alta performance, 
                compartilhe seu perfil profissional e impulsione sua carreira. ⚡
              </motion.p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  "0 0 20px rgba(139, 92, 246, 0.3)",
                  "0 0 60px rgba(139, 92, 246, 0.6)",
                  "0 0 20px rgba(139, 92, 246, 0.3)"
                ],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              onClick={handleOpenCreate}
              className="flex items-center justify-center gap-4 px-6 sm:px-10 py-4 sm:py-6 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest transition-all group relative overflow-hidden text-xs sm:text-base w-full sm:w-auto"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 group-hover:rotate-90 transition-transform text-white/80" />
              Crie seu DEV_CARD
            </motion.button>
          </div>

          {/* Stats Bar */}
          <div className="flex flex-col md:flex-row items-center p-6 sm:p-8 border border-white/10 bg-surface-card/40 backdrop-blur-2xl rounded-3xl relative overflow-hidden gap-6 sm:gap-8">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-brand-primary/5 to-transparent pointer-events-none" />
            
            {/* User Count */}
            <div className="flex items-center gap-4 sm:gap-6 relative z-10 shrink-0 w-full sm:w-auto">
              <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                <Users className="w-6 h-6 sm:w-7 sm:h-7" />
              </div>
              <div className="flex flex-col">
                <span className="text-[8px] sm:text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] sm:tracking-[0.3em] mb-1">Membros no Hub</span>
                <div className="flex items-baseline gap-2 sm:gap-3">
                  <span className="text-3xl sm:text-4xl font-mono font-black text-white">
                    <AnimatedCounter value={developers.length} />
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                    <span className="text-[8px] sm:text-[10px] font-mono text-emerald-500 font-bold tracking-tighter uppercase">LIVE</span>
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
        <div className="space-y-8 mb-12">
          <div className="space-y-12">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 items-start">
                  <AnimatePresence>
                    {filteredDevelopers.map((dev) => (
                      <DeveloperCard 
                        key={dev.id} 
                        developer={dev} 
                        onEdit={dev.ownerId === currentOwnerId ? handleOpenEdit : undefined}
                        onTagClick={setAreaFilter}
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
          </div>
        </div>
      </main>

      <AnimatePresence>
        {isRankingOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 sm:p-24 overflow-hidden">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsRankingOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-xl"
            />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 30 }}
              className="w-full max-w-2xl bg-[#030303]/90 border border-white/10 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-12 relative shadow-[0_0_100px_rgba(245,158,11,0.15)] overflow-hidden backdrop-blur-3xl"
            >
              {/* Scanline Effect */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] pointer-events-none opacity-20" />
              
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 blur-[130px] pointer-events-none -z-10" />
              
              <div className="flex items-center justify-between mb-8 sm:mb-16 relative z-10">
                <div className="flex items-center gap-4 sm:gap-6">
                  <div className="relative group">
                    <div className="w-12 h-12 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/30 group-hover:border-amber-500/60 transition-all">
                      <Trophy className="w-6 h-6 sm:w-12 sm:h-12" />
                    </div>
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl animate-pulse rounded-2xl sm:rounded-3xl -z-10" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-4xl font-[950] uppercase tracking-tighter italic text-white flex items-center gap-3 sm:gap-4">
                      Ranking Elite
                    </h3>
                    <div className="flex items-center gap-2 sm:gap-3 mt-1">
                      <span className="text-[8px] sm:text-[10px] font-mono text-amber-500/60 font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em]">RANK_G_01</span>
                    </div>
                  </div>
                </div>
                <button 
                  onClick={() => setIsRankingOpen(false)}
                  className="p-2 sm:p-4 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 hover:text-white transition-all border border-white/5"
                >
                  <Plus className="w-6 h-6 sm:w-8 sm:h-8 rotate-45" />
                </button>
              </div>

              <div className="space-y-4 max-h-[60vh] sm:max-h-[55vh] overflow-y-auto pr-2 sm:pr-4 custom-scrollbar relative z-10">
                {eliteDevelopers.map((dev, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={dev.id} 
                    className="flex items-center gap-4 sm:gap-8 p-1 bg-white/[0.02] border border-white/5 rounded-2xl sm:rounded-[2.5rem] hover:border-amber-500/30 transition-all group cursor-pointer relative"
                    onClick={() => {
                      setSearchTerm(dev.name);
                      setIsRankingOpen(false);
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                  >
                    <div className="flex items-center w-full gap-3 sm:gap-6 p-3 sm:p-6">
                      {/* Position Number */}
                      <div className="w-8 sm:w-16 flex flex-col items-center shrink-0">
                        <span className={`text-xl sm:text-4xl font-mono font-[900] ${
                          idx === 0 ? 'text-amber-500' : 
                          idx === 1 ? 'text-slate-400' : 
                          idx === 2 ? 'text-orange-600' :
                          'text-white/20'
                        }`}>
                          {(idx + 1).toString().padStart(2, '0')}
                        </span>
                      </div>

                      <div className="relative shrink-0">
                        <div className={`w-12 h-12 sm:w-20 sm:h-20 rounded-xl sm:rounded-[2rem] p-0.5 ${
                          idx === 0 ? 'bg-gradient-to-br from-amber-500/50 to-transparent' : 
                          'bg-white/5'
                        }`}>
                          <div className="w-full h-full rounded-[0.9rem] sm:rounded-[1.8rem] overflow-hidden border border-white/10 relative transition-transform group-hover:scale-105">
                            {dev.avatarUrl ? (
                              <img src={dev.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gray-900">
                                 <Users className="w-5 h-5 sm:w-10 sm:h-10" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 sm:mb-4 gap-1">
                          <div>
                            <p className="text-base sm:text-2xl font-black uppercase text-white group-hover:text-amber-500 transition-colors tracking-tighter italic truncate">
                              {dev.name}
                            </p>
                          </div>
                          
                          <div className="flex items-center sm:justify-end gap-2 sm:gap-3">
                            <Zap className={`w-3.5 h-3.5 sm:w-5 sm:h-5 ${idx === 0 ? 'text-amber-500' : 'text-gray-500'}`} />
                            <span className="text-base sm:text-2xl font-mono font-black text-white tracking-widest leading-none">
                              <AnimatedCounter value={dev.contributions || 0} />
                            </span>
                          </div>
                        </div>
                        
                        <div className="relative h-2 sm:h-3 w-full bg-white/5 rounded-full overflow-hidden p-[1px] sm:p-[2px] border border-white/5">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${Math.min((dev.contributions || 0) * 10, 100)}%` }}
                            transition={{ duration: 1.5, ease: "easeOut" }}
                            className={`h-full rounded-full relative ${
                              idx === 0 ? 'bg-gradient-to-r from-amber-600 via-amber-400 to-amber-200' :
                              idx === 1 ? 'from-slate-600 via-slate-400 to-slate-200' :
                              idx === 2 ? 'from-orange-700 via-orange-500 to-orange-300' :
                              'from-gray-700 via-gray-500 to-gray-300'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
                {eliteDevelopers.length === 0 && (
                  <div className="py-24 text-center space-y-6">
                    <Activity className="w-16 h-16 text-gray-800 mx-auto animate-pulse" />
                    <p className="text-sm text-gray-600 uppercase font-black tracking-[0.4em]">Protocolo_Vazio: Aguardando contribuições...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
