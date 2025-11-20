import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  highlight?: boolean;
}

export const StatCard: React.FC<StatCardProps> = ({ title, value, description, icon: Icon, highlight = false }) => {
  return (
    <div className={`relative overflow-hidden p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 group ${
      highlight 
        ? 'bg-black text-white shadow-xl shadow-black/20' 
        : 'bg-white text-black border border-border hover:shadow-lg hover:shadow-gray-200/50'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${highlight ? 'bg-white/10' : 'bg-gray-50 group-hover:bg-gray-100'}`}>
           {Icon && <Icon size={20} className={highlight ? 'text-white' : 'text-black'} strokeWidth={2} />}
        </div>
        {description && (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            highlight ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-600'
          }`}>
            {description}
          </span>
        )}
      </div>
      
      <div className="mt-2">
        <h3 className={`text-4xl font-display font-bold tracking-tight ${highlight ? 'text-white' : 'text-black'}`}>
          {value}
        </h3>
        <p className={`text-sm font-medium mt-1 ${highlight ? 'text-gray-400' : 'text-gray-500'}`}>
          {title}
        </p>
      </div>
      
      {/* Decorational gradient blob */}
      <div className={`absolute -right-4 -bottom-4 w-24 h-24 rounded-full blur-2xl opacity-20 pointer-events-none ${
        highlight ? 'bg-gray-500' : 'bg-gray-200'
      }`} />
    </div>
  );
};