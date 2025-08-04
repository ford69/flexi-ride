import { buildApiUrl, API_ENDPOINTS } from '../config/api';

export interface ServiceType {
  _id: string;
  name: string;
  code: string;
  description: string;
  defaultPrice: number;
  pricingType: 'per_day' | 'per_hour' | 'per_trip' | 'per_km';
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

export const serviceTypeService = {
  // Get all active service types
  async getServiceTypes(): Promise<ServiceType[]> {
    const response = await fetch(buildApiUrl('/api/service-types'));
    if (!response.ok) {
      throw new Error('Failed to fetch service types');
    }
    return response.json();
  },

  // Get all service types (admin only)
  async getAllServiceTypes(): Promise<ServiceType[]> {
    const token = localStorage.getItem('token');
    const response = await fetch(buildApiUrl('/api/service-types/all'), {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to fetch service types');
    }
    return response.json();
  },

  // Create new service type (admin only)
  async createServiceType(serviceType: Omit<ServiceType, '_id'>): Promise<ServiceType> {
    const token = localStorage.getItem('token');
    const response = await fetch(buildApiUrl('/api/service-types'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(serviceType)
    });
    if (!response.ok) {
      throw new Error('Failed to create service type');
    }
    return response.json();
  },

  // Update service type (admin only)
  async updateServiceType(id: string, serviceType: Partial<ServiceType>): Promise<ServiceType> {
    const token = localStorage.getItem('token');
    const response = await fetch(buildApiUrl(`/api/service-types/${id}`), {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(serviceType)
    });
    if (!response.ok) {
      throw new Error('Failed to update service type');
    }
    return response.json();
  },

  // Delete service type (admin only)
  async deleteServiceType(id: string): Promise<void> {
    const token = localStorage.getItem('token');
    const response = await fetch(buildApiUrl(`/api/service-types/${id}`), {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete service type');
    }
  }
}; 