import { useState, useCallback } from 'react';
import { scoreService } from '@/services';
import type { StudentScore, SubjectStatistics } from '@/types';
import { getCached, setCache } from '@/utils/cache';
import { CACHE_TIME, EXAM_CONFIG } from '@/config/constants';

// Search for a student's scores
export const useScoreSearch = () => {
  const [score, setScore] = useState<StudentScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchScore = useCallback(async (regNum: string) => {
    const trimmed = regNum.trim();
    
    // Validation in UI before sending request
    if (!trimmed) {
      setError('Please enter a registration number');
      return;
    }
    if (trimmed.length !== EXAM_CONFIG.REG_NUMBER_LENGTH || !/^\d+$/.test(trimmed)) {
      setError(`Registration number must be exactly ${EXAM_CONFIG.REG_NUMBER_LENGTH} digits`);
      return;
    }

    setIsLoading(true);
    setError(null);
    setScore(null);

    try {
      const result = await scoreService.getScoreByRegNumber(trimmed);
      setScore(result);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err) {
        const axiosError = err as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Failed to fetch score. Please try again.');
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Network error. Please check your connection.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearScore = useCallback(() => {
    setScore(null);
    setError(null);
  }, []);

  return { score, isLoading, error, searchScore, clearScore };
};

// Top performers for Group A (math, physics, chemistry)
// Cached
export const useTop10GroupA = () => {
  const [students, setStudents] = useState<StudentScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const fetchTop10 = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCached<StudentScore[]>('top10', CACHE_TIME.LEADERBOARD);
      if (cached) {
        setStudents(cached);
        return;
      }
    }

    setIsLoading(true);
    setErr(null);

    try {
      const result = await scoreService.getTop10GroupA();
      setStudents(result);
      setCache('top10', result);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Failed to fetch top 10 students.';
      setErr(msg);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { students, isLoading, error: err, fetchTop10 };
};

// Overall statistics - separate from individual searches
// Cache
export const useStatistics = () => {
  const [statistics, setStatistics] = useState<SubjectStatistics[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const fetchStatistics = useCallback(async (force = false) => {
    if (!force) {
      const cached = getCached<SubjectStatistics[]>('stats', CACHE_TIME.STATS);
      if (cached) {
        setStatistics(cached);
        return;
      }
    }

    setIsLoading(true);
    setErrorMsg(null);

    try {
      const result = await scoreService.getStatistics();
      setStatistics(result);
      setCache('stats', result);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('Failed to fetch statistics.');
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { statistics, isLoading, error: errorMsg, fetchStatistics };
};

