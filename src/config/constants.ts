// App config
export const CACHE_TIME = {
  LEADERBOARD: 3 * 60 * 1000, 
  STATS: 5 * 60 * 1000, 
};


export const EXAM_CONFIG = {
  REG_NUMBER_LENGTH: 8,
  MIN_SCORE: 0,
  MAX_SCORE: 10,
  TOP_N: 10,
};

// Group A subjects
export const GROUP_A_SUBJECTS = ['math', 'physics', 'chemistry'] as const;

export const SCORE_LEVELS = {
  EXCELLENT: { min: 8, max: 10 },
  GOOD: { min: 6, max: 8 },
  AVERAGE: { min: 4, max: 6 },
  POOR: { min: 0, max: 4 },
} as const;

// API stuff
export const API_ENDPOINTS = {
  SCORES: '/scores',
  TOP_10: '/scores/top10/groupA',
  STATISTICS: '/statistics/',
  LOGIN: '/auth/login',
  REFRESH: '/auth/refresh',
};
