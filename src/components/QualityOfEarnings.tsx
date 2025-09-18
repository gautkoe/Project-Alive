import React, { useState } from 'react';
import { TrendingUp, CheckCircle, X, Eye, Download } from 'lucide-react';

export const QualityOfEarnings: React.FC = () => {
  const [adjustments, setAdjustments] = useState([
    {
      id: 1,
      category: 'Non-récurrent',
      description: 'Frais de conseil acquisition',
      amount: -85,
      probability: 95,
      status: 'pending',
      account: '622800',
      justification: 'Honoraires exceptionnels liés à l\'acquisition de Subsidiary Co.',
      impact: 'Ajouter'
    },
    {
      id: 2,
      category: 'Owner benefit',
      description: 'Véhicule de direction',
      amount: -35,
      probability: 80,
      status: 'pending',
      account: '615500',
      justification: 'Usage mixte véhicule dirigeant (70% personnel estimé)',
      impact: 'Ajouter'
    },
    {
      id: 3,
      category: 'Non-récurrent',
      description: 'Cession matériel ancien',
      amount: 45,
      probability: 90,
      status: 'pending',
      account: '775000',
      justification: 'Plus-value sur cession équipement industriel obsolète',
      impact: 'Soustraire'
    },
    {
      id: 4,
      category: 'Reclassement',
      description: 'Charges sociales dirigeant',
      amount: -28,
      probability: 85,
      status: 'accepted',
      account: '645000',
      justification: 'Part patronale charges sociales dirigeant au-dessus du marché',
      impact: 'Ajouter'
    },
    {
      id: 5,
      category: 'Provision',
      description: 'Sur-provision clients douteux',
      amount: 12,
      probability: 75,
      status: 'pending',
      account: '491000',
      justification: 'Provision clients surévaluée vs historique recouvrements',
      impact: 'Ajouter'
    },
    {
      id: 6,
      category: 'Owner benefit',
      description: 'Frais de réception dirigeant',
      amount: -18,
      probability: 70,
      status: 'pending',
      account: '625600',
      justification: 'Réceptions personnelles du dirigeant facturées à la société',
      impact: 'Ajouter'
    }
  ]);

  const handleAdjustment = (id: number, action: 'accept' | 'reject' | 'modify') => {
    setAdjustments(prev => prev.map(adj => 
      adj.id === id 
        ? { ...adj, status: action === 'accept' ? 'accepted' : action === 'reject' ? 'rejected' : 'pending' }
        : adj
    ));
  };

  const getTotalAdjustments = () => {
    return adjustments
      .filter(adj => adj.status === 'accepted')
      .reduce((sum, adj) => sum + adj.amount, 0);
  };

  const getEbitdaNormalized = () => {
    const baseEbitda = 2230; // From dashboard
    return baseEbitda + getTotalAdjustments();
  };

  const getProbabilityColor = (prob: number) => {
    if (prob >= 90) return 'text-green-600 bg-green-100 dark:text-green-200 dark:bg-green-500/20';
    if (prob >= 75) return 'text-yellow-600 bg-yellow-100 dark:text-yellow-200 dark:bg-yellow-500/20';
    return 'text-red-600 bg-red-100 dark:text-red-200 dark:bg-red-500/20';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <X className="h-4 w-4 text-red-600" />;
      default: return <div className="h-4 w-4 border-2 border-gray-300 rounded dark:border-slate-500" />;
    }
  };

  const drillDown = (account: string, id: number) => {
    alert(`Drill-down ajustement #${id}\nCompte: ${account}\nExport FEC disponible`);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Quality of Earnings</h1>
          <p className="text-gray-600 dark:text-slate-300">Normalisation assistée de l'EBITDA</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2">
            <Download className="h-4 w-4" />
            <span>Export QoE</span>
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
            Recalculer
          </button>
        </div>
      </div>

      {/* EBITDA Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 dark:bg-slate-900 dark:border-slate-700">
          <h3 className="text-sm font-medium text-gray-600 mb-2 dark:text-slate-300">EBITDA Reporté</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">2 230 K€</p>
          <p className="text-sm text-gray-500 dark:text-slate-300">LTM Décembre 2024</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 dark:bg-slate-900 dark:border-slate-700">
          <h3 className="text-sm font-medium text-gray-600 mb-2 dark:text-slate-300">Ajustements Validés</h3>
          <p className={`text-2xl font-bold ${getTotalAdjustments() >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {getTotalAdjustments() > 0 ? '+' : ''}{getTotalAdjustments()} K€
          </p>
          <p className="text-sm text-gray-500 dark:text-slate-300">{adjustments.filter(a => a.status === 'accepted').length} ajustements</p>
        </div>
        <div className="bg-blue-50 rounded-lg border border-blue-200 p-4 dark:bg-blue-500/10 dark:border-blue-500/40">
          <h3 className="text-sm font-medium text-blue-600 mb-2 dark:text-blue-200">EBITDA Normalisé</h3>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">{getEbitdaNormalized().toLocaleString('fr-FR')} K€</p>
          <p className="text-sm text-blue-600 dark:text-blue-200">Après ajustements QoE</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 dark:bg-slate-900 dark:border-slate-700">
          <h3 className="text-sm font-medium text-gray-600 mb-2 dark:text-slate-300">Multiple Impact</h3>
          <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">+{(getTotalAdjustments() * 8).toLocaleString('fr-FR')} K€</p>
          <p className="text-sm text-gray-500 dark:text-slate-300">@ 8x EBITDA</p>
        </div>
      </div>

      {/* Adjustments Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden dark:bg-slate-900 dark:border-slate-700">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Ajustements Détectés</h3>
          <p className="text-sm text-gray-600 dark:text-slate-300">Validation assistée par IA avec scoring de probabilité</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-slate-900">
              <tr>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">Statut</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">Catégorie</th>
                <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">Description</th>
                <th className="text-right py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">Montant (K€)</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">Probabilité</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">Compte</th>
                <th className="text-center py-3 px-4 font-semibold text-gray-900 dark:text-slate-100">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adjustments.map((adjustment) => (
                <tr key={adjustment.id} className="border-b border-gray-100 hover:bg-gray-50 dark:border-slate-800 dark:hover:bg-slate-800">
                  <td className="py-3 px-4">
                    {getStatusIcon(adjustment.status)}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      adjustment.category === 'Non-récurrent' ? 'bg-red-100 text-red-800 dark:bg-red-500/20 dark:text-red-200' :
                      adjustment.category === 'Owner benefit' ? 'bg-purple-100 text-purple-800 dark:bg-purple-500/20 dark:text-purple-200' :
                      adjustment.category === 'Reclassement' ? 'bg-blue-100 text-blue-800 dark:bg-blue-500/20 dark:text-blue-200' :
                      'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200'
                    }`}>
                      {adjustment.category}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-slate-100">{adjustment.description}</p>
                      <p className="text-sm text-gray-600 dark:text-slate-300">{adjustment.justification}</p>
                    </div>
                  </td>
                  <td className={`py-3 px-4 text-right font-mono font-medium ${
                    adjustment.amount > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {adjustment.amount > 0 ? '+' : ''}{adjustment.amount}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getProbabilityColor(adjustment.probability)}`}>
                      {adjustment.probability}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-xs font-mono dark:bg-slate-800 dark:text-slate-200">
                      {adjustment.account}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center space-x-1">
                      {adjustment.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleAdjustment(adjustment.id, 'accept')}
                            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                            title="Accepter"
                          >
                            ✓
                          </button>
                          <button
                            onClick={() => handleAdjustment(adjustment.id, 'reject')}
                            className="px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700 transition-colors"
                            title="Rejeter"
                          >
                            ✗
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => drillDown(adjustment.account, adjustment.id)}
                        className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700 transition-colors"
                        title="Voir détail"
                      >
                        <Eye className="h-3 w-3" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Analysis Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-slate-900 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center dark:text-slate-100">
            <TrendingUp className="h-5 w-5 text-blue-600 mr-2" />
            Synthèse des Ajustements
          </h3>
          <div className="space-y-3">
            {[
              { category: 'Non-récurrents', count: 2, amount: 40 },
              { category: 'Owner benefits', count: 2, amount: 25 },
              { category: 'Reclassements', count: 1, amount: -28 },
              { category: 'Provisions', count: 1, amount: 12 }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0 dark:border-slate-700">
                <span className="text-sm text-gray-700 dark:text-slate-300">{item.category}</span>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-slate-100">{item.count} ajustement(s)</span>
                  <p className={`text-sm font-medium ${item.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {item.amount > 0 ? '+' : ''}{item.amount} K€
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-slate-900 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">Recommandations</h3>
          <div className="space-y-4">
            <div className="p-3 bg-green-50 rounded-lg dark:bg-green-500/10">
              <h4 className="font-medium text-green-900 mb-1 dark:text-green-200">Points Forts</h4>
              <ul className="text-sm text-green-800 space-y-1 dark:text-green-200">
                <li>• EBITDA sous-jacent solide (+28K€ d'ajustements)</li>
                <li>• Peu d'éléments non-récurrents significatifs</li>
                <li>• Provisions prudentielles</li>
              </ul>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg dark:bg-yellow-500/10">
              <h4 className="font-medium text-yellow-900 mb-1 dark:text-yellow-200">Points d'Attention</h4>
              <ul className="text-sm text-yellow-800 space-y-1 dark:text-yellow-200">
                <li>• Surveiller les owner benefits récurrents</li>
                <li>• Documenter les ajustements pour l'audit</li>
                <li>• Validation comptable recommandée</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};