import api from '@/config/url.json'
import axios from '@/api/config';
import store from '@/store';
import {createAuthHeader, createAuthHeaderWithToken} from "@/api/util";

export async function createUser(data: any): Promise<any> {
  return await axios.post(api.user.url + '/create', JSON.stringify(data));
}

export async function getUser(token: string): Promise<any> {
  const userId = store.state.userId;
  const headers = createAuthHeaderWithToken(token);
  const response = await axios.get(api.user.url + `/${userId}`, {headers});
  return response.data;
}

export async function changeUserPassword(data: any): Promise<any> {
  const userId = store.state.userId;
  const headers = createAuthHeader();
  const response = await axios.put(api.user.url + `/${userId}/edit-password`, JSON.stringify(data), {headers});
  return response.data;
}

export async function changeUserEmail(data: any): Promise<any> {
  const userId = store.state.userId;
  const headers = createAuthHeader();
  const response = await axios.put(api.user.url + `/${userId}/edit`, JSON.stringify(data), {headers});
  return response.data;
}

export async function deleteUser() {
  const userId = store.state.userId;
  const headers = createAuthHeader();
  await axios.delete(api.user.url + `/${userId}`, {headers});
}
