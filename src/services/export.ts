export type ProgressCallback = (progress: number) => void;

export interface ExportMetadata {
  companyName?: string;
  analysisDate?: string;
  period?: string;
  currency?: string;
}

export interface ExcelSheetDefinition {
  name: string;
  headers: string[];
  rows: Array<Array<string | number | null | undefined>>;
}

const textEncoder = new TextEncoder();

const ensureMetadataComplete = (metadata: ExportMetadata) => {
  if (!metadata.period) {
    throw new Error('La période d\'analyse est obligatoire pour lancer l\'export.');
  }

  if (!metadata.currency) {
    throw new Error('La devise sélectionnée est obligatoire pour lancer l\'export.');
  }
};

const emitProgress = (callback: ProgressCallback | undefined, value: number) => {
  if (callback) {
    callback(Math.max(0, Math.min(100, Math.round(value))));
  }
};

const ensureFileExtension = (fileName: string, extension: string) => {
  return fileName.endsWith(extension) ? fileName : `${fileName}${extension}`;
};

const downloadBlob = (blob: Blob, fileName: string) => {
  if (typeof window === 'undefined') {
    return;
  }

  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const escapeXml = (value: string) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const columnLabel = (index: number): string => {
  let label = '';
  let currentIndex = index;

  while (currentIndex >= 0) {
    label = String.fromCharCode((currentIndex % 26) + 65) + label;
    currentIndex = Math.floor(currentIndex / 26) - 1;
  }

  return label;
};

const sanitizeSheetName = (name: string, index: number) => {
  const sanitized = name.replace(/[\\/?*[\]:]/g, ' ').trim() || `Feuille ${index + 1}`;
  return sanitized.length > 31 ? sanitized.slice(0, 31) : sanitized;
};

const buildWorksheetXml = (sheet: ExcelSheetDefinition) => {
  const rows = [sheet.headers, ...sheet.rows];
  const rowsXml = rows
    .map((row, rowIndex) => {
      const cells = row
        .map((cell, cellIndex) => {
          const cellRef = `${columnLabel(cellIndex)}${rowIndex + 1}`;

          if (cell === null || cell === undefined || cell === '') {
            return `<c r="${cellRef}"/>`;
          }

          if (typeof cell === 'number' && Number.isFinite(cell)) {
            return `<c r="${cellRef}"><v>${cell}</v></c>`;
          }

          return `<c r="${cellRef}" t="inlineStr"><is><t>${escapeXml(String(cell))}</t></is></c>`;
        })
        .join('');

      return `<row r="${rowIndex + 1}">${cells}</row>`;
    })
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<sheetData>${rowsXml}</sheetData>` +
    `</worksheet>`;
};

const buildWorkbookXml = (sheetNames: string[]) => {
  const sheetsXml = sheetNames
    .map((name, index) => `<sheet name="${escapeXml(name)}" sheetId="${index + 1}" r:id="rId${index + 1}"/>`)
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ` +
    `xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">` +
    `<sheets>${sheetsXml}</sheets>` +
    `</workbook>`;
};

const buildWorkbookRels = (sheetNames: string[]) => {
  const relationships = sheetNames
    .map((_, index) => `<Relationship Id="rId${index + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${index + 1}.xml"/>`)
    .concat('<Relationship Id="rIdStyles" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>')
    .join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">${relationships}</Relationships>`;
};

const buildContentTypes = (sheetCount: number) => {
  const sheetOverrides = Array.from({ length: sheetCount }, (_, index) =>
    `<Override PartName="/xl/worksheets/sheet${index + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`
  ).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">` +
    `<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>` +
    `<Default Extension="xml" ContentType="application/xml"/>` +
    `<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>` +
    `<Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/>` +
    `<Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/>` +
    `<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>` +
    `${sheetOverrides}` +
    `</Types>`;
};

const buildAppXml = (sheetNames: string[]) => {
  const parts = sheetNames.map(name => `<vt:lpstr>${escapeXml(name)}</vt:lpstr>`).join('');

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes">` +
    `<Application>Project Alive</Application>` +
    `<DocSecurity>0</DocSecurity>` +
    `<ScaleCrop>false</ScaleCrop>` +
    `<HeadingPairs><vt:vector size="2" baseType="variant"><vt:variant><vt:lpstr>Feuilles</vt:lpstr></vt:variant><vt:variant><vt:i4>${sheetNames.length}</vt:i4></vt:variant></vt:vector></HeadingPairs>` +
    `<TitlesOfParts><vt:vector size="${sheetNames.length}" baseType="lpstr">${parts}</vt:vector></TitlesOfParts>` +
    `</Properties>`;
};

const buildCoreXml = (metadata: ExportMetadata) => {
  const company = metadata.companyName ? escapeXml(metadata.companyName) : 'Project Alive';
  const createdDate = metadata.analysisDate || new Date().toISOString();

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:dcmitype="http://purl.org/dc/dcmitype/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">` +
    `<dc:creator>${company}</dc:creator>` +
    `<cp:lastModifiedBy>${company}</cp:lastModifiedBy>` +
    `<dcterms:created xsi:type="dcterms:W3CDTF">${createdDate}</dcterms:created>` +
    `<dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified>` +
    `</cp:coreProperties>`;
};

const buildStylesXml = () => {
  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">` +
    `<fonts count="1"><font><sz val="11"/><color theme="1"/><name val="Calibri"/><family val="2"/></font></fonts>` +
    `<fills count="1"><fill><patternFill patternType="none"/></fill></fills>` +
    `<borders count="1"><border><left/><right/><top/><bottom/><diagonal/></border></borders>` +
    `<cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>` +
    `<cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>` +
    `<cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles>` +
    `</styleSheet>`;
};

interface ZipEntry {
  name: string;
  data: Uint8Array;
}

const crc32Table = new Uint32Array(256).map((_, index) => {
  let c = index;
  for (let k = 0; k < 8; k += 1) {
    c = c & 1 ? 0xEDB88320 ^ (c >>> 1) : c >>> 1;
  }
  return c >>> 0;
});

const crc32 = (data: Uint8Array) => {
  let crc = 0 ^ -1;

  for (let i = 0; i < data.length; i += 1) {
    crc = (crc >>> 8) ^ crc32Table[(crc ^ data[i]) & 0xFF];
  }

  return (crc ^ -1) >>> 0;
};

const writeUint16LE = (value: number) => {
  return [value & 0xFF, (value >>> 8) & 0xFF];
};

const writeUint32LE = (value: number) => {
  return [
    value & 0xFF,
    (value >>> 8) & 0xFF,
    (value >>> 16) & 0xFF,
    (value >>> 24) & 0xFF,
  ];
};

const toUint8Array = (content: string) => {
  return textEncoder.encode(content);
};

const buildZip = (entries: ZipEntry[]): Uint8Array => {
  const localParts: number[] = [];
  const centralParts: number[] = [];
  let offset = 0;

  entries.forEach((entry) => {
    const fileName = toUint8Array(entry.name);
    const data = entry.data;
    const crc = crc32(data);
    const size = data.length;

    const localHeader = [
      ...writeUint32LE(0x04034b50),
      ...writeUint16LE(20),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint32LE(crc),
      ...writeUint32LE(size),
      ...writeUint32LE(size),
      ...writeUint16LE(fileName.length),
      ...writeUint16LE(0),
      ...fileName,
    ];

    localParts.push(...localHeader, ...data);

    const centralHeader = [
      ...writeUint32LE(0x02014b50),
      ...writeUint16LE(20),
      ...writeUint16LE(20),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint32LE(crc),
      ...writeUint32LE(size),
      ...writeUint32LE(size),
      ...writeUint16LE(fileName.length),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint16LE(0),
      ...writeUint32LE(0),
      ...writeUint32LE(offset),
      ...fileName,
    ];

    centralParts.push(...centralHeader);
    offset += localHeader.length + data.length;
  });

  const centralDirectoryOffset = localParts.length;
  const centralDirectorySize = centralParts.length;

  const endOfCentralDirectory = [
    ...writeUint32LE(0x06054b50),
    ...writeUint16LE(0),
    ...writeUint16LE(0),
    ...writeUint16LE(entries.length),
    ...writeUint16LE(entries.length),
    ...writeUint32LE(centralDirectorySize),
    ...writeUint32LE(centralDirectoryOffset),
    ...writeUint16LE(0),
  ];

  const totalSize = localParts.length + centralParts.length + endOfCentralDirectory.length;
  const zipBytes = new Uint8Array(totalSize);
  zipBytes.set(localParts, 0);
  zipBytes.set(centralParts, localParts.length);
  zipBytes.set(endOfCentralDirectory, localParts.length + centralParts.length);
  return zipBytes;
};

const buildExcelFile = (sheets: ExcelSheetDefinition[], metadata: ExportMetadata) => {
  const sanitizedSheets = sheets.map((sheet, index) => ({
    ...sheet,
    name: sanitizeSheetName(sheet.name, index),
  }));

  const sheetXmlFiles = sanitizedSheets.map((sheet, index) => ({
    name: `xl/worksheets/sheet${index + 1}.xml`,
    data: toUint8Array(buildWorksheetXml(sheet)),
  }));

  const workbookXml = toUint8Array(buildWorkbookXml(sanitizedSheets.map(sheet => sheet.name)));
  const workbookRels = toUint8Array(buildWorkbookRels(sanitizedSheets.map(sheet => sheet.name)));
  const contentTypes = toUint8Array(buildContentTypes(sanitizedSheets.length));
  const appXml = toUint8Array(buildAppXml(sanitizedSheets.map(sheet => sheet.name)));
  const coreXml = toUint8Array(buildCoreXml(metadata));
  const stylesXml = toUint8Array(buildStylesXml());
  const relsXml = toUint8Array(`<?xml version="1.0" encoding="UTF-8" standalone="yes"?>\n` +
    `<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">` +
    `<Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>` +
    `<Relationship Id="rId2" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/>` +
    `<Relationship Id="rId3" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/>` +
    `</Relationships>`);

  const entries: ZipEntry[] = [
    { name: '[Content_Types].xml', data: contentTypes },
    { name: '_rels/.rels', data: relsXml },
    { name: 'docProps/app.xml', data: appXml },
    { name: 'docProps/core.xml', data: coreXml },
    { name: 'xl/workbook.xml', data: workbookXml },
    { name: 'xl/_rels/workbook.xml.rels', data: workbookRels },
    { name: 'xl/styles.xml', data: stylesXml },
    ...sheetXmlFiles,
  ];

  return buildZip(entries);
};

export interface ExcelExportOptions {
  metadata: ExportMetadata;
  fileName: string;
  sheets: ExcelSheetDefinition[];
  onProgress?: ProgressCallback;
}

export const exportExcelWorkbook = async ({
  metadata,
  fileName,
  sheets,
  onProgress,
}: ExcelExportOptions) => {
  ensureMetadataComplete(metadata);
  emitProgress(onProgress, 5);

  if (!sheets.length) {
    throw new Error('Aucune donnée disponible pour l\'export Excel.');
  }

  const workbookBytes = buildExcelFile(sheets, metadata);
  emitProgress(onProgress, 80);

  const blob = new Blob([workbookBytes], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  downloadBlob(blob, ensureFileExtension(fileName, '.xlsx'));
  emitProgress(onProgress, 100);
};

const escapePdf = (value: string) => {
  return value.replace(/\\/g, '\\\\').replace(/\(/g, '\\(').replace(/\)/g, '\\)');
};

const buildPdfContentStream = (title: string, lines: string[]) => {
  const allLines = [title, ...lines];
  const textLines: string[] = [];
  const lineHeight = 18;

  allLines.forEach((line, index) => {
    if (index === 0) {
      textLines.push(`BT /F1 18 Tf 72 800 Td (${escapePdf(line)}) Tj`);
      textLines.push('/F1 12 Tf');
    } else {
      const verticalShift = index === 1 ? -lineHeight - 6 : -lineHeight;
      textLines.push(`0 ${verticalShift} Td (${escapePdf(line)}) Tj`);
    }
  });

  textLines.push('ET');

  return textLines.join('\n');
};

const buildPdf = (title: string, lines: string[]) => {
  const header = '%PDF-1.4\n';
  const objects: string[] = [];

  objects.push('1 0 obj<</Type/Catalog/Pages 2 0 R>>endobj\n');
  objects.push('2 0 obj<</Type/Pages/Count 1/Kids[3 0 R]>>endobj\n');
  objects.push('5 0 obj<</Type/Font/Subtype/Type1/BaseFont/Helvetica>>endobj\n');
  const content = buildPdfContentStream(title, lines);
  const stream = `4 0 obj<</Length ${content.length}>>stream\n${content}\nendstream\nendobj\n`;
  objects.push('3 0 obj<</Type/Page/Parent 2 0 R/MediaBox[0 0 595 842]/Contents 4 0 R/Resources<</Font<</F1 5 0 R>>>>>>endobj\n');
  objects.push(stream);

  let offset = header.length;
  const offsets = [0];
  const bodyParts: string[] = [];

  objects.forEach((object) => {
    offsets.push(offset);
    bodyParts.push(object);
    offset += object.length;
  });

  const xrefOffset = offset;
  const xrefEntries = offsets
    .map((value) => value.toString().padStart(10, '0'))
    .map((value, index) => `${value} ${index === 0 ? '65535 f ' : '00000 n '}`)
    .join('\n');

  const trailer = `xref\n0 ${offsets.length}\n${xrefEntries}\ntrail` +
    `er\n<</Size ${offsets.length}/Root 1 0 R>>\nstartxref\n${xrefOffset}\n%%EOF`;

  const pdfString = header + bodyParts.join('') + trailer;
  return toUint8Array(pdfString);
};

export interface PdfExportOptions {
  metadata: ExportMetadata;
  fileName: string;
  title: string;
  lines: string[];
  endpoint?: string;
  payload?: unknown;
  onProgress?: ProgressCallback;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const fetchFileFromApi = async (
  endpoint: string,
  payload: unknown,
  onProgress?: ProgressCallback,
): Promise<Blob | null> => {
  if (!API_BASE_URL) {
    return null;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload ?? {}),
  });

  if (!response.ok) {
    throw new Error('La génération du fichier via l\'API a échoué.');
  }

  emitProgress(onProgress, 70);
  return response.blob();
};

export const exportPdfReport = async ({
  metadata,
  fileName,
  title,
  lines,
  endpoint,
  payload,
  onProgress,
}: PdfExportOptions) => {
  ensureMetadataComplete(metadata);
  emitProgress(onProgress, 10);

  let blob: Blob | null = null;

  if (endpoint) {
    try {
      blob = await fetchFileFromApi(endpoint, { metadata, payload }, onProgress);
    } catch (error) {
      console.warn('Falling back to client-side PDF generation:', error);
      blob = null;
    }
  }

  if (!blob) {
    const pdfBytes = buildPdf(title, lines);
    blob = new Blob([pdfBytes], { type: 'application/pdf' });
    emitProgress(onProgress, 85);
  }

  downloadBlob(blob, ensureFileExtension(fileName, '.pdf'));
  emitProgress(onProgress, 100);
};

export interface DashboardKpi {
  title: string;
  value: string;
  change: string;
  detail: string;
}

export interface DashboardSeriesPoint {
  [key: string]: string | number;
}

export interface DashboardExportOptions {
  metadata: ExportMetadata;
  kpis: DashboardKpi[];
  performanceSeries: DashboardSeriesPoint[];
  workingCapitalSeries: DashboardSeriesPoint[];
  onProgress?: ProgressCallback;
}

export const exportDashboardExcel = async ({
  metadata,
  kpis,
  performanceSeries,
  workingCapitalSeries,
  onProgress,
}: DashboardExportOptions) => {
  const sheets: ExcelSheetDefinition[] = [
    {
      name: 'KPIs',
      headers: ['KPI', 'Valeur', 'Variation', 'Détail'],
      rows: kpis.map(kpi => [kpi.title, kpi.value, kpi.change, kpi.detail]),
    },
    {
      name: 'Performance LTM',
      headers: Object.keys(performanceSeries[0] ?? {}),
      rows: performanceSeries.map(point => Object.values(point)),
    },
    {
      name: 'Analyse BFR',
      headers: Object.keys(workingCapitalSeries[0] ?? {}),
      rows: workingCapitalSeries.map(point => Object.values(point)),
    },
  ].filter(sheet => sheet.headers.length > 0);

  await exportExcelWorkbook({
    metadata,
    fileName: `dashboard-${metadata.period?.replace(/\s+/g, '_').toLowerCase()}`,
    sheets,
    onProgress,
  });
};

export interface TransactionReportOptions {
  metadata: ExportMetadata;
  summary: string[];
  alerts: string[];
  onProgress?: ProgressCallback;
}

export const generateTransactionServiceReport = async ({
  metadata,
  summary,
  alerts,
  onProgress,
}: TransactionReportOptions) => {
  const lines = [
    'Synthèse financière :',
    ...summary,
    '',
    'Alertes & risques :',
    ...alerts,
    '',
    `Période : ${metadata.period}`,
    `Devise : ${metadata.currency}`,
  ];

  await exportPdfReport({
    metadata,
    fileName: `rapport-ts-${metadata.period?.replace(/\s+/g, '_').toLowerCase()}`,
    title: metadata.companyName ? `Rapport TS - ${metadata.companyName}` : 'Rapport Transaction Services',
    lines,
    endpoint: '/exports/transaction-service',
    payload: { summary, alerts },
    onProgress,
  });
};

export interface FinancialStatementRow {
  label: string;
  current: number;
  previous: number;
  variance: number;
  accounts: string;
}

export interface FinancialStatementsExportOptions {
  metadata: ExportMetadata;
  statements: Record<string, FinancialStatementRow[]>;
  onProgress?: ProgressCallback;
}

export const exportFinancialStatementsExcel = async ({
  metadata,
  statements,
  onProgress,
}: FinancialStatementsExportOptions) => {
  const sheets: ExcelSheetDefinition[] = Object.entries(statements).map(([name, rows]) => ({
    name,
    headers: ['Rubrique', 'Période courante', 'Période précédente', 'Variation %', 'Comptes'],
    rows: rows.map(row => [
      row.label,
      row.current,
      row.previous,
      row.variance,
      row.accounts,
    ]),
  }));

  await exportExcelWorkbook({
    metadata,
    fileName: `financial-statements-${metadata.period?.replace(/\s+/g, '_').toLowerCase()}`,
    sheets,
    onProgress,
  });
};

export interface QoeAdjustment {
  id: number;
  category: string;
  description: string;
  amount: number;
  probability: number;
  status: string;
  account: string;
  impact: string;
}

export interface QualityOfEarningsExportOptions {
  metadata: ExportMetadata;
  adjustments: QoeAdjustment[];
  totals: {
    baseEbitda: number;
    totalAdjustments: number;
    normalizedEbitda: number;
  };
  onProgress?: ProgressCallback;
}

export const exportQualityOfEarningsExcel = async ({
  metadata,
  adjustments,
  totals,
  onProgress,
}: QualityOfEarningsExportOptions) => {
  const sheets: ExcelSheetDefinition[] = [
    {
      name: 'Synthèse',
      headers: ['Indicateur', 'Valeur (K€)'],
      rows: [
        ['EBITDA Reporté', totals.baseEbitda],
        ['Ajustements validés', totals.totalAdjustments],
        ['EBITDA Normalisé', totals.normalizedEbitda],
      ],
    },
    {
      name: 'Ajustements',
      headers: ['ID', 'Catégorie', 'Description', 'Montant (K€)', 'Probabilité %', 'Statut', 'Compte', 'Impact'],
      rows: adjustments.map(adj => [
        adj.id,
        adj.category,
        adj.description,
        adj.amount,
        adj.probability,
        adj.status,
        adj.account,
        adj.impact,
      ]),
    },
  ];

  await exportExcelWorkbook({
    metadata,
    fileName: `qoe-${metadata.period?.replace(/\s+/g, '_').toLowerCase()}`,
    sheets,
    onProgress,
  });
};

export interface RiskItem {
  id: number;
  category: string;
  type: string;
  title: string;
  description: string;
  impact: string;
  amount: string;
  recommendation: string;
}

export interface RiskReportOptions {
  metadata: ExportMetadata;
  risks: RiskItem[];
  onProgress?: ProgressCallback;
}

export const exportRiskReportPdf = async ({
  metadata,
  risks,
  onProgress,
}: RiskReportOptions) => {
  const lines = risks.flatMap(risk => [
    `${risk.title} (${risk.type}) - ${risk.amount}`,
    `Catégorie : ${risk.category} | Impact : ${risk.impact}`,
    `Description : ${risk.description}`,
    `Recommandation : ${risk.recommendation}`,
    '',
  ]);

  await exportPdfReport({
    metadata,
    fileName: `rapport-risques-${metadata.period?.replace(/\s+/g, '_').toLowerCase()}`,
    title: metadata.companyName ? `Analyse des risques - ${metadata.companyName}` : 'Analyse des risques',
    lines,
    endpoint: '/exports/risk-report',
    payload: { risks },
    onProgress,
  });
};

export interface TemplateDownloadOptions {
  metadata: ExportMetadata;
  onProgress?: ProgressCallback;
}

export const downloadMappingTemplate = async ({
  metadata,
  onProgress,
}: TemplateDownloadOptions) => {
  const sheets: ExcelSheetDefinition[] = [
    {
      name: 'Instructions',
      headers: ['Étape', 'Description'],
      rows: [
        ['1', 'Renseignez le mapping des comptes PCG vers les rubriques analytiques'],
        ['2', 'Spécifiez les comptes de retraitement QoE'],
        ['3', 'Validez la cohérence des comptes auxiliaires'],
      ],
    },
    {
      name: 'Mapping',
      headers: ['Compte', 'Description', 'Rubrique TS', 'Commentaires'],
      rows: [],
    },
  ];

  await exportExcelWorkbook({
    metadata,
    fileName: 'template-mapping',
    sheets,
    onProgress,
  });
};

export interface DeliverableDefinition {
  id: string;
  title: string;
  type: string;
  sections: string[];
}

export interface DeliverableExportOptions {
  metadata: ExportMetadata;
  deliverable: DeliverableDefinition;
  onProgress?: ProgressCallback;
}

export const generateDeliverableFile = async ({
  metadata,
  deliverable,
  onProgress,
}: DeliverableExportOptions) => {
  emitProgress(onProgress, 15);

  if (deliverable.type.includes('XLS')) {
    const sheets: ExcelSheetDefinition[] = deliverable.sections.map((section, index) => ({
      name: `${index + 1}-${section}`,
      headers: ['Section', 'Description'],
      rows: [[section, `Contenu synthétique pour ${section}`]],
    }));

    await exportExcelWorkbook({
      metadata,
      fileName: `${deliverable.id}-${metadata.period?.replace(/\s+/g, '_').toLowerCase()}`,
      sheets,
      onProgress,
    });
    return;
  }

  const lines = deliverable.sections.map(section => `• ${section}`);

  await exportPdfReport({
    metadata,
    fileName: `${deliverable.id}-${metadata.period?.replace(/\s+/g, '_').toLowerCase()}`,
    title: `${deliverable.title} - ${metadata.companyName ?? ''}`.trim(),
    lines,
    endpoint: '/exports/deliverable',
    payload: { deliverable },
    onProgress,
  });
};

export interface DeliverableBundleOptions {
  metadata: ExportMetadata;
  deliverables: DeliverableDefinition[];
  onProgress?: ProgressCallback;
}

export const downloadAllDeliverables = async ({
  metadata,
  deliverables,
  onProgress,
}: DeliverableBundleOptions) => {
  emitProgress(onProgress, 20);

  const lines = deliverables.flatMap(deliverable => [
    deliverable.title,
    ...deliverable.sections.map(section => `  - ${section}`),
    '',
  ]);

  await exportPdfReport({
    metadata,
    fileName: `livrables-${metadata.period?.replace(/\s+/g, '_').toLowerCase()}`,
    title: metadata.companyName ? `Bundle livrables - ${metadata.companyName}` : 'Bundle livrables',
    lines,
    endpoint: '/exports/deliverables/bundle',
    payload: { deliverables },
    onProgress,
  });
};

export const generateShareLink = async ({ metadata }: { metadata: ExportMetadata }) => {
  ensureMetadataComplete(metadata);
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://project-alive.local';
  const timestamp = Date.now().toString(36);
  return `${baseUrl}/share/${encodeURIComponent(metadata.companyName ?? 'project')}/${timestamp}`;
};

export const getDeliverablePreviewMessage = ({
  metadata,
  deliverable,
}: {
  metadata: ExportMetadata;
  deliverable: DeliverableDefinition;
}) => {
  ensureMetadataComplete(metadata);
  return `Prévisualisation de "${deliverable.title}" pour ${metadata.companyName ?? 'la société'} (${metadata.period}).`;
};
