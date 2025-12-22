import apiClient from './apiClient';
import type { StudentScore, SubjectStatistics, ApiResponse } from '@/types';

export const scoreService = {
  // retrieve scores by registration number
  getScoreByRegNumber: async (regNum: string): Promise<StudentScore> => {
    const response = await apiClient.get<ApiResponse<StudentScore>>(`/scores/${regNum}`);
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch score');
    }
    return response.data.data;
  },

  // top 10 students of Group A (math, physics, chemistry)
  getTop10GroupA: async (): Promise<StudentScore[]> => {
    const response = await apiClient.get<ApiResponse<StudentScore[]>>('/scores/top10/groupA');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch top 10');
    }
    return response.data.data;
  },

  // statistics for all subjects by 4 groups
  getStatistics: async (): Promise<SubjectStatistics[]> => {
    const response = await apiClient.get<ApiResponse<SubjectStatistics[]>>('/statistics/');
    if (!response.data.success) {
      throw new Error(response.data.message || 'Failed to fetch statistics');
    }
    return response.data.data;
  },
};

export default scoreService;
