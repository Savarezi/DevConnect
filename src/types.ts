/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type SeniorityLevel = 'Estagiário' | 'Trainee' | 'Júnior' | 'Pleno' | 'Sênior' | 'Especialista';

export interface Developer {
  id: string;
  ownerId: string;
  name: string;
  avatarUrl?: string;
  currentArea: string;
  interestArea: string;
  seniority: SeniorityLevel;
  linkedinUrl: string;
  githubUrl: string;
  createdAt: string;
}

export type DeveloperFormData = Omit<Developer, 'id' | 'createdAt' | 'ownerId'>;
