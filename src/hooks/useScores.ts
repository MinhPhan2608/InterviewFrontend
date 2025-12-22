import { useState, useCallback } from 'react';
import { scoreService } from '@/services';
import type { StudentScore, SubjectStatistics } from '@/types';

// Hook for searching scores by registration number
export const useScoreSearch = () => {
  const [score, setScore] = useState<StudentScore | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchScore = useCallback(async (regNum: string) => {
    if (!regNum.trim()) {
      setError('Please enter a registration number');
      return;
    }

    setIsLoading(true);
    setError(null);
    setScore(null);

    try {
      const result = await scoreService.getScoreByRegNumber(regNum);
      setScore(result);
    } catch (err: unknown) {
      // Extract message from API response
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

// Hook for getting top 10 Group A students
export const useTop10GroupA = () => {
  const [students, setStudents] = useState<StudentScore[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTop10 = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await scoreService.getTop10GroupA();
      setStudents(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch top 10 students.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { students, isLoading, error, fetchTop10 };
};

// Hook for getting statistics
export const useStatistics = () => {
  const [statistics, setStatistics] = useState<SubjectStatistics[] | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await scoreService.getStatistics();
      setStatistics(result);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch statistics.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { statistics, isLoading, error, fetchStatistics };
};
