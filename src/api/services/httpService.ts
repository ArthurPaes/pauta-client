import { API_URL } from '../constants';

class HttpService {
  private async sendRequest(
    path: string,
    method: string,
    data?: Record<string, any>
  ): Promise<any> {
    const headers = {
      'Accept': '*',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
      'Content-Type': 'application/json;charset=UTF-8',
    };

    const config: RequestInit = {
      method,
      headers,
    };

    if (data && (method === 'POST' || method === 'PUT')) {
      config.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(`${API_URL}${path}`, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        if (response.status === 401 && window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        throw new Error(errorData.message || 'HTTP error! status: ' + response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('HTTP Request Error:', error);
      throw error;
    }
  }

  async get(path: string): Promise<any> {
    return this.sendRequest(path, 'GET');
  }

  async post(path: string, data?: Record<string, any>): Promise<any> {
    return this.sendRequest(path, 'POST', data);
  }

  async put(path: string, data?: Record<string, any>): Promise<any> {
    return this.sendRequest(path, 'PUT', data);
  }

  async delete(path: string): Promise<any> {
    return this.sendRequest(path, 'DELETE');
  }
}

export const httpService = new HttpService(); 