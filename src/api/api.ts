import api from '@/config/url.json'
import demo from '@/config/demo.json'
import axios from '@/api/apiConfig';
import store from '@/store';

export async function getBEVersion(): Promise<string> {
  const response = await axios.get(api.url.version);
  return response.data;
}

export async function logout() {
  const headers = createAuthHeader();
  await axios.get(api.url.logout, {headers});
}

export async function validateToken(): Promise<boolean> {
  const headers = createAuthHeader();
  const response = await axios.get(api.url.authenticate, {headers});
  return response.data;
}

export async function getToken(data: any): Promise<any> {
  const response = await axios.post(api.url.authenticate, JSON.stringify(data));
  return response.data;
}

export async function getDemoToken(): Promise<any> {
  const data = {
    'email': demo.user,
    'password': demo.password,
  }
  const response = await axios.post(api.url.authenticate, JSON.stringify(data));
  return response.data;
}

export async function getAccountData(userId: any): Promise<any> {
  const headers = createAuthHeader();
  const response = await axios.get(api.url.getUserData + `/${userId}`, {headers});
  return response.data;
}

function createAuthHeader() {
  const token = store.state.token;
  return {
    'Authorization': `Bearer ${token}`,
  };
}
