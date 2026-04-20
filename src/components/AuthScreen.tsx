import React from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Terminal, Chrome, Cpu, ShieldCheck, Zap } from 'lucide-react';

export default function AuthScreen() {
  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
          queryParams: {
            prompt: 'select_account',
            access_type: 'offline',
          }
        },
      });

      if (error) throw error;
    } catch (error: any) {
      console.error('Login error:', error.message);
      alert(`Erro de Autenticação: ${error.message}\n\nVerifique se o Site URL no Supabase está configurado para: ${window.location.origin}`);
    }
  };

  const titleText = "Bem-vindo ao";
  const brandText = "DevConnect.";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 100, damping: 30 });
  const springY = useSpring(mouseY, { stiffness: 100, damping: 30 });

  React.useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen bg-[#020203] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 z-0">
        <motion.div 
          animate={{
            x: [0, 100, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-brand-primary/20 blur-[120px] rounded-full" 
        />
        <motion.div 
          animate={{
            x: [0, -100, 0],
            y: [0, -50, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-600/20 blur-[120px] rounded-full" 
        />
        <div className="absolute inset-0 bg-[#020203]/40 backdrop-blur-[2px]" />
      </div>

      {/* Floating Micro-data Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 opacity-10">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * 100 + "%", 
              y: Math.random() * 100 + "%",
              opacity: 0 
            }}
            animate={{ 
              y: [null, "-10%"],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: 15 + Math.random() * 25, 
              repeat: Infinity, 
              delay: Math.random() * 15,
              ease: "linear"
            }}
            className="absolute font-mono text-[7px] text-brand-primary/50 tracking-tighter"
          >
            {["010110", "node.sync", "0x8B5CF6", "auth_v3", "ping: 12ms"][i % 5]}
          </motion.div>
        ))}
      </div>

      {/* Dynamic Data Blocks in Corners */}
      <div className="absolute top-10 left-10 hidden xl:flex flex-col gap-1 font-mono text-[7px] text-brand-primary opacity-20 select-none z-0">
        <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 0.5, repeat: Infinity }}>CONNECT_HUB: ACTIVE</motion.span>
        <span>LATENCY: 0.003ms</span>
        <span>LOCATION: US-EAST-1</span>
      </div>

      <div className="absolute bottom-10 right-10 hidden xl:flex flex-col gap-1 font-mono text-[7px] text-brand-primary opacity-20 text-right select-none z-0">
        <motion.span animate={{ opacity: [1, 0, 1] }} transition={{ duration: 1, repeat: Infinity }}>SECURE_LAYER: ENCRYPTED</motion.span>
        <span>ENCRYPTION: AES-256</span>
        <span>SSH_SECURE_NODE</span>
      </div>
      
      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10 pointer-events-none z-1" />

      {/* Mouse Spotlight (Lanterna) - Moved here and boosted z-index */}
      <motion.div 
        style={{
          x: springX,
          y: springY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        className="fixed top-0 left-0 w-[600px] h-[600px] bg-brand-primary/20 blur-[120px] rounded-full pointer-events-none z-2"
      />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 bg-surface-card/40 backdrop-blur-3xl border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,1)] relative z-10"
      >
        {/* Left Side: Visual Experience */}
        <div className="hidden lg:block relative group overflow-hidden">
          <motion.img 
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 20, repeat: Infinity, repeatType: "reverse" }}
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200" 
            alt="Futuristic Data Network"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-[#020203]/40 to-transparent" />
          
          <div className="absolute bottom-12 left-12 right-12 space-y-6 text-left">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3 px-4 py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 backdrop-blur-md w-fit"
            >
              <Cpu className="w-4 h-4 text-brand-primary" />
              <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Protocolo de Rede Ativo</span>
            </motion.div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-black text-white uppercase tracking-tighter leading-tight"
            >
              Conecte-se à <br/>
              <span className="text-brand-primary italic">Inteligência Tech.</span>
            </motion.h2>
            
            <div className="grid grid-cols-2 gap-6 pt-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/40">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Seguro</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Criptografia de ponta a ponta em todos os nós de conexão.</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-white/40">
                  <Zap className="w-4 h-4" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Instantâneo</span>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed font-medium">Deploy global em milissegundos através da nossa borda.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Auth Form */}
        <div className="p-12 lg:p-20 flex flex-col justify-center relative text-left">
          <div className="mb-12">
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
              className="w-16 h-16 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary mb-8 border border-white/5 shadow-[0_0_20px_rgba(139,92,246,0.3)]"
            >
              <Terminal className="w-8 h-8" />
            </motion.div>
            <h1 className="text-4xl font-black text-white uppercase tracking-tighter mb-4 flex flex-col">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              >
                {titleText.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
              <motion.span className="text-brand-primary italic">
                {brandText.split("").map((char, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 + i * 0.05 }}
                  >
                    {char}
                  </motion.span>
                ))}
              </motion.span>
            </h1>
            <p className="text-gray-500 font-medium leading-relaxed">
              Acesse o hub exclusivo para desenvolvedores de elite. Construa sua rede, troque experiências e escale sua carreira através de conexões reais no ecossistema tech.
            </p>
          </div>

          <div className="space-y-4">
            <motion.button
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="w-full flex items-center justify-center gap-4 bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-brand-primary/50 text-white py-5 rounded-2xl font-black uppercase tracking-widest transition-all group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-brand-primary opacity-0 group-hover:opacity-10 transition-opacity" />
              {/* Glossy sweep effect */}
              <motion.div 
                initial={{ x: "-100%" }}
                whileHover={{ x: "100%" }}
                transition={{ duration: 0.6 }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none"
              />
              <Chrome className="w-5 h-5 text-brand-primary group-hover:rotate-[360deg] transition-transform duration-500" />
              <span>Entrar com Google</span>
            </motion.button>
          </div>

          <div className="mt-12 pt-8 border-t border-white/5 flex flex-col gap-2">
            <p className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">Status da Conexão</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
              <span className="text-[10px] font-mono text-emerald-500 font-bold tracking-tighter uppercase">Protocolo Ativo: SSH-V3</span>
            </div>
          </div>
          
          {/* Subtle decoration */}
          <div className="absolute top-10 right-10 w-24 h-24 bg-brand-primary/5 blur-[50px] rounded-full pointer-events-none" />
        </div>
      </motion.div>

      {/* Footer minimal info */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-6 opacity-30 select-none">
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">© 2026 DevConnect Node</span>
        <div className="w-1 h-1 rounded-full bg-gray-500" />
        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-gray-500">Secure Environment</span>
      </div>
    </div>
  );
}
