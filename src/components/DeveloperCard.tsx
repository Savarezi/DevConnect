/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Linkedin, Github, ExternalLink, MapPin, Briefcase, Edit2, MessageSquare, Zap, Target, Code2, GraduationCap, ChevronDown } from 'lucide-react';
import { Developer } from '../types';
import Avatar from './Avatar';

interface DeveloperCardProps {
  developer: Developer;
  onEdit?: (developer: Developer) => void;
  onTagClick?: (tag: string) => void;
}

const DeveloperCard: React.FC<DeveloperCardProps> = ({ developer, onEdit, onTagClick }) => {
  const [isHovered, setIsHovered] = useState(false);

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
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
      className="bg-[#0a0a0c]/80 border border-white/5 rounded-[2.5rem] p-8 shadow-2xl hover:shadow-brand-primary/20 hover:border-brand-primary/40 transition-all group relative overflow-hidden flex flex-col items-center text-center"
    >
      {/* Stardust Background Effect */}
      <div className="absolute inset-0 opacity-10 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(139,92,246,0.05)_0%,transparent_100%),url('https://www.transparenttextures.com/patterns/stardust.png')]" />

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

      <div className="flex flex-col items-center w-full space-y-6 relative z-10">
        <div className="relative">
          <Avatar src={developer.avatarUrl} name={developer.name} size="md" />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#0a0a0c] border-2 border-emerald-500/50 rounded-full flex items-center justify-center z-20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>
        </div>
        
        <div className="space-y-4 w-full">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-white tracking-tighter uppercase leading-tight group-hover:text-brand-primary transition-colors">
              {developer.name}
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className={`px-2.5 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${getSeniorityColors(developer.seniority)}`}>
                {developer.seniority}
              </div>
              
              {level && (
                <div className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest ${level.bg} ${level.color} ${level.border}`}>
                  <level.icon className="w-2.5 h-2.5" />
                  {level.label}
                </div>
              )}
            </div>

            {/* Specialties Medals */}
            {specialties.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2 mt-3">
                {specialties.map((spec, idx) => (
                  <div 
                    key={idx}
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border text-[7px] font-black uppercase tracking-widest ${spec.bg} ${spec.color} ${spec.border} shadow-[0_0_10px_rgba(0,0,0,0.5)]`}
                  >
                    <spec.icon className="w-2 h-2" />
                    {spec.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <button 
              onClick={() => onTagClick?.(developer.currentArea)}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[9px] font-black text-white/50 uppercase tracking-[0.2em] hover:bg-brand-primary/10 hover:border-brand-primary/30 hover:text-brand-primary transition-all cursor-pointer group/tag"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary/40 group-hover/tag:bg-brand-primary" />
              {developer.currentArea}
            </button>

            <div className="flex items-center gap-3 w-full">
              <a
                href={developer.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#0a66c2]/5 hover:bg-[#0a66c2]/10 border border-[#0a66c2]/10 hover:border-[#0a66c2]/40 transition-all text-[9.5px] font-black uppercase tracking-widest text-[#0a66c2] group/link"
              >
                <Linkedin className="w-3.5 h-3.5" />
                LinkedIn
              </a>
              <a
                href={developer.githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/30 transition-all text-[9.5px] font-black uppercase tracking-widest text-gray-400 hover:text-white group/link"
              >
                <Github className="w-3.5 h-3.5" />
                GitHub
              </a>
            </div>
          </div>
        </div>

        {/* Expandable Tech Stack on Hover */}
        <div className="w-full">
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ height: 0, opacity: 0, overflow: 'hidden' }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                className="pt-6 mt-4 border-t border-white/5"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[9px] font-black text-gray-500 uppercase tracking-[0.3em] italic">Interests_Matrix</p>
                    <ChevronDown className="w-3 h-3 text-brand-primary animate-bounce mt-1" />
                  </div>
                  <div className="flex flex-wrap justify-center gap-2 max-h-[120px] overflow-y-auto custom-scrollbar pr-1">
                    {developer.interestArea.split(',').map((tag, idx) => (
                      <button 
                        key={idx} 
                        onClick={() => onTagClick?.(tag.trim())}
                        className="px-2.5 py-1.5 rounded-lg bg-brand-primary/5 text-[9px] font-black text-brand-primary/70 border border-brand-primary/10 hover:border-brand-primary/40 hover:bg-brand-primary/10 hover:text-brand-primary transition-all cursor-pointer uppercase tracking-wider"
                      >
                        {tag.trim()}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {!isHovered && (
            <div className="flex justify-center pt-4 opacity-20 group-hover:opacity-0 transition-opacity">
               <ChevronDown className="w-4 h-4 text-gray-500 animate-bounce" />
            </div>
          )}
        </div>
      </div>
      {/* Subtle corner highlight */}
      <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-brand-primary/20 blur-[60px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
    </motion.div>
  );
};

export default DeveloperCard;
