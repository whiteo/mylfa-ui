import api from '@/config/url.json'
import axios from '@/api/config';
import {createAuthHeader} from '@/api/util'

export async function getOutlays(): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.get(api.outlay.url, {headers});
  return response.data;
}

export async function createOutlay(data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.post(api.outlay.url,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function updateOutlay(id: string, data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.put(api.outlay.url + `/${id}/edit`,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function deleteOutlay(id: string): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.delete(api.outlay.url + `/${id}`, {headers});
  return response.data;
}
