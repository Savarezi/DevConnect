/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function Avatar({ src, name, size = 'md' }: AvatarProps) {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-20 h-20',
    lg: 'w-24 h-24',
  };

  const placeholderColor = `bg-gradient-to-br from-indigo-500 to-purple-600`;

  return (
    <div className="relative group/avatar">
      {/* Neon Glow Ring */}
      <div className={`absolute inset-0 rounded-full bg-brand-primary opacity-50 blur-md group-hover/avatar:opacity-80 transition-opacity animate-pulse`} />
      <div className={`absolute -inset-1 rounded-full bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-accent p-[2px]`}>
        <div className="w-full h-full rounded-full bg-surface-base" />
      </div>

      <div className={`${sizeClasses[size]} rounded-full overflow-hidden border-2 border-white/10 shadow-lg relative flex items-center justify-center bg-gray-800 z-10`}>
        {src ? (
          <img
            src={src}
            alt={name}
            className="w-full h-full object-cover group-hover/avatar:scale-110 transition-transform duration-500"
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
            }}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-white font-bold ${placeholderColor} text-xl uppercase`}>
            {name.charAt(0)}
          </div>
        )}
      </div>
    </div>
  );
}
