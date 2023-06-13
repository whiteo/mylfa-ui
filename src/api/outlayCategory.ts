import api from '@/config/url.json'
import axios from '@/api/config';
import {createAuthHeader} from '@/api/util'

export async function getOutlayCategories(): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.get(api.outlayCategory.url, {headers});
  return response.data;
}

export async function createOutlayCategory(data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.post(api.outlayCategory.url,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function updateOutlayCategory(id: string, data: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.put(api.outlayCategory.url + `/${id}/edit`,
    JSON.stringify(data), {headers});
  return response.data;
}

export async function deleteOutlayCategory(id: string): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.delete(api.outlayCategory.url + `/${id}`, {headers});
  return response.data;
}
