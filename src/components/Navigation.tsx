import React from 'react';
import { NavLink } from 'react-router-dom';
import type { ViewType } from '../routes';
import { viewPaths } from '../routes';
import {
  LayoutDashboard,
  Upload,
  FileText,
  AlertTriangle,
  TrendingUp,
  Download,
  Zap
} from 'lucide-react';

const navItems: { id: ViewType; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
  { id: 'import', label: 'Import FEC', icon: Upload },
  { id: 'financials', label: 'États Financiers', icon: FileText },
  { id: 'risk', label: 'Analyse Risques', icon: AlertTriangle },
  { id: 'qoe', label: 'Quality of Earnings', icon: TrendingUp },
  { id: 'deliverables', label: 'Livrables', icon: Download }
];

export const Navigation: React.FC = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">Pégase</h1>
            <span className="text-sm text-gray-500">Due Diligence Platform</span>
          </div>

          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={viewPaths[item.id]}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:block">{item.label}</span>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};