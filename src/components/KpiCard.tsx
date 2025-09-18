import React from 'react';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface KpiCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: LucideIcon;
  detail: string;
}

export const KpiCard: React.FC<KpiCardProps> = ({ 
  title, 
  value, 
  change, 
  trend, 
  icon: Icon, 
  detail 
}) => {
  const trendColor = trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  const bgColor = trend === 'up' ? 'bg-green-50 dark:bg-green-500/10' : 'bg-red-50 dark:bg-red-500/10';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer dark:bg-slate-900 dark:border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400" />
        <span className={`px-2 py-1 rounded text-sm font-medium ${bgColor} ${trendColor}`}>
          {change}
        </span>
      </div>

      <h3 className="text-lg font-semibold text-gray-900 mb-2 dark:text-slate-100">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1 dark:text-slate-100">{value}</p>
      <p className="text-sm text-gray-600 dark:text-slate-300">{detail}</p>
    </div>
  );
};