import React, { useState } from 'react';
import { AlertTriangle, Eye, Download, Filter, TrendingDown, Users, DollarSign } from 'lucide-react';

export const RiskAnalysis: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const risks = [
    {
      id: 1,
      category: 'revenue',
      type: 'critical',
      title: 'Cut-off revenus suspects',
      description: 'Pic anormal de facturation en décembre (+35% vs moyenne mensuelle)',
      impact: 'Élevé',
      amount: '1 280 K€',
      details: 'Z-score: 2.8 | 45 factures concernées | Clients: 12',
      recommendation: 'Vérifier la réalité des prestations et livraisons',
      accounts: '701000, 706000'
    },
    {
      id: 2,
      category: 'client',
      type: 'high',
      title: 'Concentration client excessive',
      description: 'Top 3 clients représentent 45% du chiffre d\'affaires',
      impact: 'Élevé',
      amount: '8 300 K€',
      details: 'Client #1: 18% | Client #2: 15% | Client #3: 12%',
      recommendation: 'Diversifier le portefeuille client et sécuriser les contrats',
      accounts: '411000'
    },
    {
      id: 3,
      category: 'accounting',
      type: 'warning',
      title: 'Comptes d\'attente anormaux',
      description: 'Solde élevé sur compte d\'attente 471000',
      impact: 'Moyen',
      amount: '145 K€',
      details: '23 écritures non soldées depuis plus de 3 mois',
      recommendation: 'Apurer les comptes d\'attente et justifier les soldes',
      accounts: '471000'
    },
    {
      id: 4,
      category: 'supplier',
      type: 'warning',
      title: 'Délais fournisseurs allongés',
      description: 'DPO moyen en hausse de 15 jours vs N-1',
      impact: 'Moyen',
      amount: '2 400 K€',
      details: 'DPO actuel: 67 jours | N-1: 52 jours | Écart: +15j',
      recommendation: 'Surveiller les relations fournisseurs et la trésorerie',
      accounts: '401000'
    },
    {
      id: 5,
      category: 'inventory',
      type: 'info',
      title: 'Rotation stocks en baisse',
      description: 'DIO en augmentation, stocks dormants détectés',
      impact: 'Faible',
      amount: '890 K€',
      details: 'DIO: 45 jours (+8j vs N-1) | 15% stocks > 6 mois',
      recommendation: 'Optimiser la gestion des stocks et identifier les obsolètes',
      accounts: '370000'
    },
    {
      id: 6,
      category: 'accounting',
      type: 'high',
      title: 'Écritures d\'OD suspectes',
      description: 'Volume inhabituellement élevé d\'OD en fin d\'exercice',
      impact: 'Élevé',
      amount: '450 K€',
      details: '78 écritures OD en décembre | Moyenne: 12/mois',
      recommendation: 'Analyser la nature et justification de ces écritures',
      accounts: 'Journal OD'
    }
  ];

  const filteredRisks = selectedCategory === 'all' 
    ? risks 
    : risks.filter(risk => risk.category === selectedCategory);

  const getRiskIcon = (type: string) => {
    switch (type) {
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'high': return <AlertTriangle className="h-5 w-5 text-orange-600" />;
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case 'info': return <AlertTriangle className="h-5 w-5 text-blue-600" />;
    }
  };

  const getRiskColor = (type: string) => {
    switch (type) {
      case 'critical': return 'bg-red-50 border-red-200';
      case 'high': return 'bg-orange-50 border-orange-200';
      case 'warning': return 'bg-yellow-50 border-yellow-200';
      case 'info': return 'bg-blue-50 border-blue-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'revenue': return <DollarSign className="h-4 w-4" />;
      case 'client': return <Users className="h-4 w-4" />;
      case 'supplier': return <Users className="h-4 w-4" />;
      case 'inventory': return <TrendingDown className="h-4 w-4" />;
      case 'accounting': return <Eye className="h-4 w-4" />;
      default: return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const drillDown = (accounts: string, riskId: number) => {
    alert(`Drill-down risque #${riskId} - Comptes: ${accounts}\nExport FEC filtré disponible`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analyse des Risques</h1>
          <p className="text-gray-600">Détection automatique d'anomalies et points d'attention</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Rapport Risques</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Seuils</span>
          </button>
        </div>
      </div>

      {/* Risk Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Risques Critiques', count: 1, color: 'bg-red-500', textColor: 'text-red-600' },
          { label: 'Risques Élevés', count: 2, color: 'bg-orange-500', textColor: 'text-orange-600' },
          { label: 'Alertes', count: 2, color: 'bg-yellow-500', textColor: 'text-yellow-600' },
          { label: 'Informations', count: 1, color: 'bg-blue-500', textColor: 'text-blue-600' }
        ].map((summary, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{summary.label}</p>
                <p className="text-2xl font-bold text-gray-900">{summary.count}</p>
              </div>
              <div className={`w-3 h-3 rounded-full ${summary.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Category Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
              selectedCategory === 'all'
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <span>Tous les risques</span>
          </button>
          {[
            { id: 'revenue', label: 'Revenus' },
            { id: 'client', label: 'Clients' },
            { id: 'supplier', label: 'Fournisseurs' },
            { id: 'inventory', label: 'Stocks' },
            { id: 'accounting', label: 'Comptabilité' }
          ].map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors flex items-center space-x-2 ${
                selectedCategory === category.id
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {getCategoryIcon(category.id)}
              <span>{category.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Risk List */}
      <div className="space-y-4">
        {filteredRisks.map((risk) => (
          <div
            key={risk.id}
            className={`border rounded-lg p-6 ${getRiskColor(risk.type)}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start space-x-3">
                {getRiskIcon(risk.type)}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{risk.title}</h3>
                  <p className="text-gray-700 mt-1">{risk.description}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Impact financier</p>
                <p className="text-xl font-bold text-gray-900">{risk.amount}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Détails de l'analyse</h4>
                <p className="text-sm text-gray-700">{risk.details}</p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Recommandation</h4>
                <p className="text-sm text-gray-700">{risk.recommendation}</p>
              </div>
            </div>

            <div className="flex items-center justify-between pt-4 border-t border-gray-200">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Comptes:</span> {risk.accounts}
                </span>
                <span className="text-sm text-gray-600">
                  <span className="font-medium">Impact:</span> {risk.impact}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => drillDown(risk.accounts, risk.id)}
                  className="px-3 py-1 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 transition-colors text-sm flex items-center space-x-1"
                >
                  <Eye className="h-3 w-3" />
                  <span>Voir détail</span>
                </button>
                <button className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-sm">
                  Marquer traité
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Risk Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Distribution des Risques</h3>
          <div className="space-y-3">
            {[
              { category: 'Revenus & CA', count: 1, percentage: 17 },
              { category: 'Relations clients', count: 1, percentage: 17 },
              { category: 'Comptabilité', count: 2, percentage: 33 },
              { category: 'Fournisseurs', count: 1, percentage: 17 },
              { category: 'Stocks & actifs', count: 1, percentage: 17 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-gray-700">{item.category}</span>
                <div className="flex items-center space-x-3">
                  <div className="w-24 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Recommandées</h3>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-red-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Priorité 1</p>
                <p className="text-sm text-gray-600">Analyser le cut-off des revenus de décembre</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Priorité 2</p>
                <p className="text-sm text-gray-600">Évaluer le risque de concentration client</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
              <div>
                <p className="text-sm font-medium text-gray-900">Priorité 3</p>
                <p className="text-sm text-gray-600">Justifier les écritures d'OD de fin d'exercice</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};