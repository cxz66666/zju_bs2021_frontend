import { request } from 'umi';
export async function fakeRegister(params) {
  return request('/api/user/register', {
    method: 'POST',
    data: params,
  });
}
