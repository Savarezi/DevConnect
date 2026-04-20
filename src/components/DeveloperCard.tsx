/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Linkedin, Github, ExternalLink, MapPin, Briefcase, Edit2, MessageSquare, Zap, Target, Code2, GraduationCap } from 'lucide-react';
import { Developer } from '../types';
import Avatar from './Avatar';

interface DeveloperCardProps {
  developer: Developer;
  onEdit?: (developer: Developer) => void;
  onTagClick?: (tag: string) => void;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onEdit, onTagClick }) => {
  const getSeniorityColors = (level: string) => {
    switch (level) {
      case 'Estagiário': return 'bg-gray-400/10 text-gray-300 border-gray-400/30 shadow-[0_0_10px_rgba(156,163,175,0.2)]';
      case 'Trainee': return 'bg-gray-600/10 text-gray-400 border-gray-600/30 shadow-[0_0_10px_rgba(75,85,99,0.2)]';
      case 'Júnior': return 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
      case 'Pleno': return 'bg-purple-500/10 text-purple-400 border-purple-500/30 shadow-[0_0_10px_rgba(168,85,247,0.2)]';
      case 'Sênior': return 'bg-orange-500/10 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]';
      case 'Especialista': return 'bg-red-500/10 text-red-500 border-red-500/30 shadow-[0_0_10px_rgba(239,68,68,0.2)]';
      default: return 'bg-white/5 text-gray-400 border-white/10';
    }
  };

  const contributionCount = developer.contributions || 0;
  
  const getContributionLevel = () => {
    if (contributionCount >= 10) return { label: 'Ouro', color: 'text-amber-400', icon: Zap, bg: 'bg-amber-400/10', border: 'border-amber-400/30' };
    if (contributionCount >= 5) return { label: 'Prata', color: 'text-gray-300', icon: Target, bg: 'bg-gray-500/10', border: 'border-gray-300/30' };
    if (contributionCount >= 1) return { label: 'Bronze', color: 'text-orange-400', icon: MessageSquare, bg: 'bg-orange-400/10', border: 'border-orange-400/30' };
    return null;
  };

  const level = getContributionLevel();

  const specialties = [
    { 
      condition: (developer.codePosts || 0) >= 3, 
      label: 'Programador', 
      icon: Code2, 
      color: 'text-emerald-400', 
      bg: 'bg-emerald-400/10', 
      border: 'border-emerald-400/30' 
    },
    { 
      condition: (developer.coursePosts || 0) >= 3, 
      label: 'Mentor', 
      icon: GraduationCap, 
      color: 'text-indigo-400', 
      bg: 'bg-indigo-400/10', 
      border: 'border-indigo-400/30' 
    }
  ].filter(s => s.condition);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="bg-surface-card border border-brand-primary/30 rounded-[2.5rem] p-10 shadow-[0_0_30px_rgba(139,92,246,0.15)] hover:shadow-brand-primary/30 hover:border-brand-primary/60 transition-all group relative overflow-hidden"
    >
      {/* Stardust Background Effect */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.1)_0%,transparent_100%),url('https://www.transparenttextures.com/patterns/stardust.png')]" />

      {/* Edit Button - Top Right Overlay */}
      {onEdit && (
        <button
          onClick={() => onEdit(developer)}
          className="absolute top-6 right-6 p-2 rounded-xl bg-white/5 hover:bg-brand-primary/20 text-gray-500 hover:text-brand-primary border border-white/5 hover:border-brand-primary/50 transition-all opacity-0 group-hover:opacity-100 z-30"
          title="Editar Perfil"
        >
          <Edit2 className="w-4 h-4" />
        </button>
      )}

      <div className="flex flex-col items-center text-center space-y-8 relative z-10">
        <div className="relative">
          <Avatar src={developer.avatarUrl} name={developer.name} size="lg" />
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-surface-base border-4 border-brand-primary/20 rounded-full flex items-center justify-center z-20 shadow-[0_0_10px_rgba(16,185,129,0.5)]">
            <div className="w-2 h-2 rounded-full bg-emerald-400" />
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-1">
            <h3 className="text-2xl font-[900] text-white tracking-tight leading-tight uppercase">
              {developer.name}
            </h3>
            <div className="flex items-center justify-center gap-2">
              <div className={`inline-flex px-3 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${getSeniorityColors(developer.seniority)}`}>
                {developer.seniority}
              </div>
              
              {level && (
                <div className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border text-[9px] font-black uppercase tracking-widest ${level.bg} ${level.color} ${level.border} animate-pulse`}>
                  <level.icon className="w-2.5 h-2.5" />
                  Contribuidor {level.label} ({contributionCount})
                </div>
              )}
            </div>

            {/* Specialties Medals */}
            {specialties.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {specialties.map((spec, idx) => (
                  <motion.div 
                    key={idx}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-lg border text-[8px] font-black uppercase tracking-widest ${spec.bg} ${spec.color} ${spec.border}`}
                  >
                    <spec.icon className="w-2.5 h-2.5" />
                    {spec.label}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-2">
            <button 
              onClick={() => onTagClick?.(developer.currentArea)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] shadow-[0_0_10px_rgba(139,92,246,0.2)] hover:bg-brand-primary/20 hover:border-brand-primary/40 transition-all cursor-pointer group/tag"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse group-hover/tag:scale-125 transition-transform" />
              {developer.currentArea}
            </button>
          </div>
        </div>

        <div className="w-full h-px bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent" />

        <div className="w-full text-left space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] opacity-60">Tech Stack</p>
            <div className="h-[2px] w-8 bg-brand-primary/30" />
          </div>
          <div className="flex flex-wrap gap-2">
            {developer.interestArea.split(',').map((tag, idx) => (
              <button 
                key={idx} 
                onClick={() => onTagClick?.(tag.trim())}
                className="px-3 py-2 rounded-xl bg-white/[0.04] text-[10px] font-black text-white/80 border border-white/10 hover:border-brand-primary/50 hover:bg-brand-primary/10 hover:text-white transition-all cursor-pointer uppercase tracking-wider active:scale-95"
              >
                {tag.trim()}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 w-full pt-4">
          <div className="grid grid-cols-2 gap-3">
            <a
              href={developer.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-[#0a66c2]/10 hover:bg-[#0a66c2]/20 border border-[#0a66c2]/20 hover:border-[#0a66c2]/50 transition-all text-[11px] font-black uppercase tracking-widest text-[#0a66c2] group/link"
            >
              <Linkedin className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
              LinkedIn
            </a>
            <a
              href={developer.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-5 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-[11px] font-black uppercase tracking-widest text-gray-300 group/link"
            >
              <Github className="w-4 h-4 group-hover/link:scale-110 transition-transform" />
              GitHub
            </a>
          </div>
        </div>
      </div>

      {/* Subtle corner highlight */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/20 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default DeveloperCard;
