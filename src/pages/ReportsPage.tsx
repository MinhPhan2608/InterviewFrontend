import { useEffect } from 'react';
import { Loader2, BarChart3, RefreshCw } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useStatistics } from '@/hooks';
import { useLanguage } from '@/contexts';

const ReportsPage = () => {
  const { statistics, isLoading, error, fetchStatistics } = useStatistics();
  const { t } = useLanguage();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Subject name mapping for display with translations
  const subjectDisplayNames: Record<string, string> = {
    maths: t('math'),
    math: t('math'),
    literature: t('literature'),
    language: t('language'),
    physics: t('physics'),
    chemistry: t('chemistry'),
    biology: t('biology'),
    history: t('history'),
    geography: t('geography'),
    gdcd: t('gdcd'),
  };

  // Level descriptions
  const levelDescriptions = [
    { key: 'group1', label: t('excellent'), color: 'var(--color-success)', bgClass: 'bg-[var(--color-success)]' },
    { key: 'group2', label: t('good'), color: 'var(--color-info)', bgClass: 'bg-[var(--color-info)]' },
    { key: 'group3', label: t('average'), color: 'var(--color-warning)', bgClass: 'bg-[var(--color-warning)]' },
    { key: 'group4', label: t('poor'), color: 'var(--color-danger)', bgClass: 'bg-[var(--color-danger)]' },
  ];

  // Transform data for charts
  const chartData = statistics?.map((stat) => ({
    subject: subjectDisplayNames[stat.subject] || stat.subject,
    [t('excellent')]: stat.group1,
    [t('good')]: stat.group2,
    [t('average')]: stat.group3,
    [t('poor')]: stat.group4,
  })) || [];

  // Calculate totals for summary cards
  const totals = statistics?.reduce(
    (acc, stat) => ({
      group1: acc.group1 + stat.group1,
      group2: acc.group2 + stat.group2,
      group3: acc.group3 + stat.group3,
      group4: acc.group4 + stat.group4,
    }),
    { group1: 0, group2: 0, group3: 0, group4: 0 }
  ) || { group1: 0, group2: 0, group3: 0, group4: 0 };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">{t('loadingStatistics')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-xl p-6 text-center">
        <p className="text-[var(--color-danger)] mb-4">{error}</p>
        <button
          onClick={fetchStatistics}
          className="px-4 py-2 bg-[var(--color-danger)] text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          {t('tryAgain')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('scoreReports')}</h1>
          <p className="text-[var(--color-text-secondary)] mt-1">{t('statisticsOfScores')}</p>
        </div>
        <button
          onClick={fetchStatistics}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t('refresh')}
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {levelDescriptions.map((level) => (
          <div key={level.key} className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-5 border border-[var(--color-border)]">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${level.bgClass}`} />
              <span className="text-sm font-medium text-[var(--color-text-secondary)]">{level.label}</span>
            </div>
            <p className="text-3xl font-bold text-[var(--color-text-primary)]">
              {totals[level.key as keyof typeof totals].toLocaleString()}
            </p>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">{t('totalEntriesLower')}</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          {t('scoreDistribution')}
        </h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
              <XAxis
                dataKey="subject"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }}
              />
              <YAxis tick={{ fontSize: 12, fill: 'var(--color-text-secondary)' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--color-bg-secondary)',
                  border: '1px solid var(--color-border)',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                  color: 'var(--color-text-primary)',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey={t('excellent')} fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t('good')} fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t('average')} fill="#eab308" radius={[4, 4, 0, 0]} />
              <Bar dataKey={t('poor')} fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm overflow-hidden border border-[var(--color-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{t('detailedStatistics')}</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-tertiary)]">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {t('subject')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-success)] uppercase tracking-wider">
                  {t('excellent')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-info)] uppercase tracking-wider">
                  {t('good')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-warning)] uppercase tracking-wider">
                  {t('average')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-danger)] uppercase tracking-wider">
                  {t('poor')}
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {t('total')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {statistics?.map((stat, index) => (
                <tr key={stat.subject} className={index % 2 === 0 ? 'bg-[var(--color-bg-secondary)]' : 'bg-[var(--color-bg-tertiary)]'}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--color-text-primary)]">
                    {subjectDisplayNames[stat.subject] || stat.subject}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--color-success)] font-medium">
                    {stat.group1.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--color-info)] font-medium">
                    {stat.group2.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--color-warning)] font-medium">
                    {stat.group3.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--color-danger)] font-medium">
                    {stat.group4.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-[var(--color-text-primary)] font-bold">
                    {(stat.group1 + stat.group2 + stat.group3 + stat.group4).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
