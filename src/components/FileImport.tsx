import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, AlertCircle, Download } from 'lucide-react';
import { processFec, FecControlResult } from '../services/fec';

type FileStatus = 'uploaded' | 'processed' | 'error';

interface ImportedFile {
  file: File;
  name: string;
  size: number;
  type: string;
  status: FileStatus;
  controls: FecControlResult[];
  warnings: string[];
  processingId?: string;
  error?: string;
}

export const FileImport: React.FC = () => {
  const [files, setFiles] = useState<ImportedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    if (uploadedFiles.length === 0) {
      return;
    }

    setErrorMessage(null);

    const newFiles = uploadedFiles.map(file => ({
      file,
      name: file.name,
      size: file.size,
      type: file.type,
      status: 'uploaded',
      controls: [],
      warnings: []
    }));
    setFiles(prevFiles => [...prevFiles, ...newFiles]);

    if (event.target) {
      event.target.value = '';
    }
  };

  const processFiles = async () => {
    const pendingIndices = files.reduce<number[]>((accumulator, file, index) => {
      if (file.status === 'uploaded') {
        accumulator.push(index);
      }
      return accumulator;
    }, []);

    if (pendingIndices.length === 0) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const filesToSend = pendingIndices.map(index => files[index].file);
      const results = await processFec(filesToSend);

      if (results.length !== pendingIndices.length) {
        throw new Error('Le service FEC a retourné un nombre de résultats inattendu.');
      }

      setFiles(prevFiles => {
        const updatedFiles = [...prevFiles];

        pendingIndices.forEach((fileIndex, resultIndex) => {
          const result = results[resultIndex];
          updatedFiles[fileIndex] = {
            ...updatedFiles[fileIndex],
            status: 'processed',
            controls: result.controls,
            warnings: result.warnings,
            processingId: result.processingId,
            error: undefined,
          };
        });

        return updatedFiles;
      });
    } catch (error) {
      console.error('FEC processing failed', error);
      const message =
        error instanceof Error
          ? error.message
          : 'Une erreur est survenue lors du traitement des fichiers.';
      setErrorMessage(message);
      setFiles(prevFiles =>
        prevFiles.map(file =>
          file.status === 'uploaded'
            ? { ...file, status: 'error', error: message, controls: [], warnings: [] }
            : file
        )
      );
    } finally {
      setIsProcessing(false);
    }
  };

  const downloadTemplate = () => {
    // Simulate template download
    alert('Téléchargement du template de mapping PCG...');
  };

  const statusLabels: Record<FileStatus, string> = {
    processed: 'Traité',
    uploaded: 'En attente',
    error: 'Erreur',
  };

  const statusClasses: Record<FileStatus, string> = {
    processed: 'bg-green-100 text-green-800',
    uploaded: 'bg-yellow-100 text-yellow-800',
    error: 'bg-red-100 text-red-800',
  };

  const hasPendingFiles = files.some(file => file.status === 'uploaded');

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {errorMessage && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          {errorMessage}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Import & Contrôles FEC</h1>
          <p className="text-gray-600">Importez vos fichiers comptables et configurez les paramètres</p>
        </div>
        <button 
          onClick={downloadTemplate}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center space-x-2"
        >
          <Download className="h-4 w-4" />
          <span>Template Mapping</span>
        </button>
      </div>

      {/* Upload Zone */}
      <div className="bg-white rounded-lg border-2 border-dashed border-gray-300 p-8">
        <div className="text-center">
          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Glissez vos fichiers ici ou cliquez pour sélectionner
          </h3>
          <p className="text-gray-600 mb-4">
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
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Fichiers importés</h3>
            {!isProcessing && hasPendingFiles && (
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
              <div key={index} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <FileText className="h-5 w-5 text-blue-600" />
                    <div>
                      <h4 className="font-medium text-gray-900">{file.name}</h4>
                      <p className="text-sm text-gray-600">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {file.status === 'processed' && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                    {file.status === 'error' && (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span
                      className={`px-2 py-1 rounded text-sm font-medium ${statusClasses[file.status]}`}
                    >
                      {statusLabels[file.status]}
                    </span>
                  </div>
                </div>

                {file.controls && file.controls.length > 0 && (
                  <div className="mt-4">
                    <h5 className="font-medium text-gray-900 mb-2">Contrôles automatiques</h5>
                    <div className="space-y-2">
                      {file.controls.map((control, controlIndex) => (
                        <div key={controlIndex} className="flex items-center space-x-2">
                          {control.status === 'passed' && (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          )}
                          {control.status === 'warning' && (
                            <AlertCircle className="h-4 w-4 text-yellow-600" />
                          )}
                          {control.status === 'failed' && (
                            <AlertCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm font-medium">{control.name}:</span>
                          <span className="text-sm text-gray-600">{control.message}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {file.warnings && file.warnings.length > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <h5 className="font-medium text-yellow-800 mb-2 flex items-center">
                      <AlertCircle className="h-4 w-4 mr-1" />
                      Alertes détectées
                    </h5>
                    <ul className="space-y-1">
                      {file.warnings.map((warning, warningIndex) => (
                        <li key={warningIndex} className="text-sm text-yellow-700">
                          • {warning}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {file.status === 'error' && file.error && (
                  <p className="mt-4 text-sm text-red-600">{file.error}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Configuration Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Paramètres de Mapping</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Période d'analyse (LTM)
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Décembre 2024 (12 mois)</option>
                <option>Novembre 2024 (12 mois)</option>
                <option>Octobre 2024 (12 mois)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secteur d'activité
              </label>
              <select className="w-full border border-gray-300 rounded-md px-3 py-2">
                <option>Services B2B</option>
                <option>BTP</option>
                <option>Restauration</option>
                <option>SaaS</option>
                <option>Commerce</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Seuil d'anomalie (€)
              </label>
              <input 
                type="number" 
                defaultValue={1000}
                className="w-full border border-gray-300 rounded-md px-3 py-2"
                placeholder="1000"
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapping PCG Personnalisé</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">70* → Chiffre d'affaires</span>
              <button className="text-blue-600 text-sm hover:underline">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">60* → Achats consommés</span>
              <button className="text-blue-600 text-sm hover:underline">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">64* → Charges externes</span>
              <button className="text-blue-600 text-sm hover:underline">Modifier</button>
            </div>
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span className="text-sm">63* → Impôts et taxes</span>
              <button className="text-blue-600 text-sm hover:underline">Modifier</button>
            </div>
          </div>
          <button className="w-full mt-4 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
            + Ajouter règle de mapping
          </button>
        </div>
      </div>
    </div>
  );
};