import { useEffect } from 'react';
import { Loader2, Trophy, RefreshCw, Medal } from 'lucide-react';
import { useTop10GroupA } from '@/hooks';
import { useLanguage } from '@/contexts';

// Helper to format score value
const formatScore = (value: number | null): string => {
  if (value === null || value === undefined) return '-';
  return value.toFixed(2);
};

// Calculate total score for Group A
const calculateTotal = (math: number | null, physics: number | null, chemistry: number | null): string => {
  if (math === null || physics === null || chemistry === null) return '-';
  return (math + physics + chemistry).toFixed(2);
};

const Top10GroupAPage = () => {
  const { students, isLoading, error, fetchTop10 } = useTop10GroupA();
  const { t } = useLanguage();

  useEffect(() => {
    fetchTop10();
  }, [fetchTop10]);

  // Get medal color for top 3
  const getMedalStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-[var(--color-accent)] text-white';
      case 2:
        return 'bg-gray-400 text-white';
      case 3:
        return 'bg-orange-400 text-white';
      default:
        return 'bg-[var(--color-primary)]/20 text-[var(--color-primary)]';
    }
  };

  // Get row highlight for top 3
  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-[var(--color-accent)]/10 border-l-4 border-[var(--color-accent)]';
      case 2:
        return 'bg-gray-100 dark:bg-gray-700/30 border-l-4 border-gray-400';
      case 3:
        return 'bg-orange-50 dark:bg-orange-900/10 border-l-4 border-orange-400';
      default:
        return 'bg-[var(--color-bg-secondary)] border-l-4 border-transparent';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-[var(--color-primary)] mx-auto mb-4" />
          <p className="text-[var(--color-text-secondary)]">{t('loadingTopStudents')}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-xl p-6 text-center">
        <p className="text-[var(--color-danger)] mb-4">{error}</p>
        <button
          onClick={fetchTop10}
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
          <h1 className="text-2xl font-bold text-[var(--color-text-primary)] flex items-center gap-2">
            <Trophy className="w-7 h-7 text-[var(--color-accent)]" />
            {t('top10Title')}
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">
            {t('highestCombinedScores')}
          </p>
        </div>
        <button
          onClick={fetchTop10}
          className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          {t('refresh')}
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-[var(--color-primary)] rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-4">{t('groupASubjects')}</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="font-semibold">{t('math')}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="font-semibold">{t('physics')}</p>
          </div>
          <div className="bg-white/10 rounded-lg p-3 text-center">
            <p className="font-semibold">{t('chemistry')}</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm overflow-hidden border border-[var(--color-border)]">
        <div className="p-6 border-b border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] flex items-center gap-2">
            <Medal className="w-5 h-5 text-[var(--color-accent)]" />
            {t('leaderboard')}
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[var(--color-bg-tertiary)]">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {t('rank')}
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {t('registrationNo')}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {t('math')}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {t('physics')}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {t('chemistry')}
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-[var(--color-text-secondary)] uppercase tracking-wider">
                  {t('totalScore')}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border)]">
              {students.map((student, index) => {
                const rank = index + 1;
                const total = calculateTotal(student.math, student.physics, student.chemistry);
                return (
                  <tr key={student.registrationNumber} className={`${getRowStyle(rank)} hover:bg-[var(--color-bg-tertiary)] transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getMedalStyle(rank)}`}
                      >
                        {rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-[var(--color-text-primary)]">
                      {student.registrationNumber}
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--color-text-secondary)] font-medium">
                      {formatScore(student.math)}
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--color-text-secondary)] font-medium">
                      {formatScore(student.physics)}
                    </td>
                    <td className="px-6 py-4 text-center text-[var(--color-text-secondary)] font-medium">
                      {formatScore(student.chemistry)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)] font-bold">
                        {total}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden divide-y divide-[var(--color-border)]">
          {students.map((student, index) => {
            const rank = index + 1;
            const total = calculateTotal(student.math, student.physics, student.chemistry);
            return (
              <div key={student.registrationNumber} className={`p-4 ${getRowStyle(rank)}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center justify-center w-10 h-10 rounded-full font-bold ${getMedalStyle(rank)}`}
                    >
                      {rank}
                    </span>
                    <div>
                      <p className="font-bold text-[var(--color-text-primary)]">{student.registrationNumber}</p>
                      <p className="text-sm text-[var(--color-text-muted)]">{t('registrationNo')}</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-[var(--color-success)]/20 text-[var(--color-success)] font-bold text-lg">
                    {total}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-2">
                    <p className="text-xs text-[var(--color-text-muted)]">{t('math')}</p>
                    <p className="font-semibold text-[var(--color-text-primary)]">{formatScore(student.math)}</p>
                  </div>
                  <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-2">
                    <p className="text-xs text-[var(--color-text-muted)]">{t('physics')}</p>
                    <p className="font-semibold text-[var(--color-text-primary)]">{formatScore(student.physics)}</p>
                  </div>
                  <div className="bg-[var(--color-bg-tertiary)] rounded-lg p-2">
                    <p className="text-xs text-[var(--color-text-muted)]">{t('chemistry')}</p>
                    <p className="font-semibold text-[var(--color-text-primary)]">{formatScore(student.chemistry)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-12 text-center border border-[var(--color-border)]">
          <Trophy className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">{t('noDataAvailable')}</h3>
          <p className="text-[var(--color-text-secondary)]">
            {t('unableToLoadTop10')}
          </p>
        </div>
      )}
    </div>
  );
};

export default Top10GroupAPage;
