import React from 'react';
import { Link } from 'react-router-dom';
import {
  AlertTriangle,
  ArrowRight,
  Download,
  FileText,
  LayoutDashboard,
  TrendingUp,
  Upload,
} from 'lucide-react';

const modules = [
  {
    id: 'dashboard',
    title: 'Tableau de Bord',
    description: 'Suivez les indicateurs clés et les signaux d’alerte en temps réel.',
    icon: LayoutDashboard,
    to: '/dashboard',
  },
  {
    id: 'import',
    title: 'Import FEC',
    description: 'Chargez vos fichiers FEC en toute sécurité et préparez-les pour l’analyse.',
    icon: Upload,
    to: '/import',
  },
  {
    id: 'financials',
    title: 'États Financiers',
    description: 'Analysez bilans, comptes de résultat et flux de trésorerie en quelques clics.',
    icon: FileText,
    to: '/financials',
  },
  {
    id: 'risk',
    title: 'Analyse Risques',
    description: 'Identifiez les zones de vigilance grâce à une notation des risques automatisée.',
    icon: AlertTriangle,
    to: '/risk',
  },
  {
    id: 'qoe',
    title: 'Quality of Earnings',
    description: 'Évaluez la récurrence des performances et la qualité des résultats publiés.',
    icon: TrendingUp,
    to: '/qoe',
  },
  {
    id: 'deliverables',
    title: 'Livrables',
    description: 'Générez vos rapports d’audit personnalisés et partagez-les en un clic.',
    icon: Download,
    to: '/deliverables',
  },
] as const;

export const Home: React.FC = () => {
  return (
    <div className="relative overflow-hidden">
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-950 dark:to-blue-950">
        <div className="max-w-6xl mx-auto px-4 py-24 sm:py-32">
          <div className="max-w-3xl">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-500/20 dark:text-blue-100">
              Pégase Platform
            </span>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl dark:text-white">
              Accélérez vos due diligences financières avec un copilote intelligent
            </h1>
            <p className="mt-6 text-lg text-gray-600 dark:text-slate-300">
              Centralisez vos analyses, automatisez les contrôles et collaborez avec votre équipe sur une plateforme conçue pour les cabinets de conseil et les fonds d’investissement.
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/dashboard"
                className="inline-flex items-center justify-center rounded-md bg-blue-600 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              >
                Accéder au tableau de bord
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Link>
              <Link
                to="/import"
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-6 py-3 text-base font-semibold text-gray-900 transition hover:border-blue-500 hover:text-blue-600 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:text-slate-100 dark:hover:border-blue-500 dark:hover:text-blue-200"
              >
                Importer un FEC
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="relative -mt-12 pb-24 sm:-mt-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {modules.map((module) => {
              const Icon = module.icon;
              return (
                <Link
                  key={module.id}
                  to={module.to}
                  className="group relative flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-800 dark:bg-slate-900/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700 transition group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-500/20 dark:text-blue-100 dark:group-hover:bg-blue-500">
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </span>
                    <ArrowRight className="h-5 w-5 text-gray-400 transition group-hover:text-blue-600 dark:text-slate-500 dark:group-hover:text-blue-300" aria-hidden="true" />
                  </div>
                  <div className="mt-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{module.title}</h2>
                    <p className="mt-3 text-sm text-gray-600 dark:text-slate-300">{module.description}</p>
                  </div>
                  <span className="mt-8 inline-flex items-center text-sm font-semibold text-blue-600 transition group-hover:text-blue-700 dark:text-blue-300 dark:group-hover:text-blue-200">
                    Découvrir le module
                    <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
};
