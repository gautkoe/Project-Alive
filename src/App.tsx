import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { FileImport } from './components/FileImport';
import { FinancialStatements } from './components/FinancialStatements';
import { RiskAnalysis } from './components/RiskAnalysis';
import { QualityOfEarnings } from './components/QualityOfEarnings';
import { Deliverables } from './components/Deliverables';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

export type ViewType = 'dashboard' | 'import' | 'financials' | 'risk' | 'qoe' | 'deliverables';

const AppLayout: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const { theme } = useTheme();

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'import':
        return <FileImport />;
      case 'financials':
        return <FinancialStatements />;
      case 'risk':
        return <RiskAnalysis />;
      case 'qoe':
        return <QualityOfEarnings />;
      case 'deliverables':
        return <Deliverables />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <main className="pt-16">
          {renderView()}
        </main>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
