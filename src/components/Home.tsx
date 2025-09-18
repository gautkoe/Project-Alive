import React from 'react';
import type { ViewType } from '../App';
import {
  AlertTriangle,
  ArrowRight,
  Download,
  FileSpreadsheet,
  FileText,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  Upload,
  Workflow,
  Zap
} from 'lucide-react';

interface HomeProps {
  onNavigate: (view: ViewType) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  const highlights = [
    {
      icon: FileSpreadsheet,
      title: 'Contrôles FEC automatisés',
      description: 'Mapping PCG, contrôles d\'intégrité et alertes en quelques minutes.'
    },
    {
      icon: ShieldCheck,
      title: 'Fiable & traçable',
      description: 'Chaque analyse est horodatée, commentée et prête à être auditée.'
    },
    {
      icon: Workflow,
      title: 'Narratif augmenté',
      description: 'Co-pilotage génératif pour accélérer la rédaction de vos livrables.'
    }
  ];

  const modules: Array<{
    view: ViewType;
    title: string;
    description: string;
    icon: React.ComponentType<{ className?: string }>;
    action: string;
  }> = [
    {
      view: 'dashboard',
      title: 'Cockpit de pilotage',
      description: 'Visualisez instantanément la performance, les tendances et les alertes critiques.',
      icon: LayoutDashboard,
      action: 'Aller au tableau de bord'
    },
    {
      view: 'import',
      title: 'Import & contrôles',
      description: 'Déposez votre FEC, laissez Pégase exécuter les contrôles et prioriser les anomalies.',
      icon: Upload,
      action: 'Lancer un import FEC'
    },
    {
      view: 'financials',
      title: 'États financiers intelligents',
      description: 'Analysez bilans et comptes de résultats avec nos visualisations dynamiques.',
      icon: FileText,
      action: 'Explorer les états financiers'
    },
    {
      view: 'risk',
      title: 'Analyse des risques',
      description: 'Identifiez les signaux faibles, suivez leur criticité et affectez-les à vos équipes.',
      icon: AlertTriangle,
      action: 'Analyser les risques'
    },
    {
      view: 'qoe',
      title: 'Quality of Earnings augmenté',
      description: 'Structurez un narratif solide et documenté, propulsé par notre moteur génératif.',
      icon: TrendingUp,
      action: 'Structurer le QoE'
    },
    {
      view: 'deliverables',
      title: 'Livrables instantanés',
      description: 'Exportez en un clic vos rapports TS et packs investisseurs prêts à partager.',
      icon: Download,
      action: 'Préparer les livrables'
    }
  ];

  return (
    <div className="bg-white">
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-50"
          aria-hidden="true"
        />
        <div className="relative max-w-6xl mx-auto px-4 py-20 lg:py-28">
          <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
            <div>
              <span className="inline-flex items-center space-x-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700">
                <Zap className="h-4 w-4" />
                <span>Due diligence augmentée</span>
              </span>
              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
                Accélérez vos analyses Transaction Services avec Pégase
              </h1>
              <p className="mt-6 text-lg leading-relaxed text-gray-700">
                Pégase allie automatisation financière, intelligence des risques et narration générative pour
                offrir aux équipes TS une vision 360° de la cible. Libérez du temps sur l\'analyse, sécurisez vos
                conclusions et livrez plus vite.
              </p>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => onNavigate('dashboard')}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-blue-700"
                >
                  Découvrir le cockpit
                </button>
                <button
                  type="button"
                  onClick={() => onNavigate('import')}
                  className="inline-flex items-center justify-center rounded-lg border border-blue-200 px-6 py-3 text-base font-semibold text-blue-700 transition hover:border-blue-300 hover:bg-blue-50"
                >
                  Importer un FEC maintenant
                </button>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {highlights.map((highlight) => {
                  const Icon = highlight.icon;
                  return (
                    <div key={highlight.title} className="rounded-xl border border-blue-100 bg-white/70 p-4 shadow-sm">
                      <Icon className="h-6 w-6 text-blue-600" />
                      <p className="mt-3 text-sm font-semibold text-gray-900">{highlight.title}</p>
                      <p className="mt-2 text-sm text-gray-600">{highlight.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="relative">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-blue-200/50 blur-3xl" aria-hidden="true" />
              <div className="relative rounded-3xl border border-blue-100 bg-white/80 p-8 shadow-xl backdrop-blur">
                <h2 className="text-lg font-semibold text-gray-900">Ce que disent nos équipes pilotes</h2>
                <p className="mt-4 text-sm leading-relaxed text-gray-600">
                  « Nous passons de la collecte à l\'analyse en quelques heures. Pégase hiérarchise les points de
                  vigilance et suggère les recommandations clés pour la note d\'investissement. »
                </p>
                <div className="mt-6 rounded-2xl bg-blue-50 p-6">
                  <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Workflow type</p>
                  <ol className="mt-4 space-y-3 text-sm text-blue-900">
                    <li className="flex items-start space-x-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-600">
                        1
                      </span>
                      <p>Importez le FEC et laissez Pégase lancer plus de 180 contrôles automatiques.</p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-600">
                        2
                      </span>
                      <p>Explorez les KPIs, tendances et alertes prioritaires dans le cockpit.</p>
                    </li>
                    <li className="flex items-start space-x-3">
                      <span className="mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white text-sm font-semibold text-blue-600">
                        3
                      </span>
                      <p>Générez votre narratif QoE et vos livrables en quelques clics.</p>
                    </li>
                  </ol>
                </div>
                <button
                  type="button"
                  onClick={() => onNavigate('qoe')}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Voir comment Pégase construit un QoE <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold text-gray-900">Choisissez votre prochain module</h2>
          <p className="mt-4 text-base text-gray-600">
            Pégase vous accompagne à chaque étape de la due diligence. Passez à l'action dès maintenant en
            accédant directement au module qui correspond à votre besoin.
          </p>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <div
                key={module.view}
                className="flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:border-blue-300 hover:shadow-md"
              >
                <div className="flex items-center space-x-3">
                  <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Icon className="h-6 w-6" />
                  </span>
                  <h3 className="text-lg font-semibold text-gray-900">{module.title}</h3>
                </div>
                <p className="mt-4 flex-1 text-sm text-gray-600">{module.description}</p>
                <button
                  type="button"
                  onClick={() => onNavigate(module.view)}
                  className="mt-6 inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  {module.action}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
