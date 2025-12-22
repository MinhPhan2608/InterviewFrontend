import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

type Language = 'vi' | 'en';

// Translation definitions
const translations = {
  en: {
    // Common
    submit: 'Submit',
    cancel: 'Cancel',
    save: 'Save',
    refresh: 'Refresh',
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    logout: 'Logout',
    
    // Navigation
    menu: 'Menu',
    dashboard: 'Dashboard',
    searchScores: 'Search Scores',
    reports: 'Reports',
    top10GroupA: 'Top 10 Group A',
    settings: 'Settings',
    
    // Login
    welcomeBack: 'Welcome Back',
    username: 'Username',
    password: 'Password',
    signIn: 'Sign In',
    signingIn: 'Signing in...',
    enterUsername: 'Enter your username',
    enterPassword: 'Enter your password',
    usernameRequired: 'Username is required',
    passwordRequired: 'Password is required',
    usernameMinLength: 'Username must be at least 3 characters',
    passwordMinLength: 'Password must be at least 6 characters',
    invalidCredentials: 'Invalid username or password. Please try again.',
    demoCredentials: 'Demo Credentials:',
    
    // Dashboard
    welcomeToDashboard: 'G-Scores Scores Management',
    totalEntries: 'Total Entries',
    excellent: 'Excellent (≥8)',
    good: 'Good (6-8)',
    average: 'Average (4-6)',
    poor: 'Poor (<4)',
    topScoreGroupA: 'Top Score (Group A)',
    viewAll: 'View all',
    top3Students: 'Top 3 Group A Students',
    totalScore: 'Total Score',
    
    // Search Scores
    lookupByRegNumber: 'Look up exam scores by registration number',
    userRegistration: 'User Registration',
    registrationNumber: 'Registration Number',
    enterRegNumber: 'Enter registration number',
    clear: 'Clear',
    detailedScores: 'Detailed Scores',
    noSearchResults: 'No Search Results',
    enterRegNumberToView: 'Enter a registration number above to view exam scores',
    noStudentFound: 'No student found with this registration number',
    failedToFetch: 'Failed to fetch score. Please try again.',
    networkError: 'Network error. Please check your connection.',
    
    // Subjects
    math: 'Mathematics',
    literature: 'Literature',
    language: 'Foreign Language',
    physics: 'Physics',
    chemistry: 'Chemistry',
    biology: 'Biology',
    history: 'History',
    geography: 'Geography',
    gdcd: 'Civic Education',
    languageCode: 'Language Code',
    
    // Reports
    scoreReports: 'Score Reports',
    statisticsOfScores: 'Statistics of student scores by level',
    totalEntriesLower: 'total entries',
    scoreDistribution: 'Score Distribution by Subject',
    detailedStatistics: 'Detailed Statistics',
    subject: 'Subject',
    total: 'Total',
    tryAgain: 'Try Again',
    loadingStatistics: 'Loading statistics...',
    
    // Top 10
    top10Title: 'Top 10 Group A Students',
    highestCombinedScores: 'Highest combined scores in Math, Physics, and Chemistry',
    groupASubjects: 'Group A Subjects',
    leaderboard: 'Leaderboard',
    rank: 'Rank',
    registrationNo: 'Registration No.',
    noDataAvailable: 'No Data Available',
    unableToLoadTop10: 'Unable to load top 10 students data. Please try again later.',
    loadingTopStudents: 'Loading top students...',
    
    // Settings
    manageAccount: 'Manage your account and application preferences',
    profile: 'Profile',
    administrator: 'Administrator',
    appearance: 'Appearance',
    themeSettings: 'Theme Settings',
    lightMode: 'Light Mode',
    darkMode: 'Dark Mode',
    languageRegion: 'Language',
    selectLanguage: 'Language',
  },
  vi: {
    // Common
    submit: 'Gửi',
    cancel: 'Hủy',
    save: 'Lưu',
    refresh: 'Làm mới',
    loading: 'Đang tải...',
    error: 'Lỗi',
    success: 'Thành công',
    logout: 'Đăng xuất',
    
    // Navigation
    menu: 'Menu',
    dashboard: 'Tổng quan',
    searchScores: 'Tra cứu điểm',
    reports: 'Báo cáo',
    top10GroupA: 'Top 10 Khối A',
    settings: 'Cài đặt',
    
    // Login
    welcomeBack: 'Chào mừng trở lại',
    username: 'Tên đăng nhập',
    password: 'Mật khẩu',
    signIn: 'Đăng nhập',
    signingIn: 'Đang đăng nhập...',
    enterUsername: 'Nhập tên đăng nhập',
    enterPassword: 'Nhập mật khẩu',
    usernameRequired: 'Vui lòng nhập tên đăng nhập',
    passwordRequired: 'Vui lòng nhập mật khẩu',
    usernameMinLength: 'Tên đăng nhập phải có ít nhất 3 ký tự',
    passwordMinLength: 'Mật khẩu phải có ít nhất 6 ký tự',
    invalidCredentials: 'Tên đăng nhập hoặc mật khẩu không đúng.',
    demoCredentials: 'Tài khoản demo:',
    
    // Dashboard
    welcomeToDashboard: 'Hệ thống quản lý điểm G-Scores',
    totalEntries: 'Tổng số bài thi',
    excellent: 'Giỏi (≥8)',
    good: 'Khá (6-8)',
    average: 'Trung bình (4-6)',
    poor: 'Yếu (<4)',
    topScoreGroupA: 'Điểm cao nhất (Khối A)',
    viewAll: 'Xem tất cả',
    top3Students: 'Top 3 Thí sinh Khối A',
    totalScore: 'Tổng điểm',
    
    // Search Scores
    lookupByRegNumber: 'Tra cứu điểm thi theo số báo danh',
    userRegistration: 'Thông tin thí sinh',
    registrationNumber: 'Số báo danh',
    enterRegNumber: 'Nhập số báo danh',
    clear: 'Xóa',
    detailedScores: 'Chi tiết điểm thi',
    noSearchResults: 'Không có kết quả',
    enterRegNumberToView: 'Nhập số báo danh để xem điểm thi',
    noStudentFound: 'Không tìm thấy thí sinh với số báo danh này',
    failedToFetch: 'Không thể tải điểm. Vui lòng thử lại.',
    networkError: 'Lỗi mạng. Vui lòng kiểm tra kết nối.',
    
    // Subjects
    math: 'Toán',
    literature: 'Ngữ văn',
    language: 'Ngoại ngữ',
    physics: 'Vật lý',
    chemistry: 'Hóa học',
    biology: 'Sinh học',
    history: 'Lịch sử',
    geography: 'Địa lý',
    gdcd: 'GDCD',
    languageCode: 'Mã ngoại ngữ',
    
    // Reports
    scoreReports: 'Báo cáo điểm thi',
    statisticsOfScores: 'Thống kê điểm thi theo mức độ',
    totalEntriesLower: 'bài thi',
    scoreDistribution: 'Phân bố điểm theo môn học',
    detailedStatistics: 'Thống kê chi tiết',
    subject: 'Môn học',
    total: 'Tổng',
    tryAgain: 'Thử lại',
    loadingStatistics: 'Đang tải thống kê...',
    
    // Top 10
    top10Title: 'Top 10 Thí sinh Khối A',
    highestCombinedScores: 'Điểm tổng hợp cao nhất môn Toán, Lý, Hóa',
    groupASubjects: 'Các môn khối A',
    leaderboard: 'Bảng xếp hạng',
    rank: 'Hạng',
    registrationNo: 'Số báo danh',
    noDataAvailable: 'Không có dữ liệu',
    unableToLoadTop10: 'Không thể tải dữ liệu top 10. Vui lòng thử lại sau.',
    loadingTopStudents: 'Đang tải danh sách...',
    
    // Settings
    manageAccount: 'Quản lý tài khoản và tùy chọn ứng dụng',
    profile: 'Hồ sơ',
    administrator: 'Quản trị viên',
    appearance: 'Giao diện',
    themeSettings: 'Cài đặt giao diện',
    lightMode: 'Chế độ sáng',
    darkMode: 'Chế độ tối',
    languageRegion: 'Ngôn ngữ',
    selectLanguage: 'Ngôn ngữ',
  },
};

type TranslationKey = keyof typeof translations.en;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: TranslationKey) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider = ({ children }: LanguageProviderProps) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem('language');
    return (stored as Language) || 'vi';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.setAttribute('lang', language);
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;
