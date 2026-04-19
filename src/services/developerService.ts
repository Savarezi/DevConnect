/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Developer, DeveloperFormData } from '../types';
import { INITIAL_DEVELOPERS } from '../data/mockDevelopers';
import { supabase } from '../lib/supabase';

const isSupabaseConfigured = () => {
  return !!import.meta.env.VITE_SUPABASE_URL && !!import.meta.env.VITE_SUPABASE_ANON_KEY;
};

export const developerService = {
  getDevelopers: async (): Promise<Developer[]> => {
    if (!isSupabaseConfigured()) {
      // Fallback to mock data if Supabase is not configured
      return INITIAL_DEVELOPERS;
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase fetch error:', error);
      return [];
    }

    return (data || []).map(item => ({
      id: item.id,
      ownerId: item.user_id,
      name: item.name,
      avatarUrl: item.avatar_url,
      currentArea: item.current_area,
      interestArea: item.tech_stack || '',
      seniority: item.seniority as any,
      linkedinUrl: item.linkedin_url || '',
      githubUrl: item.github_url || '',
      createdAt: item.created_at,
    }));
  },

  addDeveloper: async (data: DeveloperFormData): Promise<Developer> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Não autenticado');

    const profileData = {
      user_id: user.id,
      name: data.name,
      avatar_url: data.avatarUrl,
      current_area: data.currentArea,
      tech_stack: data.interestArea,
      seniority: data.seniority,
      linkedin_url: data.linkedinUrl,
      github_url: data.githubUrl,
    };

    const { data: inserted, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select()
      .single();

    if (error) throw error;

    return {
      id: inserted.id,
      ownerId: inserted.user_id,
      name: inserted.name,
      avatarUrl: inserted.avatar_url,
      currentArea: inserted.current_area,
      interestArea: inserted.tech_stack,
      seniority: inserted.seniority,
      linkedinUrl: inserted.linkedin_url,
      githubUrl: inserted.github_url,
      createdAt: inserted.created_at,
    };
  },

  updateDeveloper: async (id: string, data: DeveloperFormData): Promise<Developer> => {
    const profileData = {
      name: data.name,
      avatar_url: data.avatarUrl,
      current_area: data.currentArea,
      tech_stack: data.interestArea,
      seniority: data.seniority,
      linkedin_url: data.linkedinUrl,
      github_url: data.githubUrl,
    };

    const { data: updated, error } = await supabase
      .from('profiles')
      .update(profileData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: updated.id,
      ownerId: updated.user_id,
      name: updated.name,
      avatarUrl: updated.avatar_url,
      currentArea: updated.current_area,
      interestArea: updated.tech_stack,
      seniority: updated.seniority,
      linkedinUrl: updated.linkedin_url,
      githubUrl: updated.github_url,
      createdAt: updated.created_at,
    };
  }
};
