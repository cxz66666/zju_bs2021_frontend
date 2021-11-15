import { request } from 'umi';

/** 获取规则列表 GET /api/rule */
export async function fetchData(params, options) {
  return request('/api/image/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
