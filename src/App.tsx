import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navigation } from './components/Navigation';
import { Dashboard } from './components/Dashboard';
import { FileImport } from './components/FileImport';
import { FinancialStatements } from './components/FinancialStatements';
import { RiskAnalysis } from './components/RiskAnalysis';
import { QualityOfEarnings } from './components/QualityOfEarnings';
import { Deliverables } from './components/Deliverables';
import { viewPaths } from './routes';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="pt-16">
        <Routes>
          <Route path={viewPaths.dashboard} element={<Dashboard />} />
          <Route path={viewPaths.import} element={<FileImport />} />
          <Route path={viewPaths.financials} element={<FinancialStatements />} />
          <Route path={viewPaths.risk} element={<RiskAnalysis />} />
          <Route path={viewPaths.qoe} element={<QualityOfEarnings />} />
          <Route path={viewPaths.deliverables} element={<Deliverables />} />
          <Route path="*" element={<Dashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;