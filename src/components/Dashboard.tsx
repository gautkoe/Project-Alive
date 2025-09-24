import React, { useState } from 'react';
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
import { useAppContext } from '../context/useAppContext';
import {
  exportDashboardExcel,
  generateTransactionServiceReport,
} from '../services/export';

interface ExportStatus {
  inProgress: boolean;
  progress: number;
  error: string | null;
}

const createExportStatus = (): ExportStatus => ({
  inProgress: false,
  progress: 0,
  error: null,
});

export const Dashboard: React.FC = () => {
  const { appState } = useAppContext();
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

  const performanceSeries = [
    { mois: 'Jan', ebitda: 1890, ca: 16200 },
    { mois: 'Fév', ebitda: 1920, ca: 16450 },
    { mois: 'Mar', ebitda: 2100, ca: 17100 },
    { mois: 'Avr', ebitda: 2180, ca: 17600 },
    { mois: 'Mai', ebitda: 2220, ca: 17850 },
    { mois: 'Jun', ebitda: 2340, ca: 18450 },
  ];

  const workingCapitalSeries = [
    { composante: 'Clients', valeur: 1240, objectif: 1100 },
    { composante: 'Stocks', valeur: 890, objectif: 820 },
    { composante: 'Fournisseurs', valeur: -1240, objectif: -1180 },
  ];

  const [exportState, setExportState] = useState({
    report: createExportStatus(),
    excel: createExportStatus(),
  });

  const metadata = {
    companyName: appState.companyName,
    analysisDate: appState.analysisDate,
    period: appState.currentPeriod,
    currency: appState.currency,
  };

  const updateExportState = (key: 'report' | 'excel', updates: Partial<ExportStatus>) => {
    setExportState(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates },
    }));
  };

  const handleDashboardExcel = async () => {
    updateExportState('excel', { inProgress: true, progress: 0, error: null });

    try {
      await exportDashboardExcel({
        metadata,
        kpis,
        performanceSeries,
        workingCapitalSeries,
        onProgress: progress => updateExportState('excel', { progress }),
      });
      updateExportState('excel', { inProgress: false });
    } catch (error) {
      updateExportState('excel', {
        inProgress: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue.',
      });
    }
  };

  const handleTransactionReport = async () => {
    updateExportState('report', { inProgress: true, progress: 0, error: null });

    try {
      const summary = kpis.map(kpi => `${kpi.title}: ${kpi.value} (${kpi.change})`);
      const alertSummaries = alerts.map(alert => `${alert.title} - ${alert.message}`);

      await generateTransactionServiceReport({
        metadata,
        summary,
        alerts: alertSummaries,
        onProgress: progress => updateExportState('report', { progress }),
      });

      updateExportState('report', { inProgress: false });
    } catch (error) {
      updateExportState('report', {
        inProgress: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Une erreur inconnue est survenue.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="text-gray-600">Synthèse de la due diligence - Société ACME SAS</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex flex-col items-end space-y-1">
            <button
              onClick={handleTransactionReport}
              disabled={exportState.report.inProgress}
              className={`px-4 py-2 rounded-lg transition-colors text-white ${
                exportState.report.inProgress
                  ? 'bg-blue-400 cursor-wait'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {exportState.report.inProgress ? 'Génération...' : 'Générer Rapport TS'}
            </button>
            {exportState.report.inProgress && (
              <span className="text-xs text-blue-600">Progression {exportState.report.progress}%</span>
            )}
            {exportState.report.error && (
              <span className="text-xs text-red-600">{exportState.report.error}</span>
            )}
          </div>
          <div className="flex flex-col items-end space-y-1">
            <button
              onClick={handleDashboardExcel}
              disabled={exportState.excel.inProgress}
              className={`px-4 py-2 rounded-lg transition-colors border ${
                exportState.excel.inProgress
                  ? 'border-blue-300 bg-blue-50 text-blue-600 cursor-wait'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {exportState.excel.inProgress ? 'Export en cours...' : 'Export Excel'}
            </button>
            {exportState.excel.inProgress && (
              <span className="text-xs text-blue-600">Progression {exportState.excel.progress}%</span>
            )}
            {exportState.excel.error && (
              <span className="text-xs text-red-600">{exportState.excel.error}</span>
            )}
          </div>
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
            data={performanceSeries.map(point => ({
              month: point.mois,
              ebitda: point.ebitda,
              ca: point.ca,
            }))}
          />

          <ChartCard
            title="Analyse BFR par Composante"
            type="bar"
            data={workingCapitalSeries.map(item => ({
              category: item.composante,
              value: item.valeur,
              target: item.objectif,
            }))}
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