export type ControlStatus = 'passed' | 'warning' | 'failed';

export interface FecControlResult {
  name: string;
  status: ControlStatus;
  message: string;
}

export interface FecProcessedFile {
  fileName: string;
  processingId: string;
  controls: FecControlResult[];
  warnings: string[];
}

interface ProcessFecApiResponse {
  files: Array<{
    fileName?: string;
    originalName?: string;
    processingId: string;
    controls?: FecControlResult[];
    warnings?: string[];
  }>;
}

const buildEndpoint = () => {
  const baseUrl = import.meta.env.VITE_API_URL;
  if (!baseUrl) {
    return '/api/fec/process';
  }

  const normalizedBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${normalizedBase}/fec/process`;
};

export async function processFec(files: File[]): Promise<FecProcessedFile[]> {
  if (files.length === 0) {
    return [];
  }

  const formData = new FormData();
  files.forEach(file => {
    formData.append('files', file);
  });

  const response = await fetch(buildEndpoint(), {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorMessage = await response.text().catch(() => undefined);
    throw new Error(errorMessage || 'Le service FEC est indisponible.');
  }

  let payload: ProcessFecApiResponse;
  try {
    payload = await response.json();
  } catch {
    throw new Error("La réponse du service FEC n'est pas valide.");
  }

  if (!payload || !Array.isArray(payload.files)) {
    throw new Error("La réponse du service FEC n'est pas valide.");
  }

  return payload.files.map(result => {
    const fileName = result.fileName ?? result.originalName;

    if (!fileName) {
      throw new Error('La réponse du service FEC est incomplète (nom de fichier manquant).');
    }

    if (!result.processingId) {
      throw new Error('La réponse du service FEC est incomplète (identifiant de traitement manquant).');
    }

    return {
      fileName,
      processingId: result.processingId,
      controls: result.controls ?? [],
      warnings: result.warnings ?? [],
    };
  });
}
