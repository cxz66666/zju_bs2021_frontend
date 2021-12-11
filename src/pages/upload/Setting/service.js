import { request } from 'umi';
export async function querySetting() {
  return request('/api/setting/setting', {
    method: 'GET',
  });
}
export async function updateSetting(data) {
  return request('/api/setting/setting', {
    method: 'PUT',
    data: data,
  });
}
