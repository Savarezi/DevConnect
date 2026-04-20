import React from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import { supabase } from '../lib/supabase';
import { Terminal, Chrome, Cpu, ShieldCheck, Zap, Users } from 'lucide-react';

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
        <div className="hidden lg:flex relative group overflow-hidden bg-black/40 items-center justify-center p-12">
          {/* Background Ambient Glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/10 via-transparent to-indigo-600/10" />
          
          <div className="relative w-full h-full flex flex-col items-center justify-center">
            {/* Animated Code Editor Window */}
            <motion.div
              initial={{ x: -30, opacity: 0, rotate: -5 }}
              animate={{ x: 0, opacity: 1, rotate: -2 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="absolute top-0 left-0 w-64 h-48 bg-[#0D0D12] rounded-2xl border border-white/10 shadow-2xl overflow-hidden backdrop-blur-xl z-20"
            >
              {/* Window Header */}
              <div className="h-8 bg-white/5 border-b border-white/5 flex items-center px-4 gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
              </div>
              {/* Window Code Content */}
              <div className="p-4 font-mono text-[10px] leading-relaxed select-none">
                <div className="flex gap-2">
                  <span className="text-gray-600">1</span>
                  <span className="text-brand-primary">function</span>
                  <span className="text-blue-400">DevConnect() &#123;</span>
                </div>
                <div className="flex gap-2 pl-4">
                  <span className="text-gray-600">2</span>
                  <span className="text-brand-primary">return (</span>
                </div>
                <div className="flex gap-2 pl-8">
                  <span className="text-gray-600">3</span>
                  <span className="text-indigo-400">&lt;Community /&gt;</span>
                </div>
                <div className="flex gap-2 pl-4">
                  <span className="text-gray-600">4</span>
                  <span className="text-brand-primary">);</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-gray-600">5</span>
                  <span className="text-blue-400">&#125;</span>
                </div>
                <motion.div 
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity }}
                  className="w-1.5 h-3 bg-brand-primary mt-1 ml-1"
                />
              </div>
            </motion.div>

            {/* Neon Connection Icon */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.8, 
                delay: 0.5,
                type: "spring",
                stiffness: 100
              }}
              className="relative z-30"
            >
              <div className="relative">
                {/* Glow behind icon */}
                <div className="absolute inset-0 bg-brand-primary blur-[40px] opacity-20 animate-pulse" />
                
                <div className="flex items-center gap-4 text-white">
                  <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-indigo-400"
                  >
                    <span className="text-5xl font-black tracking-tighter opacity-80 leading-none">&lt;</span>
                  </motion.div>

                  <div className="flex flex-col items-center gap-2 relative">
                    <div className="flex items-center -space-x-4">
                      <div className="w-16 h-16 rounded-full bg-surface-card border-2 border-indigo-500/50 flex items-center justify-center shadow-[0_0_30px_rgba(99,102,241,0.3)] relative z-10">
                        <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                          <Users className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="w-16 h-16 rounded-full bg-surface-card border-2 border-brand-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(139,92,246,0.3)] relative z-0">
                        <div className="w-10 h-10 rounded-full bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                          <Cpu className="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                    {/* Connection Line */}
                    <motion.div 
                      animate={{ width: [0, 40, 0] }}
                      transition={{ duration: 3, repeat: Infinity }}
                      className="h-[2px] bg-gradient-to-r from-indigo-500 to-brand-primary absolute top-1/2 -translate-y-1/2 blur-[1px]"
                    />
                  </div>

                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                    className="text-brand-primary"
                  >
                    <span className="text-5xl font-black tracking-tighter opacity-80 leading-none">&gt;</span>
                  </motion.div>
                </div>
              </div>
            </motion.div>

            {/* Floating Decorative Elements */}
            <motion.div
              animate={{ 
                y: [0, -20, 0],
                rotate: [0, 10, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 right-0 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md z-10"
            >
              <ShieldCheck className="w-6 h-6 text-emerald-400" />
            </motion.div>
          </div>
          
          {/* Overlay Gradient to blend with middle section */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent pointer-events-none" />

          {/* Re-adding the info labels but with cleaner style */}
          <div className="absolute bottom-12 left-12 right-12 space-y-6 text-left z-40">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="text-4xl font-black text-white uppercase tracking-tighter leading-tight"
            >
              Conecte-se à <br/>
              <span className="text-brand-primary italic">Inteligência Tech.</span>
            </motion.h2>
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
