// api/service-offering.api.ts
import { IServiceOffering } from '../types';
import apiClient from './apiClient';

export class ServiceOfferingApiService {
  static async getAll(): Promise<IServiceOffering[]> {
    const response = await apiClient.get('/service-offerings');
    return response.data;
  }

  static async getById(id: string): Promise<IServiceOffering> {
    const response = await apiClient.get(`/service-offerings/${id}`);
    return response.data;
  }
}