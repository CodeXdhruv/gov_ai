import axios, { AxiosError } from 'axios';

// Token storage key
const TOKEN_KEY = 'govai_token';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid - clear it
      localStorage.removeItem(TOKEN_KEY);
      // Optionally redirect to login
      if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ============ AUTH TYPES ============

export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

// ============ AUTH API FUNCTIONS ============

export const registerUser = async (email: string, password: string, name: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/register', { email, password, name });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

export const loginUser = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await api.post<AuthResponse>('/auth/login', { email, password });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response?.data?.detail) {
      throw new Error(error.response.data.detail);
    }
    throw error;
  }
};

export const getCurrentUser = async (token?: string): Promise<User> => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const response = await api.get<User>('/auth/me', config);
  return response.data;
};

// ============ DATA TYPES ============

export interface UploadResponse {
  status: string;
  message: string;
  filename: string;
  rows: number;
  columns: string[];
  preview: Record<string, unknown>[];
}

export interface AnalyzeRequest {
  contamination?: number;
  use_autoencoder?: boolean;
}

export interface AnalyzeResponse {
  status: string;
  analysis_id: string;
  message: string;
  summary: {
    total_consumers: number;
    anomalies_detected: number;
    high_risk_count: number;
    suspicious_count: number;
    review_needed_count: number;
    avg_anomaly_score: number;
    high_risk_zones: string[];
    zone_anomaly_counts: Record<string, number>;
  };
  cleaning_report: Record<string, unknown>;
  consumers_analyzed: number;
  timestamp: string;
}

export interface ResultsResponse {
  analysis_id: string;
  summary: {
    total_consumers: number;
    anomalies_detected: number;
    high_risk_count: number;
    suspicious_count: number;
    review_needed_count: number;
    avg_anomaly_score: number;
    high_risk_zones: string[];
    zone_anomaly_counts: Record<string, number>;
  };
  consumers: {
    consumer_id: string;
    region: string;
    avg_consumption: number;
    anomaly_score: number;
    status: string;
    is_anomaly: boolean;
    consumption_profile?: string;
  }[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    total_pages: number;
  };
}

export interface ConsumerDetail {
  consumer_id: string;
  region: string;
  avg_consumption: number;
  std_consumption: number;
  min_consumption: number;
  max_consumption: number;
  anomaly_score: number;
  status: string;
  is_anomaly: boolean;
  consumption_profile: string;
  ai_explanation: string;
  night_day_ratio: number;
  weekend_weekday_ratio: number;
  timeseries: {
    timestamp: string;
    consumption: number;
    is_anomalous: boolean;
    anomaly_reason: string | null;
  }[];
  anomalous_records: {
    timestamp: string;
    consumption: number;
    is_anomalous: boolean;
    anomaly_reason: string;
  }[];
  anomalous_record_count: number;
  total_records: number;
}

export interface HistoryEntry {
  analysis_id: string;
  timestamp: string;
  filename: string;
  total_consumers: number;
  anomalies_detected: number;
  contamination: number;
  used_autoencoder: boolean;
}

export interface ZoneStats {
  zone: string;
  consumer_count: number;
  avg_anomaly_score: number;
  anomaly_count: number;
  anomaly_rate: number;
}

// ============ DATA API FUNCTIONS ============

/**
 * Upload a CSV file for analysis
 */
export const uploadFile = async (file: File): Promise<UploadResponse> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const response = await api.post<UploadResponse>('/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  
  return response.data;
};

/**
 * Run anomaly detection analysis
 */
export const analyzeData = async (options?: AnalyzeRequest): Promise<AnalyzeResponse> => {
  const response = await api.post<AnalyzeResponse>('/analyze', options || {});
  return response.data;
};

/**
 * Get analysis results with pagination and filtering
 */
export const getResults = async (
  page = 1,
  limit = 50,
  statusFilter?: string,
  regionFilter?: string,
  sortBy = 'anomaly_score',
  sortDesc = true
): Promise<ResultsResponse> => {
  const params = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    sort_by: sortBy,
    sort_desc: sortDesc.toString(),
  });
  
  if (statusFilter) params.append('status_filter', statusFilter);
  if (regionFilter) params.append('region_filter', regionFilter);
  
  const response = await api.get<ResultsResponse>(`/results?${params}`);
  return response.data;
};

/**
 * Get detailed information for a specific consumer
 */
export const getConsumerDetail = async (consumerId: string): Promise<ConsumerDetail> => {
  const response = await api.get<ConsumerDetail>(`/consumer/${consumerId}`);
  return response.data;
};

/**
 * Download analysis report
 */
export const downloadReport = async (format: 'pdf' | 'excel' = 'pdf'): Promise<Blob> => {
  const response = await api.get(`/report?format=${format}`, {
    responseType: 'blob',
  });
  return response.data;
};

/**
 * Get analysis history
 */
export const getHistory = async (): Promise<{ history: HistoryEntry[]; total: number }> => {
  const response = await api.get<{ history: HistoryEntry[]; total: number }>('/history');
  return response.data;
};

/**
 * Get zone statistics
 */
export const getZones = async (): Promise<{ zones: ZoneStats[] }> => {
  const response = await api.get<{ zones: ZoneStats[] }>('/zones');
  return response.data;
};

/**
 * Health check
 */
export const healthCheck = async (): Promise<{ status: string; data_loaded: boolean; analysis_complete: boolean }> => {
  const response = await api.get('/health');
  return response.data;
};

export default api;
