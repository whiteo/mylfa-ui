import api from '@/config/url.json'
import demo from '@/config/demo.json'
import axios from '@/api/config';
import store from '@/store';

export async function getBEVersion(): Promise<string> {
  const response = await axios.get(api.version.url);
  return response.data;
}

export async function logout() {
  const headers = createAuthHeader();
  await axios.get(api.logout.url, {headers});
}

export async function validateToken(token: string): Promise<boolean> {
  const headers = createAuthHeaderWithToken(token);
  const response = await axios.get(api.authenticate.url, {headers});
  return response.data;
}

export async function getToken(data: any): Promise<any> {
  const response = await axios.post(api.authenticate.url, JSON.stringify(data));
  return response.data;
}

export async function getDemoToken(): Promise<any> {
  const data = {
    'email': demo.user,
    'password': demo.password,
  }
  const response = await axios.post(api.authenticate.url, JSON.stringify(data));
  return response.data;
}

export function createAuthHeaderWithToken(token: string) {
  return {
    'Authorization': `Bearer ${token}`,
  };
}

export function createAuthHeader() {
  const token = store.state.token;
  return {
    'Authorization': `Bearer ${token}`,
  };
}
