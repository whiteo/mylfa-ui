import api from '@/config/url.json'
import axios from '@/api/config';
import {createAuthHeader} from '@/api/util'

export async function getCurrencies(): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.get(api.currency.url, {headers});
  return response.data;
}

export async function createCurrency(data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.post(api.currency.url,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function updateCurrency(id: string, data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.put(api.currency.url + `/${id}/edit`,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function deleteCurrency(id: string): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.delete(api.currency.url + `/${id}`, {headers});
  return response.data;
}
