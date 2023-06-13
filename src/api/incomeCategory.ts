import api from '@/config/url.json'
import axios from '@/api/config';
import {createAuthHeader} from '@/api/util'

export async function getIncomeCategories(): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.get(api.incomeCategory.url, {headers});
  return response.data;
}

export async function createIncomeCategory(data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.post(api.incomeCategory.url,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function updateIncomeCategory(id: string, data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.put(api.incomeCategory.url + `/${id}/edit`,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function deleteIncomeCategory(id: string): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.delete(api.incomeCategory.url + `/${id}`, {headers});
  return response.data;
}
