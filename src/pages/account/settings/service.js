import { request } from 'umi';
export async function queryCurrent() {
  return request('/api/user/me', {
    method: 'GET',
  });
}
export async function queryProvince() {
  return request('/api/geographic/province');
}
export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}
export async function query() {
  return request('/api/users');
}

export async function updateInfo(body) {
  return request('/api/user/me', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}
