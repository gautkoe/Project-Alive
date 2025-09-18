import React from 'react';
import { ViewType } from '../App';
import {
  LayoutDashboard,
  Upload,
  FileText,
  AlertTriangle,
  TrendingUp,
  Download,
  Zap,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

interface NavigationProps {
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onViewChange }) => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  const navItems = [
    { id: 'dashboard' as ViewType, label: 'Tableau de Bord', icon: LayoutDashboard },
    { id: 'import' as ViewType, label: 'Import FEC', icon: Upload },
    { id: 'financials' as ViewType, label: 'États Financiers', icon: FileText },
    { id: 'risk' as ViewType, label: 'Analyse Risques', icon: AlertTriangle },
    { id: 'qoe' as ViewType, label: 'Quality of Earnings', icon: TrendingUp },
    { id: 'deliverables' as ViewType, label: 'Livrables', icon: Download },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pégase</h1>
            <span className="text-sm text-gray-500 dark:text-slate-300">Due Diligence Platform</span>
          </div>

          <div className="flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onViewChange(item.id)}
                  aria-current={isActive ? 'page' : undefined}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden md:block">{item.label}</span>
                </button>
              );
            })}

            <div className="ml-2 pl-3 border-l border-gray-200 dark:border-slate-700">
              <button
                type="button"
                onClick={toggleTheme}
                aria-pressed={isDarkMode}
                className="flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800"
              >
                {isDarkMode ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
                <span>{isDarkMode ? 'Mode sombre' : 'Mode clair'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
