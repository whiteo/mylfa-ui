import api from '@/config/url.json'
import axios from '@/api/config';
import {createAuthHeader} from '@/api/util'

export async function getIncomes(): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.get(api.income.url, {headers});
  return response.data;
}

export async function createIncome(data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.post(api.income.url,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function updateIncome(id: string, data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.put(api.income.url + `/${id}/edit`,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function deleteIncome(id: string): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.delete(api.income.url + `/${id}`, {headers});
  return response.data;
}
