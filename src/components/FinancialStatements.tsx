import React, { useState } from 'react';
import { TrendingUp, Eye, Download, Calculator } from 'lucide-react';

type StatementType = 'pl' | 'balance' | 'cashflow';

export const FinancialStatements: React.FC = () => {
  const [activeStatement, setActiveStatement] = useState<StatementType>('pl');

  const plData = [
    { label: 'Chiffre d\'affaires', current: 18450, previous: 17100, accounts: '701, 702, 706', variance: 7.9 },
    { label: 'Achats consommés', current: -7200, previous: -6800, accounts: '601, 602, 603', variance: 5.9 },
    { label: 'Charges externes', current: -3450, previous: -3200, accounts: '61*, 62*', variance: 7.8 },
    { label: 'Impôts et taxes', current: -680, previous: -640, accounts: '631, 633, 635', variance: 6.3 },
    { label: 'Charges de personnel', current: -4890, previous: -4650, accounts: '64*', variance: 5.2 },
    { label: 'EBITDA', current: 2230, previous: 1810, accounts: 'Calculé', variance: 23.2, isCalculated: true },
    { label: 'Dotations amort./prov.', current: -890, previous: -820, accounts: '681*, 687*', variance: 8.5 },
    { label: 'EBIT', current: 1340, previous: 990, accounts: 'Calculé', variance: 35.4, isCalculated: true },
    { label: 'Résultat financier', current: -120, previous: -95, accounts: '66*, 76*', variance: 26.3 },
    { label: 'Résultat courant', current: 1220, previous: 895, accounts: 'Calculé', variance: 36.3, isCalculated: true },
  ];

  const balanceData = [
    { label: 'Immobilisations incorporelles', current: 450, previous: 320, accounts: '20*', variance: 40.6 },
    { label: 'Immobilisations corporelles', current: 2340, previous: 2180, accounts: '21*', variance: 7.3 },
    { label: 'Immobilisations financières', current: 120, previous: 150, accounts: '26*, 27*', variance: -20.0 },
    { label: 'Actif immobilisé', current: 2910, previous: 2650, accounts: 'Calculé', variance: 9.8, isCalculated: true },
    { label: 'Stocks', current: 890, previous: 820, accounts: '3*', variance: 8.5 },
    { label: 'Créances clients', current: 1240, previous: 1100, accounts: '411*', variance: 12.7 },
    { label: 'Autres créances', current: 230, previous: 190, accounts: '44*, 45*', variance: 21.1 },
    { label: 'Trésorerie', current: 680, previous: 420, accounts: '51*, 53*', variance: 61.9 },
    { label: 'Actif circulant', current: 3040, previous: 2530, accounts: 'Calculé', variance: 20.2, isCalculated: true },
    { label: 'TOTAL ACTIF', current: 5950, previous: 5180, accounts: 'Calculé', variance: 14.9, isCalculated: true },
  ];

  const cashflowData = [
    { label: 'Résultat net', current: 980, previous: 720, accounts: 'P&L', variance: 36.1 },
    { label: 'Dotations nettes', current: 890, previous: 820, accounts: '681*, 787*', variance: 8.5 },
    { label: 'CAF', current: 1870, previous: 1540, accounts: 'Calculé', variance: 21.4, isCalculated: true },
    { label: 'Variation BFR', current: -180, previous: -95, accounts: 'Calculé', variance: 89.5, isCalculated: true },
    { label: 'Flux de trésorerie opérationnel', current: 1690, previous: 1445, accounts: 'Calculé', variance: 17.0, isCalculated: true },
    { label: 'Acquisitions immobilisations', current: -450, previous: -320, accounts: 'Bilan', variance: 40.6 },
    { label: 'Cessions d\'actifs', current: 50, previous: 0, accounts: 'Bilan', variance: 0 },
    { label: 'Flux d\'investissement', current: -400, previous: -320, accounts: 'Calculé', variance: 25.0, isCalculated: true },
    { label: 'Variation emprunts', current: -180, previous: 150, accounts: '16*', variance: -220.0 },
    { label: 'Dividendes versés', current: -850, previous: -650, accounts: '457*', variance: 30.8 },
    { label: 'Flux de financement', current: -1030, previous: -500, accounts: 'Calculé', variance: 106.0, isCalculated: true },
    { label: 'Variation trésorerie', current: 260, previous: 625, accounts: 'Calculé', variance: -58.4, isCalculated: true },
  ];

  const getCurrentData = () => {
    switch (activeStatement) {
      case 'pl': return plData;
      case 'balance': return balanceData;
      case 'cashflow': return cashflowData;
    }
  };

  const getTitle = () => {
    switch (activeStatement) {
      case 'pl': return 'Compte de Résultat (LTM)';
      case 'balance': return 'Bilan (31/12/2024)';
      case 'cashflow': return 'Tableau de Flux de Trésorerie';
    }
  };

  const drillDown = (accounts: string) => {
    if (accounts === 'Calculé') {
      alert('Ligne calculée - Voir détail des composants');
    } else {
      alert(`Drill-down vers comptes ${accounts} - Export FEC filtré disponible`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">États Financiers Retraités</h1>
          <p className="text-gray-600">États normalisés avec drill-down jusqu'aux écritures FEC</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export Excel TS</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Calculator className="h-4 w-4" />
            <span>Recalculer</span>
          </button>
        </div>
      </div>

      {/* Statement Tabs */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'pl', label: 'Compte de Résultat', icon: TrendingUp },
              { id: 'balance', label: 'Bilan', icon: Calculator },
              { id: 'cashflow', label: 'Cash-Flow', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveStatement(tab.id as StatementType)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
                  activeStatement === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Statement Content */}
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">{getTitle()}</h2>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                <span className="font-medium">Période:</span> Janvier 2024 - Décembre 2024
              </div>
              <div className="text-sm text-gray-600">
                <span className="font-medium">Devise:</span> EUR (000)
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-900">Rubrique</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">2024 (LTM)</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">2023</th>
                  <th className="text-right py-3 px-4 font-semibold text-gray-900">Δ %</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Comptes PCG</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentData().map((row, index) => (
                  <tr 
                    key={index} 
                    className={`border-b border-gray-100 hover:bg-gray-50 transition-colors ${
                      row.isCalculated ? 'bg-blue-50 font-semibold' : ''
                    }`}
                  >
                    <td className="py-3 px-4 text-gray-900">{row.label}</td>
                    <td className="py-3 px-4 text-right font-mono">
                      {row.current > 0 ? '' : ''}
                      {Math.abs(row.current).toLocaleString('fr-FR')}
                    </td>
                    <td className="py-3 px-4 text-right font-mono text-gray-600">
                      {row.previous > 0 ? '' : ''}
                      {Math.abs(row.previous).toLocaleString('fr-FR')}
                    </td>
                    <td className={`py-3 px-4 text-right font-medium ${
                      row.variance > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {row.variance > 0 ? '+' : ''}{row.variance.toFixed(1)}%
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        row.isCalculated 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {row.accounts}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => drillDown(row.accounts)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                        title="Drill-down vers écritures FEC"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Additional Analytics */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Ratios Clés</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Marge EBITDA</span>
                  <span className="font-medium">12.1%</span>
                </div>
                <div className="flex justify-between">
                  <span>Marge EBIT</span>
                  <span className="font-medium">7.3%</span>
                </div>
                <div className="flex justify-between">
                  <span>ROA</span>
                  <span className="font-medium">16.5%</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Évolution vs N-1</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Croissance CA</span>
                  <span className="font-medium text-green-600">+7.9%</span>
                </div>
                <div className="flex justify-between">
                  <span>Croissance EBITDA</span>
                  <span className="font-medium text-green-600">+23.2%</span>
                </div>
                <div className="flex justify-between">
                  <span>Levier opérationnel</span>
                  <span className="font-medium">2.93x</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-900 mb-2">Contrôles</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center">
                  <span>Équilibre</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Cohérence flux</span>
                  <span className="text-green-600">✓</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Mapping PCG</span>
                  <span className="text-green-600">✓</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};