export interface ApiResponse<T> {
  success: boolean;
  code: number;
  message: string;
  data: T;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
}

export interface User {
  username: string;
}

export interface StudentScore {
  registrationNumber: string;
  math: number | null;
  literature: number | null;
  language: number | null;
  physics: number | null;
  chemistry: number | null;
  biology: number | null;
  history: number | null;
  geography: number | null;
  gdcd: number | null; // civics education
  languageCode: string | null;
}

export interface SubjectStatistics {
  subject: string;
  group1: number; 
  group2: number; 
  group3: number; 
  group4: number; 
}

export interface ApiError {
  message: string;
  statusCode: number;
}

