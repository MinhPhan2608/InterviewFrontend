import { useState, type FormEvent } from 'react';
import { Search, Loader2, User, BookOpen } from 'lucide-react';
import { useScoreSearch } from '@/hooks';
import { useLanguage } from '@/contexts';

// Helper to format score value
const formatScore = (value: number | null): string => {
  if (value === null || value === undefined) return '-';
  return value.toFixed(2);
};

const SearchScoresPage = () => {
  const [regNumber, setRegNumber] = useState('');
  const { score, isLoading, error, searchScore, clearScore } = useScoreSearch();
  const { t } = useLanguage();

  // Subject name mapping with translations
  const subjectNames: Record<string, string> = {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await searchScore(regNumber);
  };

  const handleClear = () => {
    setRegNumber('');
    clearScore();
  };

  // Get score color based on value
  const getScoreColor = (value: number | null): string => {
    if (value === null) return 'text-[var(--color-text-muted)]';
    if (value >= 8) return 'text-[var(--color-success)]';
    if (value >= 6) return 'text-[var(--color-info)]';
    if (value >= 4) return 'text-[var(--color-warning)]';
    return 'text-[var(--color-error)]';
  };

  // Get score background based on value
  const getScoreBg = (value: number | null): string => {
    if (value === null) return 'bg-[var(--color-bg-tertiary)]';
    if (value >= 8) return 'bg-[var(--color-success)]/10';
    if (value >= 6) return 'bg-[var(--color-info)]/10';
    if (value >= 4) return 'bg-[var(--color-warning)]/10';
    return 'bg-[var(--color-error)]/10';
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('searchScores')}</h1>
        <p className="text-[var(--color-text-secondary)] mt-1">{t('lookupByRegNumber')}</p>
      </div>

      {/* Search Form */}
      <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          {t('userRegistration')}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="regNumber" className="block text-sm font-medium text-[var(--color-text-secondary)] mb-1">
              {t('registrationNumber')}:
            </label>
            <input
              type="text"
              id="regNumber"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder={t('enterRegNumber')}
              className="w-full px-4 py-2 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2 sm:items-end">
            <button
              type="submit"
              disabled={isLoading || !regNumber.trim()}
              className="flex-1 sm:flex-none px-6 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              {t('submit')}
            </button>
            {(score || error) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 border border-[var(--color-border)] text-[var(--color-text-secondary)] rounded-lg hover:bg-[var(--color-bg-tertiary)] transition-colors"
              >
                {t('clear')}
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/20 rounded-xl p-4 text-[var(--color-danger)]">
          {error}
        </div>
      )}

      {/* Score Results */}
      {score && (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-6 border border-[var(--color-border)]">
          <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            {t('detailedScores')}
          </h2>

          {/* Registration Number */}
          <div className="mb-6 p-4 bg-[var(--color-primary)]/10 rounded-lg">
            <p className="text-sm text-[var(--color-primary)]">{t('registrationNumber')}</p>
            <p className="text-2xl font-bold text-[var(--color-text-primary)]">{score.registrationNumber}</p>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subjectNames).map(([key, name]) => {
              const value = score[key as keyof typeof score] as number | null;
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border border-[var(--color-border)] ${getScoreBg(value)}`}
                >
                  <p className="text-sm text-[var(--color-text-secondary)]">{name}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(value)}`}>
                    {formatScore(value)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Foreign Language Code */}
          {score.languageCode && (
            <div className="mt-4 p-4 bg-[var(--color-bg-tertiary)] rounded-lg">
              <p className="text-sm text-[var(--color-text-secondary)]">{t('languageCode')}</p>
              <p className="text-lg font-semibold text-[var(--color-text-primary)]">{score.languageCode}</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!score && !error && !isLoading && (
        <div className="bg-[var(--color-bg-secondary)] rounded-xl shadow-sm p-12 text-center border border-[var(--color-border)]">
          <Search className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">{t('noSearchResults')}</h3>
          <p className="text-[var(--color-text-secondary)]">
            {t('enterRegNumberToView')}
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchScoresPage;
