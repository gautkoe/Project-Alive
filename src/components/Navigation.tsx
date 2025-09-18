import React from 'react';
import { ViewType } from '../App';
import {
  Home as HomeIcon,
  LayoutDashboard,
  Upload,
  FileText,
  AlertTriangle,
  TrendingUp,
  Download,
  Zap
} from 'lucide-react';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const navItems = [
    { id: 'home' as ViewType, label: 'Accueil', icon: HomeIcon },
    { id: 'dashboard' as ViewType, label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'import' as ViewType, label: 'Import & Contrôles', icon: Upload },
    { id: 'financials' as ViewType, label: 'États Financiers', icon: FileText },
    { id: 'risk' as ViewType, label: 'Analyse des Risques', icon: AlertTriangle },
    { id: 'qoe' as ViewType, label: 'Quality of Earnings', icon: TrendingUp },
    { id: 'deliverables' as ViewType, label: 'Livrables', icon: Download },
  ];

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
              const isActive = currentView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onViewChange(item.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:block">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </nav>
  );
};