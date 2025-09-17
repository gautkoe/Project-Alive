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
  const trendColor = trend === 'up' ? 'text-green-600' : 'text-red-600';
  const bgColor = trend === 'up' ? 'bg-green-50' : 'bg-red-50';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer">
      <div className="flex items-center justify-between mb-4">
        <Icon className="h-8 w-8 text-blue-600" />
        <span className={`px-2 py-1 rounded text-sm font-medium ${bgColor} ${trendColor}`}>
          {change}
        </span>
      </div>
      
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-3xl font-bold text-gray-900 mb-1">{value}</p>
      <p className="text-sm text-gray-600">{detail}</p>
    </div>
  );
};