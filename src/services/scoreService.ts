import apiClient from './apiClient';
import type { StudentScore, SubjectStatistics, ApiResponse } from '@/types';
import { EXAM_CONFIG, API_ENDPOINTS } from '@/config/constants';

export const scoreService = {
  getScoreByRegNumber: async (regNum: string): Promise<StudentScore> => {
    if (regNum.length !== EXAM_CONFIG.REG_NUMBER_LENGTH || !/^\d+$/.test(regNum)) {
      throw new Error(`Invalid registration number format. Expected ${EXAM_CONFIG.REG_NUMBER_LENGTH} digits, got: ${regNum}`);
    }

    const response = await apiClient.get<ApiResponse<StudentScore>>(`${API_ENDPOINTS.SCORES}/${regNum}`);
    
    if (!response.data.success) {
      throw new Error(response.data.message || 'Score not found');
    }
    
    return response.data.data;
  },


  getTop10GroupA: async (): Promise<StudentScore[]> => {
    const response = await apiClient.get<ApiResponse<StudentScore[]>>(API_ENDPOINTS.TOP_10);
    
    if (!response.data.success || !response.data.data) {
      throw new Error('Leaderboard is temporarily unavailable');
    }
    
    return response.data.data;
  },

  getStatistics: async (): Promise<SubjectStatistics[]> => {
    const response = await apiClient.get<ApiResponse<SubjectStatistics[]>>(API_ENDPOINTS.STATISTICS);
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Statistics unavailable');
  },
};

export default scoreService;

