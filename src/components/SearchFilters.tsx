/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Search, SlidersHorizontal } from 'lucide-react';

interface SearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  areaFilter: string;
  onAreaFilterChange: (value: string) => void;
}

const AREAS = ['Todas', 'Front-end', 'Back-end', 'Full-stack', 'Dados', 'Design', 'Mobile'];

export default function SearchFilters({
  searchTerm,
  onSearchChange,
  areaFilter,
  onAreaFilterChange
}: SearchFiltersProps) {
  return (
    <div className="flex flex-col gap-8 mb-16">
      <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
        <div className="relative w-full max-w-xl group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600 group-focus-within:text-brand-primary transition-colors" />
          <input
            type="text"
            placeholder="Procure por nome ou especialização técnica..."
            className="w-full bg-surface-card border border-white/10 rounded-full pl-14 pr-8 py-4.5 text-sm text-white placeholder:text-gray-700 focus:outline-none focus:border-brand-primary/50 transition-all shadow-xl font-medium"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-surface-card/40 border border-white/5 rounded-full backdrop-blur-md">
          {AREAS.map((area) => (
            <button
              key={area}
              onClick={() => onAreaFilterChange(area)}
              className={`px-7 py-2.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] transition-all whitespace-nowrap ${
                areaFilter === area
                  ? 'bg-brand-primary text-white shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                  : 'text-gray-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
