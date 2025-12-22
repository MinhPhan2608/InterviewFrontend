import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart3, Trophy, TrendingUp, Users, Award } from 'lucide-react';
import { useStatistics, useTop10GroupA } from '@/hooks';
import { useLanguage } from '@/contexts';

// Helper to calculate total for Group A
const calculateTotal = (math: number | null, physics: number | null, chemistry: number | null): number | null => {
  if (math === null || physics === null || chemistry === null) return null;
  return math + physics + chemistry;
};

const DashboardPage = () => {
  const { statistics, isLoading: statsLoading, fetchStatistics } = useStatistics();
  const { students, isLoading: studentsLoading, fetchTop10 } = useTop10GroupA();
  const { t } = useLanguage();

  const isLoading = statsLoading || studentsLoading;

  useEffect(() => {
    fetchStatistics();
    fetchTop10();
  }, [fetchStatistics, fetchTop10]);

  // Calculate total students and summary using new field names
  const totalsBySubject = statistics?.reduce(
    (acc, stat) => ({
      total: acc.total + stat.group1 + stat.group2 + stat.group3 + stat.group4,
      group1: acc.group1 + stat.group1,
      group2: acc.group2 + stat.group2,
      group3: acc.group3 + stat.group3,
      group4: acc.group4 + stat.group4,
    }),
    { total: 0, group1: 0, group2: 0, group3: 0, group4: 0 }
  ) || { total: 0, group1: 0, group2: 0, group3: 0, group4: 0 };

  // Get top score from first student
  const topStudent = students[0];
  const topScore = topStudent ? calculateTotal(topStudent.math, topStudent.physics, topStudent.chemistry) : null;

  const quickLinks = [
    {
      to: '/search',
      icon: Search,
      titleKey: 'searchScores' as const,
      descKey: 'lookupByRegNumber' as const,
    },
    {
      to: '/reports',
      icon: BarChart3,
      titleKey: 'reports' as const,
      descKey: 'statisticsOfScores' as const,
    },
    {
      to: '/top10',
      icon: Trophy,
      titleKey: 'top10GroupA' as const,
      descKey: 'highestCombinedScores' as const,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('dashboard')}</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{t('welcomeToDashboard')}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {isLoading ? (
          // Skeleton loading
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-5 border border-[var(--color-border)] animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-[var(--color-bg-tertiary)] rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-[var(--color-bg-tertiary)] rounded w-20 mb-2"></div>
                  <div className="h-8 bg-[var(--color-bg-tertiary)] rounded w-16"></div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <>
            <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-5 border border-[var(--color-border)]">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--color-primary)]/10 rounded-lg">
                  <Users className="w-6 h-6 text-[var(--color-primary)]" />
                </div>
                <div>
                  <p className="text-sm text-[var(--color-text-secondary)]">{t('totalEntries')}</p>
                  <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {totalsBySubject.total.toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-5 border border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-success)]/10 rounded-lg">
              <Award className="w-6 h-6 text-[var(--color-success)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">{t('excellent')}</p>
              <p className="text-2xl font-bold text-[var(--color-success)]">
                {totalsBySubject.group1.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-5 border border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-info)]/10 rounded-lg">
              <TrendingUp className="w-6 h-6 text-[var(--color-info)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">{t('good')}</p>
              <p className="text-2xl font-bold text-[var(--color-info)]">
                {totalsBySubject.group2.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-5 border border-[var(--color-border)]">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--color-accent)]/10 rounded-lg">
              <Trophy className="w-6 h-6 text-[var(--color-accent)]" />
            </div>
            <div>
              <p className="text-sm text-[var(--color-text-secondary)]">{t('topScoreGroupA')}</p>
              <p className="text-2xl font-bold text-[var(--color-accent)]">
                {topScore !== null ? topScore.toFixed(2) : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {quickLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow border border-[var(--color-border)]"
          >
            <div className="w-12 h-12 bg-[var(--color-primary)] rounded-lg flex items-center justify-center mb-4">
              <link.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-1">{t(link.titleKey)}</h3>
            <p className="text-[var(--color-text-secondary)] text-sm">{t(link.descKey)}</p>
          </Link>
        ))}
      </div>

      {/* Top 3 Preview */}
      {isLoading ? (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)] animate-pulse">
          <div className="h-6 bg-[var(--color-bg-tertiary)] rounded w-32 mb-4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="bg-[var(--color-bg-tertiary)] rounded-lg p-4">
                <div className="h-4 bg-[var(--color-border)] rounded w-8 mb-2"></div>
                <div className="h-5 bg-[var(--color-border)] rounded w-24 mb-2"></div>
                <div className="h-8 bg-[var(--color-border)] rounded w-16 mb-1"></div>
                <div className="h-3 bg-[var(--color-border)] rounded w-20"></div>
              </div>
            ))}
          </div>
        </div>
      ) : students.length > 0 && (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[var(--color-accent)]" />
              {t('top3Students')}
            </h2>
            <Link to="/top10" className="text-[var(--color-primary)] hover:underline text-sm font-medium">
              {t('viewAll')}
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.slice(0, 3).map((student, index) => {
              const total = calculateTotal(student.math, student.physics, student.chemistry);
              const rankLabels = ['#1', '#2', '#3'];
              return (
                <div
                  key={student.registrationNumber}
                  className="bg-[var(--color-bg-tertiary)] rounded-lg p-4 border border-[var(--color-border)]"
                >
                  <div className="text-xs font-semibold text-[var(--color-text-secondary)] mb-2">{rankLabels[index]}</div>
                  <p className="font-bold text-[var(--color-text-primary)]">{student.registrationNumber}</p>
                  <p className="text-2xl font-bold text-[var(--color-success)] mt-1">{total !== null ? total.toFixed(2) : '-'}</p>
                  <p className="text-xs text-[var(--color-text-secondary)] mt-1">{t('totalScore')}</p>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
