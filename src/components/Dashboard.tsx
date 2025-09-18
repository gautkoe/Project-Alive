import React from 'react';
import { KpiCard } from './KpiCard';
import { ChartCard } from './ChartCard';
import { AlertCard } from './AlertCard';
import { 
  TrendingUp, 
  DollarSign, 
  Target, 
  AlertCircle,
  Calendar,
  FileText,
  CheckCircle
} from 'lucide-react';

export const Dashboard: React.FC = () => {
  const kpis = [
    {
      title: 'EBITDA Normalisé',
      value: '2 340 K€',
      change: '+12.5%',
      trend: 'up' as const,
      icon: TrendingUp,
      detail: 'LTM Décembre 2024'
    },
    {
      title: 'Chiffre d\'Affaires',
      value: '18 450 K€',
      change: '+8.3%',
      trend: 'up' as const,
      icon: DollarSign,
      detail: 'LTM Décembre 2024'
    },
    {
      title: 'Net Debt',
      value: '1 250 K€',
      change: '-15.2%',
      trend: 'down' as const,
      icon: Target,
      detail: 'Position au 31/12/24'
    },
    {
      title: 'BFR',
      value: '890 K€',
      change: '+3.1%',
      trend: 'up' as const,
      icon: AlertCircle,
      detail: '4.8% du CA (48 jours)'
    }
  ];

  const alerts = [
    {
      type: 'warning' as const,
      title: 'Concentration client',
      message: 'Top 3 clients représentent 45% du CA',
      priority: 'high' as const
    },
    {
      type: 'error' as const,
      title: 'Cut-off revenus',
      message: 'Pic inhabituel de facturation en décembre (+35%)',
      priority: 'critical' as const
    },
    {
      type: 'info' as const,
      title: 'Saisonnalité BFR',
      message: 'BFR supérieur de 12% au normatif saisonnier',
      priority: 'medium' as const
    }
  ];

  const recentActivities = [
    { action: 'Import FEC réalisé', date: '2024-01-15 14:30', status: 'completed' },
    { action: 'Contrôles automatiques validés', date: '2024-01-15 14:32', status: 'completed' },
    { action: 'Mapping PCG configuré', date: '2024-01-15 14:45', status: 'completed' },
    { action: 'QoE en cours de validation', date: '2024-01-15 15:12', status: 'pending' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600">Synthèse de la due diligence - Société ACME SAS</p>
        </div>
        <div className="flex space-x-3">
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            Générer Rapport TS
          </button>
          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            Export Excel
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpis.map((kpi, index) => (
          <KpiCard key={index} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 space-y-6">
          <ChartCard 
            title="Évolution EBITDA & CA (LTM)"
            type="line"
            data={[
              { month: 'Jan', ebitda: 1890, ca: 16200 },
              { month: 'Fév', ebitda: 1920, ca: 16450 },
              { month: 'Mar', ebitda: 2100, ca: 17100 },
              { month: 'Avr', ebitda: 2180, ca: 17600 },
              { month: 'Mai', ebitda: 2220, ca: 17850 },
              { month: 'Jun', ebitda: 2340, ca: 18450 }
            ]}
          />
          
          <ChartCard 
            title="Analyse BFR par Composante"
            type="bar"
            data={[
              { category: 'Clients', value: 1240, target: 1100 },
              { category: 'Stocks', value: 890, target: 820 },
              { category: 'Fournisseurs', value: -1240, target: -1180 }
            ]}
          />
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Alerts */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              Alertes & Risques
            </h3>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <AlertCard key={index} {...alert} />
              ))}
            </div>
          </div>

          {/* Recent Activities */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="h-5 w-5 text-blue-500 mr-2" />
              Activité Récente
            </h3>
            <div className="space-y-3">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  {activity.status === 'completed' ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <FileText className="h-4 w-4 text-yellow-500" />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};