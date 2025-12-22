import { useState, type FormEvent } from 'react';
import { Search, Loader2, User, BookOpen } from 'lucide-react';
import { useScoreSearch } from '@/hooks';

// Subject name mapping
const subjectNames: Record<string, string> = {
  math: 'Toán',
  literature: 'Ngữ Văn',
  language: 'Ngoại Ngữ',
  physics: 'Vật Lý',
  chemistry: 'Hóa Học',
  biology: 'Sinh Học',
  history: 'Lịch Sử',
  geography: 'Địa Lý',
  gdcd: 'GDCD',
};

// Helper to format score value
const formatScore = (value: number | null): string => {
  if (value === null || value === undefined) return '-';
  return value.toFixed(2);
};

const SearchScoresPage = () => {
  const [regNumber, setRegNumber] = useState('');
  const { score, isLoading, error, searchScore, clearScore } = useScoreSearch();

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
    if (value === null) return 'text-gray-400';
    if (value >= 8) return 'text-green-600';
    if (value >= 6) return 'text-blue-600';
    if (value >= 4) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Get score background based on value
  const getScoreBg = (value: number | null): string => {
    if (value === null) return 'bg-gray-50';
    if (value >= 8) return 'bg-green-50';
    if (value >= 6) return 'bg-blue-50';
    if (value >= 4) return 'bg-yellow-50';
    return 'bg-red-50';
  };

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Search Scores</h1>
        <p className="text-gray-600 mt-1">Look up exam scores by registration number</p>
      </div>

      {/* Search Form */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <User className="w-5 h-5" />
          User Registration
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <label htmlFor="regNumber" className="block text-sm font-medium text-gray-700 mb-1">
              Registration Number:
            </label>
            <input
              type="text"
              id="regNumber"
              value={regNumber}
              onChange={(e) => setRegNumber(e.target.value)}
              placeholder="Enter registration number"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-2 sm:items-end">
            <button
              type="submit"
              disabled={isLoading || !regNumber.trim()}
              className="flex-1 sm:flex-none px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
              Submit
            </button>
            {(score || error) && (
              <button
                type="button"
                onClick={handleClear}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700">
          {error}
        </div>
      )}

      {/* Score Results */}
      {score && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Detailed Scores
          </h2>

          {/* Registration Number */}
          <div className="mb-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-600">Registration Number</p>
            <p className="text-2xl font-bold text-blue-900">{score.registrationNumber}</p>
          </div>

          {/* Scores Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(subjectNames).map(([key, name]) => {
              const value = score[key as keyof typeof score] as number | null;
              return (
                <div
                  key={key}
                  className={`p-4 rounded-lg border ${getScoreBg(value)}`}
                >
                  <p className="text-sm text-gray-600">{name}</p>
                  <p className={`text-2xl font-bold ${getScoreColor(value)}`}>
                    {formatScore(value)}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Foreign Language Code */}
          {score.languageCode && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">Mã Ngoại Ngữ</p>
              <p className="text-lg font-semibold text-gray-900">{score.languageCode}</p>
            </div>
          )}
        </div>
      )}

      {/* Empty State */}
      {!score && !error && !isLoading && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Search Results</h3>
          <p className="text-gray-500">
            Enter a registration number above to view exam scores
          </p>
        </div>
      )}
    </div>
  );
};

export default SearchScoresPage;
