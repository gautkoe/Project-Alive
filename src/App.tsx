import React, { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { FileImport } from './components/FileImport';
import { FinancialStatements } from './components/FinancialStatements';
import { RiskAnalysis } from './components/RiskAnalysis';
import { QualityOfEarnings } from './components/QualityOfEarnings';
import { Deliverables } from './components/Deliverables';
import { AppProvider } from './context/AppContext';

export type ViewType = 'dashboard' | 'import' | 'financials' | 'risk' | 'qoe' | 'deliverables';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');

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
    <AppProvider>
      <div className="min-h-screen bg-gray-50">
        <Navigation currentView={currentView} onViewChange={setCurrentView} />
        <main className="pt-16">
          {renderView()}
        </main>
      </div>
    </AppProvider>
  );
}

export default App;