import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';

type ControlStatus = 'passed' | 'warning';

interface FileControl {
  name: string;
  status: ControlStatus;
  message: string;
}

type FileProcessingStatus = 'uploaded' | 'processed';

interface ImportedFile {
  name: string;
  size: number;
  type: string;
  status: FileProcessingStatus;
  controls: FileControl[];
  warnings: string[];
}

export const FileImport: React.FC = () => {
  const [files, setFiles] = useState<ImportedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    const newFiles = uploadedFiles.map<ImportedFile>(file => ({
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded',
      controls: [],
      warnings: []
    }));
    setFiles(prev => [...prev, ...newFiles]);
  };

  const processFiles = () => {
    setIsProcessing(true);
    
    // Simulate processing
    setTimeout(() => {
      const processedFiles = files.map(file => ({
        ...file,
        status: 'processed',
        controls: [
          { name: 'Format FEC', status: 'passed', message: 'Format conforme à la réglementation' },
          { name: 'Équilibre comptable', status: 'passed', message: 'Débit = Crédit validé' },
          { name: 'Cohérence dates', status: file.name.includes('FEC') ? 'warning' : 'passed', 
            message: file.name.includes('FEC') ? '12 écritures avec dates suspectes' : 'Chronologie respectée' },
          { name: 'Doublons', status: 'passed', message: 'Aucun doublon détecté' },
          { name: 'Lettrage', status: 'warning', message: '134 comptes clients non lettrés' }
        ],
        warnings: file.name.includes('FEC') ? [
          'Pic d\'écritures en décembre (+35% vs moyenne)',
          'Comptes d\'attente 471000 solde élevé (45K€)',
          'Libellés suspects détectés (3 occurrences)'
        ] : []
      }));
      
      setFiles(processedFiles);
      setIsProcessing(false);
    }, 2000);
  };

  const downloadTemplate = () => {
    // Simulate template download
    alert('Téléchargement du template de mapping PCG...');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-slate-100">Import & Contrôles FEC</h1>
          <p className="text-gray-600 dark:text-slate-300">Importez vos fichiers comptables et configurez les paramètres</p>
        </div>
        <button
          onClick={downloadTemplate}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          <Download className="h-4 w-4" />
          <span>Template Mapping</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8 dark:bg-slate-900 dark:border-slate-700">
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4 dark:text-slate-500" />
          <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-slate-100">
            Glissez vos fichiers ici ou cliquez pour sélectionner
          </h3>
          <p className="text-gray-600 mb-4 dark:text-slate-300">
            FEC (obligatoire), Balances, Grands livres, Auxiliaires
          </p>
          <input
            type="file"
            multiple
            accept=".txt,.csv,.xlsx,.xls"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label
            htmlFor="file-upload"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer inline-block"
          >
            Sélectionner les fichiers
          </label>
        </div>
      </div>

      {/* File List */}
      {files.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-slate-900 dark:border-slate-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Fichiers importés</h3>
            {!isProcessing && files.some(f => f.status === 'uploaded') && (
              <button
                onClick={processFiles}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Lancer les contrôles
              </button>
            )}
            {isProcessing && (
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                <span className="text-blue-600">Traitement en cours...</span>
              </div>
            )}
          </div>

          <div className="space-y-4">
            {files.map((file, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white dark:border-slate-700 dark:bg-slate-900/60">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h4 className="font-medium text-gray-900 dark:text-slate-100">{file.name}</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-300">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'processed' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    <span className={`px-2 py-1 rounded text-sm font-medium ${
                      file.status === 'processed'
                        ? 'bg-green-100 text-green-800 dark:bg-green-500/20 dark:text-green-200'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-500/20 dark:text-yellow-200'
                    }`}>
                      {file.status === 'processed' ? 'Traité' : 'En attente'}
                    </span>
                  </div>
                </div>

                {file.controls && file.controls.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2 dark:text-slate-100">Contrôles automatiques</h5>
                    <div className="space-y-2">
                      {file.controls.map((control, controlIndex) => (
                        <div key={controlIndex} className="flex items-center space-x-2">
                          {control.status === 'passed' ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )}
                          <span className="text-sm font-medium">{control.name}:</span>
                          <span className="text-sm text-gray-600 dark:text-slate-300">{control.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {file.warnings && file.warnings.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg dark:bg-yellow-500/10">
                    <h5 className="font-medium text-yellow-800 mb-2 flex items-center dark:text-yellow-200">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Alertes détectées
                    </h5>
                    <ul className="space-y-1">
                      {file.warnings.map((warning: string, warningIndex: number) => (
                        <li key={warningIndex} className="text-sm text-yellow-700 dark:text-yellow-200">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-slate-900 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">Paramètres de Mapping</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                Période d'analyse (LTM)
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
                <option>Décembre 2024 (12 mois)</option>
                <option>Novembre 2024 (12 mois)</option>
                <option>Octobre 2024 (12 mois)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                Secteur d'activité
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100">
                <option>Services B2B</option>
                <option>BTP</option>
                <option>Restauration</option>
                <option>SaaS</option>
                <option>Commerce</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 dark:text-slate-300">
                Seuil d'anomalie (€)
              </label>
              <input
                type="number"
                defaultValue={1000}
                className="w-full border border-gray-300 rounded-md px-3 py-2 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100"
                placeholder="1000"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 dark:bg-slate-900 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-slate-100">Mapping PCG Personnalisé</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded dark:bg-slate-800">
              <span className="text-sm dark:text-slate-200">70* → Chiffre d'affaires</span>
              <button className="text-blue-600 text-sm hover:underline dark:text-blue-400">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded dark:bg-slate-800">
              <span className="text-sm dark:text-slate-200">60* → Achats consommés</span>
              <button className="text-blue-600 text-sm hover:underline dark:text-blue-400">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded dark:bg-slate-800">
              <span className="text-sm dark:text-slate-200">64* → Charges externes</span>
              <button className="text-blue-600 text-sm hover:underline dark:text-blue-400">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded dark:bg-slate-800">
              <span className="text-sm dark:text-slate-200">63* → Impôts et taxes</span>
              <button className="text-blue-600 text-sm hover:underline dark:text-blue-400">Modifier</button>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800">
            + Ajouter règle de mapping
          </button>
        </div>
      </div>
    </div>
  );
};