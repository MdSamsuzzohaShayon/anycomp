// api/service-offering.api.ts
import { IPlatformFee } from '../types';
import apiClient from './apiClient';

export class PlatformFeeApiService {
  static async getAll(): Promise<IPlatformFee[]> {
    const response = await apiClient.get('/platform-fee');
    return response.data;
  }

  static async getById(id: string): Promise<IPlatformFee> {
    const response = await apiClient.get(`/platform-fee/${id}`);
    return response.data;
  }
  static async create(data: Omit<IPlatformFee, 'id' | 'created_at' | 'updated_at'>): Promise<IPlatformFee> {
    const response = await apiClient.post('/platform-fee', data);
    return response.data;
  }

  static async update(id: string, data: Partial<Omit<IPlatformFee, 'id' | 'created_at' | 'updated_at'>>): Promise<IPlatformFee> {
    const response = await apiClient.put(`/platform-fee/${id}`, data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/platform-fee/${id}`);
  }
}