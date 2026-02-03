import axios, { AxiosError } from 'axios';
import { ISpecialist } from '../types';
import apiClient from './apiClient';



// Specialist API service
export class SpecialistApiService {
  /**
   * Fetch all specialists
   */
  static async getAll(): Promise<ISpecialist[]> {
    const response = await apiClient.get<ISpecialist[]>('/specialists');
    return response.data;
  }

  /**
   * Fetch a single specialist by ID
   */
  static async getById(id: string): Promise<ISpecialist> {
    const response = await apiClient.get<ISpecialist>(`/specialists/${id}`);
    return response.data;
  }

  /**
   * Create a new specialist
   */
  static async create(data: Omit<ISpecialist, 'id' | 'created_at' | 'updated_at'>): Promise<ISpecialist> {
    const response = await apiClient.post<ISpecialist>('/specialists', data);
    return response.data;
  }

  /**
   * Update a specialist
   */
  static async update(id: string, data: Partial<ISpecialist>): Promise<ISpecialist> {
    const response = await apiClient.patch<ISpecialist>(`/specialists/${id}`, data);
    return response.data;
  }

  /**
   * Delete a specialist
   */
  static async delete(id: string): Promise<void> {
    await apiClient.delete(`/specialists/${id}`);
  }
}