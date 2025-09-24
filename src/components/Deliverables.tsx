import React, { useMemo, useState } from 'react';
import { Download, FileText, Table, Eye, Send, Calendar } from 'lucide-react';
import { useAppContext } from '../context/useAppContext';
import {
  downloadAllDeliverables,
  generateDeliverableFile,
  generateShareLink,
  getDeliverablePreviewMessage,
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

export const Deliverables: React.FC = () => {
  const [selectedTemplate, setSelectedTemplate] = useState('executive');
  const { appState } = useAppContext();
  const [bundleStatus, setBundleStatus] = useState<ExportStatus>(createExportStatus());
  const [shareState, setShareState] = useState<{ inProgress: boolean; error: string | null; link: string | null }>({
    inProgress: false,
    error: null,
    link: null,
  });
  const [deliverableStatus, setDeliverableStatus] = useState<Record<string, ExportStatus>>({});

  const deliverables = [
    {
      id: 'executive',
      title: 'Executive Summary',
      description: 'Synthèse 1 page pour dirigeants et investisseurs',
      type: 'PDF',
      pages: 1,
      sections: ['KPIs clés', 'EBITDA normalisé', 'Net Debt', 'Top 3 risques'],
      lastGenerated: '15/01/2024 16:30',
      status: 'ready'
    },
    {
      id: 'ts_report',
      title: 'Rapport Transaction Services',
      description: 'Due diligence complète format investment banking',
      type: 'PDF',
      pages: 18,
      sections: [
        'Executive Summary',
        'États financiers retraités', 
        'Quality of Earnings',
        'Net Debt Position',
        'Working Capital Analysis',
        'Risk Assessment',
        'Appendices'
      ],
      lastGenerated: '15/01/2024 16:45',
      status: 'ready'
    },
    {
      id: 'excel_master',
      title: 'Excel TS Master',
      description: 'Modèle Excel avec drill-down et formules protégées',
      type: 'XLSX',
      pages: '12 onglets',
      sections: [
        'Dashboard',
        'P&L Retraité',
        'Bilan Retraité', 
        'Cash-Flow Bridge',
        'QoE Détaillé',
        'Net Debt Build-up',
        'Ratios & KPIs',
        'Sources FEC'
      ],
      lastGenerated: '15/01/2024 16:50',
      status: 'ready'
    },
    {
      id: 'fec_export',
      title: 'Annexes FEC',
      description: 'Exports FEC filtrés par rubrique avec drill-down',
      type: 'CSV + ZIP',
      pages: 'Multiple',
      sections: ['FEC par compte', 'FEC par période', 'FEC par journal', 'Éléments QoE'],
      lastGenerated: '15/01/2024 16:55',
      status: 'ready'
    }
  ];

  const templates = [
    { id: 'executive', name: 'Executive Summary' },
    { id: 'ts_report', name: 'Rapport TS Complet' },
    { id: 'excel_master', name: 'Excel Master' },
    { id: 'fec_export', name: 'Annexes FEC' }
  ];

  const metadata = useMemo(() => ({
    companyName: appState.companyName,
    analysisDate: appState.analysisDate,
    period: appState.currentPeriod,
    currency: appState.currency,
  }), [appState.companyName, appState.analysisDate, appState.currentPeriod, appState.currency]);

  const updateDeliverableStatus = (id: string, updates: Partial<ExportStatus>) => {
    setDeliverableStatus(prev => ({
      ...prev,
      [id]: { ...(prev[id] ?? createExportStatus()), ...updates },
    }));
  };

  const handleGenerateDeliverable = async (id: string) => {
    const deliverable = deliverables.find(d => d.id === id);
    if (!deliverable) {
      return;
    }

    updateDeliverableStatus(id, { inProgress: true, progress: 0, error: null });

    try {
      await generateDeliverableFile({
        metadata,
        deliverable: {
          id: deliverable.id,
          title: deliverable.title,
          type: deliverable.type,
          sections: deliverable.sections,
        },
        onProgress: progress => updateDeliverableStatus(id, { progress }),
      });
      updateDeliverableStatus(id, { inProgress: false });
    } catch (error) {
      updateDeliverableStatus(id, {
        inProgress: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Génération du livrable impossible.',
      });
    }
  };

  const previewDeliverable = async (id: string) => {
    const deliverable = deliverables.find(d => d.id === id);
    if (!deliverable) {
      return;
    }

    try {
      const message = getDeliverablePreviewMessage({
        metadata,
        deliverable: {
          id: deliverable.id,
          title: deliverable.title,
          type: deliverable.type,
          sections: deliverable.sections,
        },
      });
      alert(`${message}\nPrévisualisation disponible dans l'environnement client.`);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Prévisualisation impossible.');
    }
  };

  const shareDeliverable = async (id: string) => {
    updateDeliverableStatus(id, { inProgress: true, progress: 0, error: null });

    try {
      const link = await generateShareLink({ metadata });
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      }
      updateDeliverableStatus(id, { inProgress: false, progress: 100 });
      alert(`Lien de partage généré: ${link}`);
    } catch (error) {
      updateDeliverableStatus(id, {
        inProgress: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Partage impossible.',
      });
    }
  };

  const handleBundleDownload = async () => {
    setBundleStatus({ inProgress: true, progress: 0, error: null });

    try {
      await downloadAllDeliverables({
        metadata,
        deliverables: deliverables.map(item => ({
          id: item.id,
          title: item.title,
          type: item.type,
          sections: item.sections,
        })),
        onProgress: progress => setBundleStatus(prev => ({ ...prev, progress })),
      });
      setBundleStatus(prev => ({ ...prev, inProgress: false }));
    } catch (error) {
      setBundleStatus({
        inProgress: false,
        progress: 0,
        error: error instanceof Error ? error.message : 'Téléchargement impossible.',
      });
    }
  };

  const handleShareAll = async () => {
    setShareState({ inProgress: true, error: null, link: null });

    try {
      const link = await generateShareLink({ metadata });
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(link);
      }
      setShareState({ inProgress: false, error: null, link });
    } catch (error) {
      setShareState({
        inProgress: false,
        error: error instanceof Error ? error.message : 'Partage impossible.',
        link: null,
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Livrables & Exports</h1>
          <p className="text-gray-600">Génération automatique de rapports professionnels</p>
        </div>
        <div className="flex space-x-3">
          <div className="flex flex-col items-end space-y-1">
            <button
              onClick={handleBundleDownload}
              disabled={bundleStatus.inProgress}
              className={`px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 ${
                bundleStatus.inProgress
                  ? 'bg-blue-400 text-white cursor-wait'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Download className="h-4 w-4" />
              <span>{bundleStatus.inProgress ? 'Téléchargement...' : 'Tout Télécharger'}</span>
            </button>
            {bundleStatus.inProgress && (
              <span className="text-xs text-blue-600">Progression {bundleStatus.progress}%</span>
            )}
            {bundleStatus.error && (
              <span className="text-xs text-red-600">{bundleStatus.error}</span>
            )}
          </div>
          <div className="flex flex-col items-end space-y-1">
            <button
              onClick={handleShareAll}
              disabled={shareState.inProgress}
              className={`px-4 py-2 border rounded-lg transition-colors flex items-center space-x-2 ${
                shareState.inProgress
                  ? 'border-blue-300 bg-blue-50 text-blue-600 cursor-wait'
                  : 'border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Send className="h-4 w-4" />
              <span>{shareState.inProgress ? 'Partage...' : 'Partager'}</span>
            </button>
            {shareState.link && !shareState.inProgress && (
              <span className="text-xs text-green-600">Lien copié dans le presse-papiers</span>
            )}
            {shareState.error && (
              <span className="text-xs text-red-600">{shareState.error}</span>
            )}
          </div>
        </div>
      </div>

      {/* Template Selection */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Types de Livrables</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => setSelectedTemplate(template.id)}
              className={`p-4 border-2 rounded-lg text-left transition-colors ${
                selectedTemplate === template.id
                  ? 'border-blue-500 bg-blue-50 text-blue-700'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                {template.id === 'excel_master' ? (
                  <Table className="h-5 w-5" />
                ) : (
                  <FileText className="h-5 w-5" />
                )}
                <span className="font-medium">{template.name}</span>
              </div>
              <p className="text-sm text-gray-600">
                {deliverables.find(d => d.id === template.id)?.description}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Template Details */}
      {selectedTemplate && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* Template Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {deliverables.find(d => d.id === selectedTemplate)?.title}
                </h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => { void previewDeliverable(selectedTemplate); }}
                    className="px-3 py-1 border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors flex items-center space-x-1"
                  >
                    <Eye className="h-3 w-3" />
                    <span>Aperçu</span>
                  </button>
                  <button
                    onClick={() => handleGenerateDeliverable(selectedTemplate)}
                    disabled={deliverableStatus[selectedTemplate]?.inProgress}
                    className={`px-3 py-1 rounded transition-colors flex items-center space-x-1 ${
                      deliverableStatus[selectedTemplate]?.inProgress
                        ? 'bg-blue-400 text-white cursor-wait'
                        : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    <Download className="h-3 w-3" />
                    <span>{deliverableStatus[selectedTemplate]?.inProgress ? 'Génération...' : 'Générer'}</span>
                  </button>
                </div>
                {deliverableStatus[selectedTemplate]?.inProgress && (
                  <span className="text-xs text-blue-600">Progression {deliverableStatus[selectedTemplate]?.progress ?? 0}%</span>
                )}
                {deliverableStatus[selectedTemplate]?.error && (
                  <span className="text-xs text-red-600">{deliverableStatus[selectedTemplate]?.error}</span>
                )}
              </div>

              <div className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Type:</span>
                    <p className="font-medium">{deliverables.find(d => d.id === selectedTemplate)?.type}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Pages:</span>
                    <p className="font-medium">{deliverables.find(d => d.id === selectedTemplate)?.pages}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Statut:</span>
                    <span className="inline-flex px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                      Prêt
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Dernière MAJ:</span>
                    <p className="font-medium text-xs">{deliverables.find(d => d.id === selectedTemplate)?.lastGenerated}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Sections incluses:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {deliverables.find(d => d.id === selectedTemplate)?.sections.map((section, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full" />
                        <span className="text-sm text-gray-700">{section}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Preview */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-4">Aperçu du Contenu</h4>
              
              {selectedTemplate === 'executive' && (
                <div className="space-y-4 text-sm">
                  <div className="p-4 bg-gray-50 rounded">
                    <h5 className="font-medium mb-2">ACME SAS - Executive Summary</h5>
                    <div className="grid grid-cols-2 gap-4">
                      <div>• CA LTM: 18.45 M€ (+7.9%)</div>
                      <div>• EBITDA Normalisé: 2.34 M€ (+23.2%)</div>
                      <div>• Net Debt: 1.25 M€ (0.5x EBITDA)</div>
                      <div>• BFR: 890K€ (4.8% CA)</div>
                    </div>
                  </div>
                </div>
              )}

              {selectedTemplate === 'ts_report' && (
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between border-b pb-2">
                    <span>1. Executive Summary</span><span>Page 1-2</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>2. États Financiers Retraités</span><span>Page 3-8</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>3. Quality of Earnings</span><span>Page 9-12</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>4. Analyse BFR & Net Debt</span><span>Page 13-15</span>
                  </div>
                  <div className="flex justify-between border-b pb-2">
                    <span>5. Risk Assessment</span><span>Page 16-17</span>
                  </div>
                  <div className="flex justify-between">
                    <span>6. Annexes</span><span>Page 18+</span>
                  </div>
                </div>
              )}

              {selectedTemplate === 'excel_master' && (
                <div className="space-y-3 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>📊 Dashboard</div>
                    <div>📈 P&L Retraité</div>
                    <div>🏦 Bilan Retraité</div>
                    <div>💰 Cash-Flow Bridge</div>
                    <div>⚡ QoE Détaillé</div>
                    <div>💳 Net Debt Build-up</div>
                    <div>📊 Ratios & KPIs</div>
                    <div>📋 Sources FEC</div>
                  </div>
                  <p className="text-gray-600 mt-3">
                    Toutes les formules sont protégées. Drill-down disponible sur chaque chiffre.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Customization Panel */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-4">Options de Personnalisation</h4>
              
              <div className="space-y-4">
                {selectedTemplate === 'executive' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Inclure les risques</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Détail QoE</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Version anonymisée</span>
                      <input type="checkbox" className="rounded" />
                    </div>
                  </>
                )}

                {selectedTemplate === 'ts_report' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Annexes détaillées</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Analyse sectorielle</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Niveau de confidentialité</label>
                      <select className="w-full text-sm border rounded px-2 py-1">
                        <option>Standard</option>
                        <option>Confidentiel</option>
                        <option>Très confidentiel</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedTemplate === 'excel_master' && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Formules protégées</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Drill-down activé</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-700">Données sources</span>
                      <input type="checkbox" defaultChecked className="rounded" />
                    </div>
                  </>
                )}

                <div>
                  <label className="block text-sm text-gray-700 mb-1">Format de date</label>
                  <select className="w-full text-sm border rounded px-2 py-1">
                    <option>DD/MM/YYYY</option>
                    <option>MM/DD/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Generation History */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-4 flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                Historique
              </h4>
              
              <div className="space-y-3">
                {[
                  { date: '15/01 16:50', version: 'v1.3', action: 'Généré' },
                  { date: '15/01 14:30', version: 'v1.2', action: 'Modifié' },
                  { date: '14/01 18:45', version: 'v1.1', action: 'Généré' },
                  { date: '14/01 16:20', version: 'v1.0', action: 'Créé' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <div>
                      <span className="font-medium">{item.version}</span>
                      <span className="text-gray-600 ml-2">{item.action}</span>
                    </div>
                    <span className="text-gray-500">{item.date}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h4 className="font-medium text-gray-900 mb-4">Actions Rapides</h4>
              
              <div className="space-y-2">
                <button
                  onClick={() => shareDeliverable(selectedTemplate)}
                  disabled={deliverableStatus[selectedTemplate]?.inProgress}
                  className={`w-full px-3 py-2 text-sm rounded transition-colors flex items-center justify-center space-x-2 ${
                    deliverableStatus[selectedTemplate]?.inProgress
                      ? 'bg-blue-400 text-white cursor-wait'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  <Send className="h-3 w-3" />
                  <span>{deliverableStatus[selectedTemplate]?.inProgress ? 'Traitement...' : 'Partager par email'}</span>
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                  Programmer génération
                </button>
                <button className="w-full px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded hover:bg-gray-50 transition-colors">
                  Créer template custom
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};