import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Home } from './components/Home';
import { Dashboard } from './components/Dashboard';
import { FileImport } from './components/FileImport';
import { FinancialStatements } from './components/FinancialStatements';
import { RiskAnalysis } from './components/RiskAnalysis';
import { QualityOfEarnings } from './components/QualityOfEarnings';
import { Deliverables } from './components/Deliverables';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';

export type ViewType =
  | 'home'
  | 'dashboard'
  | 'import'
  | 'financials'
  | 'risk'
  | 'qoe'
  | 'deliverables';

const AppLayout: React.FC = () => {
  const { theme } = useTheme();

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 text-gray-900 transition-colors duration-300 dark:bg-slate-950 dark:text-slate-100">
        <Navigation />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/import" element={<FileImport />} />
            <Route path="/financials" element={<FinancialStatements />} />
            <Route path="/risk" element={<RiskAnalysis />} />
            <Route path="/qoe" element={<QualityOfEarnings />} />
            <Route path="/deliverables" element={<Deliverables />} />
            <Route path="*" element={<Home />} />
          </Routes>
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
