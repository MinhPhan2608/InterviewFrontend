import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, BarChart3, Trophy, TrendingUp, Users, Award } from 'lucide-react';
import { useStatistics, useTop10GroupA } from '@/hooks';

// Helper to calculate total for Group A
const calculateTotal = (math: number | null, physics: number | null, chemistry: number | null): number | null => {
  if (math === null || physics === null || chemistry === null) return null;
  return math + physics + chemistry;
};

const DashboardPage = () => {
  const { statistics, fetchStatistics } = useStatistics();
  const { students, fetchTop10 } = useTop10GroupA();

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
      title: 'Search Scores',
      description: 'Look up scores by registration number',
      color: 'bg-blue-500',
    },
    {
      to: '/reports',
      icon: BarChart3,
      title: 'View Reports',
      description: 'Statistics and charts for all subjects',
      color: 'bg-green-500',
    },
    {
      to: '/top10',
      icon: Trophy,
      title: 'Top 10 Group A',
      description: 'Best students in Math, Physics, Chemistry',
      color: 'bg-yellow-500',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Welcome to G-Scores Management System</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Entries</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalsBySubject.total.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <Award className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Level 1 (≥8)</p>
              <p className="text-2xl font-bold text-green-600">
                {totalsBySubject.group1.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Level 2 (6-8)</p>
              <p className="text-2xl font-bold text-blue-600">
                {totalsBySubject.group2.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Trophy className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Top Score (Group A)</p>
              <p className="text-2xl font-bold text-purple-600">
                {topScore !== null ? topScore.toFixed(2) : 'N/A'}
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
            className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <link.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">{link.title}</h3>
            <p className="text-gray-500 text-sm">{link.description}</p>
          </Link>
        ))}
      </div>

      {/* Top 3 Preview */}
      {students.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Top 3 Group A Students
            </h2>
            <Link to="/top10" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
              View all →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {students.slice(0, 3).map((student, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const total = calculateTotal(student.math, student.physics, student.chemistry);
              return (
                <div
                  key={student.registrationNumber}
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-4 text-center"
                >
                  <span className="text-3xl">{medals[index]}</span>
                  <p className="font-bold text-gray-900 mt-2">{student.registrationNumber}</p>
                  <p className="text-2xl font-bold text-green-600">{total !== null ? total.toFixed(2) : '-'}</p>
                  <p className="text-sm text-gray-500">Total Score</p>
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
