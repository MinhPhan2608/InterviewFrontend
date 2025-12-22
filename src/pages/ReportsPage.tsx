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

// Subject name mapping for display
const subjectDisplayNames: Record<string, string> = {
  maths: 'Toán',
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

// Level descriptions - matching backend: group1 (>=8), group2 (6-8), group3 (4-6), group4 (<4)
const levelDescriptions = [
  { key: 'group1', label: 'Excellent (≥8)', color: '#22c55e', bgColor: 'bg-green-500' },
  { key: 'group2', label: 'Good (6-8)', color: '#3b82f6', bgColor: 'bg-blue-500' },
  { key: 'group3', label: 'Average (4-6)', color: '#eab308', bgColor: 'bg-yellow-500' },
  { key: 'group4', label: 'Poor (<4)', color: '#ef4444', bgColor: 'bg-red-500' },
];

const ReportsPage = () => {
  const { statistics, isLoading, error, fetchStatistics } = useStatistics();

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  // Transform data for charts
  const chartData = statistics?.map((stat) => ({
    subject: subjectDisplayNames[stat.subject] || stat.subject,
    'Excellent (≥8)': stat.group1,
    'Good (6-8)': stat.group2,
    'Average (4-6)': stat.group3,
    'Poor (<4)': stat.group4,
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
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Loading statistics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
        <p className="text-red-700 mb-4">{error}</p>
        <button
          onClick={fetchStatistics}
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
          <h1 className="text-2xl font-bold text-gray-900">Score Reports</h1>
          <p className="text-gray-600 mt-1">Statistics of student scores by level</p>
        </div>
        <button
          onClick={fetchStatistics}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {levelDescriptions.map((level) => (
          <div key={level.key} className="bg-white rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className={`w-3 h-3 rounded-full ${level.bgColor}`} />
              <span className="text-sm font-medium text-gray-600">{level.label}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {totals[level.key as keyof typeof totals].toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mt-1">total entries</p>
          </div>
        ))}
      </div>

      {/* Main Chart */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Score Distribution by Subject
        </h2>

        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis
                dataKey="subject"
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                }}
              />
              <Legend wrapperStyle={{ paddingTop: '20px' }} />
              <Bar dataKey="Excellent (≥8)" fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Good (6-8)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Average (4-6)" fill="#eab308" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Poor (<4)" fill="#ef4444" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Detailed Statistics</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Subject
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-green-600 uppercase tracking-wider">
                  Excellent (≥8)
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-blue-600 uppercase tracking-wider">
                  Good (6-8)
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-yellow-600 uppercase tracking-wider">
                  Average (4-6)
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-red-600 uppercase tracking-wider">
                  Poor (&lt;4)
                </th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {statistics?.map((stat, index) => (
                <tr key={stat.subject} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                    {subjectDisplayNames[stat.subject] || stat.subject}
                  </td>
                  <td className="px-6 py-4 text-center text-green-600 font-medium">
                    {stat.group1.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-blue-600 font-medium">
                    {stat.group2.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-yellow-600 font-medium">
                    {stat.group3.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-red-600 font-medium">
                    {stat.group4.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 font-bold">
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
