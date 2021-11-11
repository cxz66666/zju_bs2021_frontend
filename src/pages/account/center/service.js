import { request } from 'umi';
export async function queryCurrent() {
  return request('/api/user/me', {
    method: 'GET',
  });
}
export async function queryFakeList(params) {
  return request('/api/fake_list_Detail', {
    params,
  });
}
