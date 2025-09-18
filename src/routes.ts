export type ViewType =
  | 'dashboard'
  | 'import'
  | 'financials'
  | 'risk'
  | 'qoe'
  | 'deliverables';

export const viewPaths: Record<ViewType, string> = {
  dashboard: '/',
  import: '/import',
  financials: '/financials',
  risk: '/risk',
  qoe: '/qoe',
  deliverables: '/deliverables'
};
