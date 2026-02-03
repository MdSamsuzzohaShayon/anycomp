import { IServiceOfferingMasterList } from '../types/service-offering-master';
import apiClient from './apiClient';

export class ServiceOfferingMasterApiService {
  static async getAll(): Promise<IServiceOfferingMasterList[]> {
    const response = await apiClient.get('/service-offering-masters');
    return response.data;
  }

  static async getById(id: string): Promise<IServiceOfferingMasterList> {
    const response = await apiClient.get(`/service-offering-masters/${id}`);
    return response.data;
  }

  static async create(data: Omit<IServiceOfferingMasterList, 'id' | 'created_at' | 'updated_at'>): Promise<IServiceOfferingMasterList> {
    const response = await apiClient.post('/service-offering-masters', data);
    return response.data;
  }

  static async update(id: string, data: Partial<Omit<IServiceOfferingMasterList, 'id' | 'created_at' | 'updated_at'>>): Promise<IServiceOfferingMasterList> {
    const response = await apiClient.put(`/service-offering-masters/${id}`, data);
    return response.data;
  }

  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/service-offering-masters/${id}`);
  }
}

