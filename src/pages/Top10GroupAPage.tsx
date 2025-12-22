import { useEffect } from 'react';
import { Loader2, Trophy, RefreshCw, Medal } from 'lucide-react';
import { useTop10GroupA } from '@/hooks';

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

  useEffect(() => {
    fetchTop10();
  }, [fetchTop10]);

  // Get medal color for top 3
  const getMedalStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-400 text-yellow-900';
      case 2:
        return 'bg-gray-300 text-gray-700';
      case 3:
        return 'bg-orange-400 text-orange-900';
      default:
        return 'bg-blue-100 text-blue-700';
    }
  };

  // Get row highlight for top 3
  const getRowStyle = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-yellow-50 border-l-4 border-yellow-400';
      case 2:
        return 'bg-gray-50 border-l-4 border-gray-300';
      case 3:
        return 'bg-orange-50 border-l-4 border-orange-400';
      default:
        return 'bg-white border-l-4 border-transparent';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading top students...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchTop10}
          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 mx-auto"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Trophy className="w-7 h-7 text-yellow-500" />
            Top 10 Group A Students
          </h1>
          <p className="text-gray-600 mt-1">
            Highest combined scores in Math, Physics, and Chemistry
          </p>
        </div>
        <button
          onClick={fetchTop10}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-6 text-white">
        <h2 className="text-lg font-semibold mb-2">Group A Subjects</h2>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">🔢</p>
            <p className="text-sm mt-1">Mathematics (Toán)</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">⚛️</p>
            <p className="text-sm mt-1">Physics (Vật Lý)</p>
          </div>
          <div className="bg-white/10 rounded-lg p-4 text-center">
            <p className="text-2xl font-bold">🧪</p>
            <p className="text-sm mt-1">Chemistry (Hóa Học)</p>
          </div>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-orange-50">
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <Medal className="w-5 h-5 text-yellow-600" />
            Leaderboard
          </h2>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Registration No.
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Math
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Physics
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Chemistry
                </th>
                <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total Score
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {students.map((student, index) => {
                const rank = index + 1;
                const total = calculateTotal(student.math, student.physics, student.chemistry);
                return (
                  <tr key={student.registrationNumber} className={`${getRowStyle(rank)} hover:bg-gray-50 transition-colors`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${getMedalStyle(rank)}`}
                      >
                        {rank}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                      {student.registrationNumber}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">
                      {formatScore(student.math)}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">
                      {formatScore(student.physics)}
                    </td>
                    <td className="px-6 py-4 text-center text-gray-700 font-medium">
                      {formatScore(student.chemistry)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-bold">
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
        <div className="md:hidden divide-y divide-gray-100">
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
                      <p className="font-bold text-gray-900">{student.registrationNumber}</p>
                      <p className="text-sm text-gray-500">Registration No.</p>
                    </div>
                  </div>
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 text-green-800 font-bold text-lg">
                    {total}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Math</p>
                    <p className="font-semibold text-gray-900">{formatScore(student.math)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Physics</p>
                    <p className="font-semibold text-gray-900">{formatScore(student.physics)}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-2">
                    <p className="text-xs text-gray-500">Chemistry</p>
                    <p className="font-semibold text-gray-900">{formatScore(student.chemistry)}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Empty State */}
      {students.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Data Available</h3>
          <p className="text-gray-500">
            Unable to load top 10 students data. Please try again later.
          </p>
        </div>
      )}
    </div>
  );
};

export default Top10GroupAPage;
