/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserPlus, Upload, Globe, Briefcase, Linkedin, Github, ImageIcon, SlidersHorizontal, Cpu, RefreshCcw, FileImage, Save, Edit3 } from 'lucide-react';
import { Developer, DeveloperFormData } from '../types';

interface DeveloperFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: DeveloperFormData) => Promise<void>;
  initialDeveloper?: Developer | null;
}

export default function DeveloperForm({ isOpen, onClose, onSubmit, initialDeveloper }: DeveloperFormProps) {
  const [formData, setFormData] = useState<DeveloperFormData>({
    name: '',
    currentArea: '',
    interestArea: '',
    seniority: 'Júnior',
    linkedinUrl: '',
    githubUrl: '',
    avatarUrl: '',
  });

  useEffect(() => {
    if (initialDeveloper) {
      setFormData({
        name: initialDeveloper.name,
        currentArea: initialDeveloper.currentArea,
        interestArea: initialDeveloper.interestArea,
        seniority: initialDeveloper.seniority,
        linkedinUrl: initialDeveloper.linkedinUrl,
        githubUrl: initialDeveloper.githubUrl,
        avatarUrl: initialDeveloper.avatarUrl || '',
      });
    } else {
      setFormData({
        name: '',
        currentArea: '',
        interestArea: '',
        seniority: 'Júnior',
        linkedinUrl: '',
        githubUrl: '',
        avatarUrl: '',
      });
    }
  }, [initialDeveloper, isOpen]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit for localStorage
        alert('A imagem é muito grande. Por favor, escolha uma imagem de até 2MB.');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, avatarUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  const isEditMode = !!initialDeveloper;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 m-auto w-full max-w-lg h-fit max-h-[90vh] overflow-y-auto bg-surface-card border border-white/10 rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] z-50 scroller"
          >
            <div className="flex items-center justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-brand-primary/10 flex items-center justify-center text-brand-primary">
                  {isEditMode ? <Edit3 className="w-6 h-6" /> : <UserPlus className="w-6 h-6" />}
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white uppercase tracking-tight">
                    {isEditMode ? 'Editar Perfil' : 'Novo Talento'}
                  </h2>
                  <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mt-1 opacity-60">Diretório Profissional</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 rounded-xl hover:bg-white/5 text-gray-500 hover:text-white transition-all hover:rotate-90"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Globe className="w-3 h-3" /> Identificação Completa
                </label>
                <input
                  required
                  type="text"
                  placeholder="Nome do Desenvolvedor"
                  className="w-full bg-surface-base border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-primary/50 focus:bg-surface-accent transition-all font-medium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                    <Briefcase className="w-3 h-3" /> Domínio Técnico
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full bg-surface-base border border-white/[0.08] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-primary/50 focus:bg-surface-accent transition-all appearance-none font-medium cursor-pointer"
                      value={formData.currentArea}
                      onChange={(e) => setFormData({ ...formData, currentArea: e.target.value })}
                    >
                      <option value="" disabled className="bg-surface-card">Core Stack</option>
                      <option value="Front-end" className="bg-surface-card">Front-end</option>
                      <option value="Back-end" className="bg-surface-card">Back-end</option>
                      <option value="Full-stack" className="bg-surface-card">Full-stack</option>
                      <option value="Dados" className="bg-surface-card">Dados</option>
                      <option value="Design" className="bg-surface-card">Design / UI</option>
                      <option value="Mobile" className="bg-surface-card">Mobile Native</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                    <SlidersHorizontal className="w-3 h-3" /> Senioridade
                  </label>
                  <div className="relative">
                    <select
                      required
                      className="w-full bg-surface-base border border-white/[0.08] rounded-2xl px-5 py-4 text-white focus:outline-none focus:border-brand-primary/50 focus:bg-surface-accent transition-all appearance-none font-medium cursor-pointer"
                      value={formData.seniority}
                      onChange={(e) => setFormData({ ...formData, seniority: e.target.value as any })}
                    >
                      <option value="Estagiário">Estagiário</option>
                      <option value="Trainee">Trainee</option>
                      <option value="Júnior">Júnior</option>
                      <option value="Pleno">Pleno</option>
                      <option value="Sênior">Sênior</option>
                      <option value="Especialista">Especialista</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <SlidersHorizontal className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <Cpu className="w-3 h-3" /> Stack Tecnológica (Use vírgula para separar)
                </label>
                <input
                  required
                  type="text"
                  placeholder="Ex: React, Node.js, TypeScript, PostgreSQL"
                  className="w-full bg-surface-base border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-primary/50 focus:bg-surface-accent transition-all font-medium"
                  value={formData.interestArea}
                  onChange={(e) => setFormData({ ...formData, interestArea: e.target.value })}
                />
              </div>

              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                    <Linkedin className="w-3 h-3" /> Network URL
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="linkedin.com/in/perfil"
                    className="w-full bg-surface-base border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-primary/50 focus:bg-surface-accent transition-all font-mono text-sm"
                    value={formData.linkedinUrl}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                    <Github className="w-3 h-3" /> Core Repo URL
                  </label>
                  <input
                    required
                    type="url"
                    placeholder="github.com/perfil"
                    className="w-full bg-surface-base border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-primary/50 focus:bg-surface-accent transition-all font-mono text-sm"
                    value={formData.githubUrl}
                    onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em] flex items-center gap-2">
                  <ImageIcon className="w-3 h-3" /> Ativo Visual (URL ou Upload)
                </label>
                
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <input
                      type="url"
                      placeholder="https://..."
                      className="flex-1 bg-surface-base border border-white/[0.08] rounded-2xl px-5 py-4 text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-primary/50 focus:bg-surface-accent transition-all font-mono text-sm"
                      value={formData.avatarUrl?.startsWith('data:image') ? '' : formData.avatarUrl}
                      onChange={(e) => setFormData({ ...formData, avatarUrl: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 bg-white/[0.03] hover:bg-white/[0.08] border border-white/[0.08] rounded-2xl text-gray-400 hover:text-white transition-all flex items-center justify-center group"
                    >
                      <FileImage className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept="image/*"
                      className="hidden"
                    />
                  </div>

                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                    <div className="w-20 h-20 rounded-2xl border border-white/10 bg-surface-base flex items-center justify-center overflow-hidden shrink-0 shadow-xl">
                      {formData.avatarUrl ? (
                        <img src={formData.avatarUrl} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      ) : (
                        <Upload className="w-6 h-6 text-gray-700" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Preview Social</p>
                      <p className="text-[10px] text-gray-600 mt-1 leading-relaxed">
                        Este ativo será otimizado para exibição no diretório. Formatos aceitos: JPG, PNG, WEBP.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                disabled={isSubmitting}
                type="submit"
                className="w-full py-5 bg-brand-primary hover:bg-brand-secondary disabled:bg-gray-800 disabled:opacity-50 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-brand-primary/30 active:scale-[0.98] flex items-center justify-center gap-3"
              >
                {isSubmitting ? (
                  <RefreshCcw className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isEditMode ? <Save className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                    {isEditMode ? 'Publicar Alterações' : 'Implantar Perfil'}
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
