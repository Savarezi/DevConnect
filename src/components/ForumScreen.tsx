/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  ThumbsUp, 
  Clock, 
  Tag, 
  Search, 
  Plus, 
  ArrowLeft,
  ChevronRight,
  Send,
  User,
  Cpu,
  Sparkles,
  Zap,
  Globe,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { ForumPost, ForumComment, PostFormData } from '../types';
import { forumService } from '../services/forumService';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ForumScreenProps {
  onBack: () => void;
  currentUserId: string;
}

export default function ForumScreen({ onBack, currentUserId }: ForumScreenProps) {
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);
  const [comments, setComments] = useState<ForumComment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [newPost, setNewPost] = useState<PostFormData>({ title: '', content: '', category: 'Geral', externalLink: '' });
  const [newComment, setNewComment] = useState('');
  const [newCommentLink, setNewCommentLink] = useState('');
  const [filter, setFilter] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['Todas', 'Dica de Curso', 'Dúvida', 'Código', 'Geral'];

  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'Dica de Curso':
        return {
          text: 'text-emerald-400',
          bg: 'bg-emerald-500/10',
          border: 'border-emerald-500/20',
          hoverBorder: 'group-hover:border-emerald-500/40',
          hoverBg: 'hover:bg-emerald-500/10',
          glow: 'shadow-emerald-500/20',
          dot: 'bg-emerald-500'
        };
      case 'Dúvida':
        return {
          text: 'text-amber-400',
          bg: 'bg-amber-500/10',
          border: 'border-amber-500/20',
          hoverBorder: 'group-hover:border-amber-500/40',
          hoverBg: 'hover:bg-amber-500/10',
          glow: 'shadow-amber-500/20',
          dot: 'bg-amber-500'
        };
      case 'Código':
        return {
          text: 'text-cyan-400',
          bg: 'bg-cyan-500/10',
          border: 'border-cyan-500/20',
          hoverBorder: 'group-hover:border-cyan-500/40',
          hoverBg: 'hover:bg-cyan-500/10',
          glow: 'shadow-cyan-500/20',
          dot: 'bg-cyan-500'
        };
      default:
        return {
          text: 'text-brand-primary',
          bg: 'bg-brand-primary/10',
          border: 'border-brand-primary/20',
          hoverBorder: 'group-hover:border-brand-primary/40',
          hoverBg: 'hover:bg-brand-primary/10',
          glow: 'shadow-brand-primary/20',
          dot: 'bg-brand-primary'
        };
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setIsLoading(true);
    const data = await forumService.getPosts();
    setPosts(data);
    setIsLoading(false);
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await forumService.createPost(newPost);
      setNewPost({ title: '', content: '', category: 'Geral', externalLink: '' });
      setIsCreating(false);
      fetchPosts();
    } catch (error) {
      alert('Erro ao criar postagem.');
    }
  };

  const handleSelectPost = async (post: ForumPost) => {
    setSelectedPost(post);
    const data = await forumService.getComments(post.id);
    setComments(data);
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPost || !newComment.trim()) return;
    try {
      const added = await forumService.addComment(selectedPost.id, newComment, newCommentLink);
      setComments([...comments, added]);
      setNewComment('');
      setNewCommentLink('');
      // Update comment count locally
      setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, commentsCount: (p.commentsCount || 0) + 1 } : p));
    } catch (error) {
      alert('Erro ao comentar.');
    }
  };

  const handleDeletePost = async (postId: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!confirm('Tem certeza que deseja excluir esta postagem?')) return;
    try {
      await forumService.deletePost(postId);
      if (selectedPost && selectedPost.id === postId) {
        setSelectedPost(null);
      }
      fetchPosts();
    } catch (error) {
      alert('Erro ao excluir postagem.');
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Tem certeza que deseja excluir este comentário?')) return;
    try {
      await forumService.deleteComment(commentId);
      setComments(comments.filter(c => c.id !== commentId));
      if (selectedPost) {
        setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, commentsCount: Math.max(0, (p.commentsCount || 0) - 1) } : p));
      }
    } catch (error) {
      alert('Erro ao excluir comentário.');
    }
  };

  const handleToggleLike = async (postId: string) => {
    const hasLikedNow = await forumService.toggleLike(postId);
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          hasLiked: hasLikedNow,
          likesCount: (p.likesCount || 0) + (hasLikedNow ? 1 : -1)
        };
      }
      return p;
    }));
    if (selectedPost && selectedPost.id === postId) {
      setSelectedPost({
        ...selectedPost,
        hasLiked: hasLikedNow,
        likesCount: (selectedPost.likesCount || 0) + (hasLikedNow ? 1 : -1)
      });
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesFilter = filter === 'Todas' || p.category === filter;
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.content.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#020203] text-white p-6 pb-20 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-[-10%] w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto space-y-8 sm:space-y-12 relative z-10">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 sm:gap-8 pt-4 sm:pt-8">
          <div className="flex items-center gap-4 sm:gap-6">
            <motion.button 
              whileHover={{ scale: 1.1, x: -4 }}
              whileTap={{ scale: 0.9 }}
              onClick={selectedPost ? () => setSelectedPost(null) : onBack}
              className="p-3 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/10 hover:bg-brand-primary/10 hover:border-brand-primary/50 transition-all text-gray-400 hover:text-brand-primary shadow-xl backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </motion.button>
            <div>
              <div className="flex items-center gap-3 mb-1">
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-brand-primary animate-pulse" />
                <span className="text-[8px] sm:text-[10px] font-mono text-brand-primary font-black uppercase tracking-[0.2em] sm:tracking-[0.4em]">
                  {selectedPost ? 'protocol_detailed_view' : 'nexus_community_feed'}
                </span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-black tracking-tighter uppercase leading-none">
                {selectedPost ? 'Discussão' : (
                  <>Hub de <span className="text-brand-primary">Conhecimento.</span></>
                )}
              </h1>
            </div>
          </div>

          {!selectedPost && (
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Pesquisar..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 pr-6 py-3.5 sm:py-4 bg-white/[0.03] border border-white/10 rounded-2xl focus:ring-2 focus:ring-brand-primary/50 outline-none w-full sm:w-64 md:w-72 text-sm font-medium backdrop-blur-xl transition-all"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsCreating(true)}
                className="flex items-center justify-center gap-3 px-8 py-3.5 sm:py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-[0_10px_30px_rgba(139,92,246,0.3)] hover:shadow-brand-primary/40 transition-all w-full sm:w-auto"
              >
                <Plus className="w-4 h-4" />
                Novo Post
              </motion.button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-12">
          
          {/* Categories Sidebar */}
          {!selectedPost && (
            <aside className="lg:block lg:space-y-10">
              <div className="space-y-4">
                <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em] px-4 hidden lg:flex items-center gap-2">
                  <Globe className="w-3 h-3" />
                  Categorias
                </p>
                <div className="flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0 scrollbar-hide">
                  {categories.map(cat => {
                    const styles = getCategoryStyles(cat);
                    return (
                      <button
                        key={cat}
                        onClick={() => setFilter(cat)}
                        className={`flex items-center lg:justify-between px-5 py-3 lg:py-4 rounded-2xl transition-all font-bold text-[9px] sm:text-[10px] uppercase tracking-[0.2em] group relative overflow-hidden whitespace-nowrap lg:whitespace-normal ${
                          filter === cat 
                            ? `text-white border ${styles.border.replace('/20', '/40')}` 
                            : 'text-gray-500 border border-transparent'
                        }`}
                      >
                        {filter === cat && (
                          <motion.div 
                            layoutId="nav-bg" 
                            className={`absolute inset-0 ${styles.bg} -z-10 blur-sm`} 
                            initial={false}
                          />
                        )}
                        
                        <span className="relative z-10 flex items-center gap-3">
                          <div className={`w-1.2 h-1.2 sm:w-1.5 sm:h-1.5 rounded-full transition-all ${styles.dot} ${filter === cat ? 'scale-125 shadow-[0_0_8px_rgba(255,255,255,0.5)]' : 'opacity-30 group-hover:opacity-100 group-hover:scale-110'}`} />
                          <span className={`transition-colors ${filter === cat ? 'text-white' : `text-gray-500 ${styles.text.replace('text-', 'group-hover:text-')}`}`}>
                            {cat}
                          </span>
                        </span>
                        <ChevronRight className={`hidden lg:block w-4 h-4 transition-transform ${filter === cat ? 'translate-x-0 opacity-100' : '-translate-x-2 opacity-0'}`} />
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="hidden lg:block p-6 rounded-3xl bg-indigo-500/5 border border-indigo-500/10 space-y-4">
                <Zap className="w-6 h-6 text-indigo-400" />
                <p className="text-[10px] font-black uppercase tracking-widest leading-loose text-indigo-300">
                  Compartilhe conhecimento e aumente seu <span className="text-white">Expert Score</span> na rede.
                </p>
              </div>
            </aside>
          )}

          {/* Main List or Post Detail */}
          <div className={`${selectedPost ? 'lg:col-start-1 lg:col-span-2' : ''} space-y-6`}>
            
            <AnimatePresence mode="wait">
              {isLoading ? (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center py-40 gap-4"
                >
                  <Cpu className="w-12 h-12 text-brand-primary animate-pulse" />
                  <span className="text-[10px] font-mono text-gray-500 font-black tracking-[0.2em] uppercase">Buscando_dados...</span>
                </motion.div>
              ) : selectedPost ? (
                /* Post Detail View */
                <motion.div 
                  key="detail"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="space-y-8"
                >
                  {/* The Post Itself */}
                  <div className={`bg-surface-card/40 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-3xl space-y-6 transition-all ${getCategoryStyles(selectedPost.category).glow}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full ${getCategoryStyles(selectedPost.category).bg} border ${getCategoryStyles(selectedPost.category).border} overflow-hidden shrink-0`}>
                          {selectedPost.author?.avatarUrl ? (
                            <img src={selectedPost.author.avatarUrl} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full flex items-center justify-center ${getCategoryStyles(selectedPost.category).text}`}>
                              <User className="w-5 h-5 sm:w-6 sm:h-6" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="text-sm sm:text-base font-black text-white uppercase tracking-tight truncate max-w-[120px] sm:max-w-none">{selectedPost.author?.name}</p>
                          <p className="text-[9px] sm:text-[10px] text-gray-500 font-mono">
                            Postado {formatDistanceToNow(new Date(selectedPost.createdAt), { addSuffix: true, locale: ptBR })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-3">
                        {currentUserId === selectedPost.authorId && (
                          <button 
                            onClick={(e) => handleDeletePost(selectedPost.id, e)}
                            className="p-2 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            title="Excluir postagem"
                          >
                            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          </button>
                        )}
                        <span className={`px-2.5 sm:px-4 py-1 sm:py-1.5 ${getCategoryStyles(selectedPost.category).bg} border ${getCategoryStyles(selectedPost.category).border} rounded-full ${getCategoryStyles(selectedPost.category).text} text-[8px] sm:text-[10px] font-black uppercase tracking-widest`}>
                          {selectedPost.category}
                        </span>
                      </div>
                    </div>

                    <h2 className={`text-2xl sm:text-4xl font-black tracking-tighter leading-tight uppercase transition-colors ${getCategoryStyles(selectedPost.category).text}`}>
                      {selectedPost.title}
                    </h2>

                    <div className="text-gray-400 leading-relaxed text-base sm:text-lg whitespace-pre-wrap">
                      {selectedPost.content}
                    </div>

                    {selectedPost.externalLink && (
                      <div className="pt-2 sm:pt-4">
                        <a 
                          href={selectedPost.externalLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex sm:inline-flex items-center justify-center gap-3 px-6 py-3.5 sm:py-3 bg-brand-primary/20 border border-brand-primary/40 rounded-xl text-brand-primary font-black uppercase text-[9px] sm:text-[10px] tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-[0_0_20px_rgba(139,92,246,0.2)] w-full sm:w-auto"
                        >
                          <Globe className="w-4 h-4" />
                          Acessar Link Externo
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                    <div className="pt-6 border-t border-white/5 flex items-center gap-6 sm:gap-8">
                      <button 
                        onClick={() => handleToggleLike(selectedPost.id)}
                        className={`flex items-center gap-2 transition-all ${selectedPost.hasLiked ? getCategoryStyles(selectedPost.category).text : 'text-gray-500 hover:text-white'}`}
                      >
                        <ThumbsUp className={`w-4 h-4 sm:w-5 sm:h-5 ${selectedPost.hasLiked ? 'fill-current' : ''}`} />
                        <span className="font-bold text-xs sm:text-sm tracking-widest uppercase">{selectedPost.likesCount} Votos</span>
                      </button>
                      <div className="flex items-center gap-2 text-gray-500">
                        <MessageSquare className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="font-bold text-xs sm:text-sm tracking-widest uppercase">{selectedPost.commentsCount} Comentários</span>
                      </div>
                    </div>
                  </div>

                  {/* Comments Section */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-black tracking-tighter uppercase px-2 flex items-center gap-3">
                      Comentários
                      <div className="h-[2px] flex-1 bg-white/5" />
                    </h3>

                    {/* New Comment Box */}
                    <form onSubmit={handleAddComment} className="space-y-4">
                      <div className="relative">
                        <textarea 
                          placeholder="Adicione um comentário..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl p-6 pr-20 min-h-[100px] outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium text-gray-300"
                        />
                        <button 
                          type="submit"
                          className="absolute bottom-6 right-6 p-3 bg-brand-primary text-white rounded-xl shadow-lg hover:scale-105 transition-all"
                        >
                          <Send className="w-5 h-5" />
                        </button>
                      </div>
                      
                      <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 rounded-xl px-4 py-2">
                        <Globe className="w-3.5 h-3.5 text-gray-500" />
                        <input 
                          type="url"
                          placeholder="Link complementar (ex: curso, doc...)"
                          value={newCommentLink}
                          onChange={(e) => setNewCommentLink(e.target.value)}
                          className="bg-transparent border-none outline-none text-[10px] font-medium text-gray-400 w-full placeholder:text-gray-700"
                        />
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-4">
                      {comments.map(comment => (
                        <div key={comment.id} className="bg-white/[0.02] border border-white/5 rounded-2xl p-6 flex gap-6">
                          <div className="w-10 h-10 rounded-full bg-white/5 flex-shrink-0 overflow-hidden border border-white/10">
                            {comment.author?.avatarUrl ? (
                              <img src={comment.author.avatarUrl} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-600">
                                <User className="w-4 h-4" />
                              </div>
                            )}
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-[11px] font-black uppercase text-white tracking-widest">{comment.author?.name}</span>
                                <span className="text-[10px] text-gray-500 font-mono">
                                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true, locale: ptBR })}
                                </span>
                              </div>
                              {currentUserId === comment.authorId && (
                                <button 
                                  onClick={() => handleDeleteComment(comment.id)}
                                  className="p-1 px-2 text-red-500/50 hover:text-red-500 transition-colors"
                                  title="Excluir comentário"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 leading-relaxed">{comment.content}</p>
                            
                            {comment.externalLink && (
                              <div className="pt-2">
                                <a 
                                  href={comment.externalLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-lg text-brand-primary font-black uppercase text-[8px] tracking-widest hover:bg-brand-primary hover:text-white transition-all shadow-[0_0_15px_rgba(139,92,246,0.1)]"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" />
                                  Ver Referência
                                </a>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                /* Posts List View */
                <motion.div 
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-1 gap-4 sm:gap-6"
                >
                  {filteredPosts.map((post, idx) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={post.id}
                      onClick={() => handleSelectPost(post)}
                      className={`group bg-white/[0.02] border border-white/10 rounded-2xl sm:rounded-3xl p-6 sm:p-8 hover:bg-white/[0.04] transition-all cursor-pointer backdrop-blur-2xl relative overflow-hidden flex flex-col sm:flex-row gap-6 sm:gap-8 ${getCategoryStyles(post.category).hoverBorder} hover:shadow-[0_0_30px_rgba(0,0,0,0.3)]`}
                    >
                      {/* Left: Metadata and Category */}
                      <div className="flex sm:flex-col items-center sm:items-start justify-between sm:justify-start gap-4 sm:w-28 flex-shrink-0">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center justify-between w-full">
                            <Tag className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${getCategoryStyles(post.category).text} mb-1`} />
                            {currentUserId === post.authorId && (
                              <button 
                                onClick={(e) => handleDeletePost(post.id, e)}
                                className="p-1.5 rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all sm:hidden group-hover:block relative z-20"
                                title="Excluir postagem"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            )}
                          </div>
                          <span className={`text-[7.5px] sm:text-[8px] font-black uppercase tracking-[0.2em] sm:tracking-[0.3em] ${getCategoryStyles(post.category).text} leading-none`}>{post.category}</span>
                        </div>
                        
                        <div className="hidden sm:flex flex-col gap-1 pt-4 border-t border-white/5 w-full">
                          <span className="text-[7.5px] sm:text-[8px] font-mono text-gray-600 uppercase tracking-widest mb-1">DATA_LOG</span>
                          <div className="flex items-center gap-2 text-gray-400 text-[9px] sm:text-[10px] font-mono">
                            {formatDistanceToNow(new Date(post.createdAt), { addSuffix: false, locale: ptBR })}
                          </div>
                        </div>
                      </div>

                      {/* Center: Content */}
                      <div className="flex-1 space-y-4">
                        <h3 className={`text-xl sm:text-2xl font-black tracking-tighter uppercase transition-colors leading-tight line-clamp-2 ${getCategoryStyles(post.category).text.replace('text-', 'group-hover:text-')}`}>
                          {post.title}
                        </h3>

                        <p className="text-gray-500 line-clamp-2 leading-relaxed text-xs sm:text-sm font-medium italic">
                          "{post.content}"
                        </p>

                        <div className="flex items-center justify-between pt-4 sm:pt-6 border-t border-white/5">
                          <div className="flex items-center gap-3 sm:gap-4">
                            <div className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl ${getCategoryStyles(post.category).bg} flex items-center justify-center overflow-hidden border ${getCategoryStyles(post.category).border}`}>
                              {post.author?.avatarUrl ? (
                                <img src={post.author.avatarUrl} alt="" className="w-full h-full object-cover" />
                              ) : (
                                <User className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${getCategoryStyles(post.category).text}`} />
                              )}
                            </div>
                            <div className="flex flex-col">
                              <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">{post.author?.name}</span>
                              <span className={`text-[6.5px] sm:text-[7px] ${getCategoryStyles(post.category).text} font-mono uppercase`}>VERIFIED_CONTRIBUTOR</span>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 sm:gap-6">
                            <motion.div whileHover={{ scale: 1.1 }} className="flex items-center gap-1.5 sm:gap-2 group/stat">
                              <ThumbsUp className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-all ${post.hasLiked ? getCategoryStyles(post.category).text + ' fill-current' : 'text-gray-600 group-hover/stat:' + getCategoryStyles(post.category).text}`} />
                              <span className={`text-[9px] sm:text-[10px] font-black ${post.hasLiked ? getCategoryStyles(post.category).text : 'text-gray-600'}`}>{post.likesCount}</span>
                            </motion.div>
                            <div className="flex items-center gap-1.5 sm:gap-2 group/stat">
                              <MessageSquare className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-600 group-hover/stat:text-white transition-colors" />
                              <span className="text-[9px] sm:text-[10px] font-black text-gray-600 group-hover/stat:text-white">{post.commentsCount}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Hover Arrow */}
                      <div className={`hidden lg:flex items-center justify-center translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500`}>
                        <div className={`w-12 h-12 rounded-full ${getCategoryStyles(post.category).bg} flex items-center justify-center ${getCategoryStyles(post.category).text}`}>
                          <ChevronRight className="w-6 h-6" />
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {filteredPosts.length === 0 && (
                    <div className="py-20 flex flex-col items-center gap-4 text-gray-600">
                      <MessageSquare className="w-12 h-12 opacity-10" />
                      <p className="text-sm font-bold uppercase tracking-widest">Nenhuma discussão encontrada</p>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Create Post Modal */}
      <AnimatePresence>
        {isCreating && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCreating(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-xl"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-surface-card border border-white/10 rounded-3xl sm:rounded-[2.5rem] p-6 sm:p-10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-primary/5 blur-3xl -z-10" />
              
              <div className="space-y-6 sm:space-y-8">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter">Iniciar Discussão</h2>
                    <p className="text-[8px] sm:text-[10px] font-mono text-brand-primary font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] mt-1 sm:mt-2">broadcast_to_community</p>
                  </div>
                  <button 
                    onClick={() => setIsCreating(false)}
                    className="p-2 rounded-full hover:bg-white/5 text-gray-500 transition-all sm:hidden"
                  >
                    <Plus className="w-6 h-6 rotate-45" />
                  </button>
                </div>

                <form onSubmit={handleCreatePost} className="space-y-4 sm:space-y-6">
                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Título do Post</label>
                    <input 
                      required
                      type="text" 
                      placeholder="Sobre o que você quer falar?"
                      value={newPost.title}
                      onChange={(e) => setNewPost({...newPost, title: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium text-sm sm:text-base"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Categoria</label>
                      <select 
                        value={newPost.category}
                        onChange={(e) => setNewPost({...newPost, category: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-bold text-[10px] uppercase tracking-widest appearance-none"
                      >
                        {categories.filter(c => c !== 'Todas').map(cat => (
                          <option key={cat} value={cat} className="bg-[#020203] text-white uppercase">{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Conteúdo</label>
                    <textarea 
                      required
                      placeholder="Dê os detalhes..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({...newPost, content: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 min-h-[120px] sm:min-h-[150px] outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium text-gray-300 text-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-widest ml-1">Link Complementar</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-500" />
                      <input 
                        type="url" 
                        placeholder="https://..."
                        value={newPost.externalLink}
                        onChange={(e) => setNewPost({...newPost, externalLink: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-10 sm:pl-12 pr-6 py-3.5 sm:py-4 outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all font-medium text-xs sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-2">
                    <button 
                      type="button"
                      onClick={() => setIsCreating(false)}
                      className="order-2 sm:order-1 flex-1 py-4 rounded-2xl border border-white/10 hover:bg-white/5 font-black uppercase tracking-widest text-[9px] sm:text-[10px] transition-all"
                    >
                      Cancelar
                    </button>
                    <button 
                      type="submit"
                      className="order-1 sm:order-2 flex-1 py-4 bg-brand-primary text-white rounded-2xl font-black uppercase tracking-widest text-[9px] sm:text-[10px] shadow-lg shadow-brand-primary/20 hover:scale-[1.02] transition-all"
                    >
                      Publicar agora
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
