const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export interface BusinessUpdateData {
  legalName: string;
  cnpj: string;
  appName: string;
  cellphone: string;
  description: string;
  delivery: boolean;
  deliveryTax: number;
  develiveryTime: number;
  openingHours: string;
  idAddress: number;
  logo?: File;
}

export interface BusinessData {
  id: string;
  legalName: string;
  cnpj: string;
  appName: string;
  cellphone: string;
  description: string;
  delivery: boolean;
  deliveryTax: number;
  develiveryTime: number;
  openingHours: string;
  idAddress: number;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export const businessService = {
  async updateBusiness(id: string, data: BusinessUpdateData): Promise<BusinessData> {
    try {
      const formData = new FormData();
      
      // Adicionar todos os campos ao FormData
      formData.append('legalName', data.legalName);
      formData.append('cnpj', data.cnpj);
      formData.append('appName', data.appName);
      formData.append('cellphone', data.cellphone);
      formData.append('description', data.description);
      formData.append('delivery', data.delivery.toString());
      formData.append('deliveryTax', data.deliveryTax.toString());
      formData.append('develiveryTime', data.develiveryTime.toString());
      formData.append('openingHours', data.openingHours);
      formData.append('idAddress', data.idAddress.toString());
      
      // Adicionar arquivo se existir
      if (data.logo) {
        formData.append('logo', data.logo);
      }

      const token = localStorage.getItem('token');
      const url = `${API_BASE_URL}/businesses/${id}`;
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Erro da API:', errorData);
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao atualizar empresa:', error);
      throw error;
    }
  },

  async getBusiness(id: string): Promise<BusinessData> {
    try {
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_BASE_URL}/businesses/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Erro HTTP: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar dados da empresa:', error);
      throw error;
    }
  },
};
