import { request } from 'umi';
export async function queryList(params) {
  return request('/api/project/list', {
    params: params,
  });
}
