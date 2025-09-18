import React from 'react';
import { NavLink } from 'react-router-dom';
import { ViewType } from '../App';
import {
  AlertTriangle,
  Download,
  FileText,
  Home as HomeIcon,
  LayoutDashboard,
  Moon,
  Sun,
  TrendingUp,
  Upload,
  Zap,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

type NavigationItem = {
  id: ViewType;
  label: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  path: string;
  end?: boolean;
};

const navigationItems: NavigationItem[] = [
  { id: 'home', label: 'Accueil', icon: HomeIcon, path: '/', end: true },
  { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard, path: '/dashboard' },
  { id: 'import', label: 'Import FEC', icon: Upload, path: '/import' },
  { id: 'financials', label: 'États Financiers', icon: FileText, path: '/financials' },
  { id: 'risk', label: 'Analyse Risques', icon: AlertTriangle, path: '/risk' },
  { id: 'qoe', label: 'Quality of Earnings', icon: TrendingUp, path: '/qoe' },
  { id: 'deliverables', label: 'Livrables', icon: Download, path: '/deliverables' },
];

export const Navigation: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkMode = theme === 'dark';

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b border-gray-200 z-50 dark:bg-slate-900 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Zap className="h-8 w-8 text-blue-600" aria-hidden="true" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Pégase</h1>
            <span className="text-sm text-gray-500 dark:text-slate-300">Due Diligence Platform</span>
          </div>

          <div className="flex items-center space-x-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  end={item.end}
                  className={({ isActive }) =>
                    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 flex items-center space-x-2 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
                      isActive
                        ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-100'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-slate-300 dark:hover:text-white dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="hidden md:block">{item.label}</span>
                </NavLink>
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
