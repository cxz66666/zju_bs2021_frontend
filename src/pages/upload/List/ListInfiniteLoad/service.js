import { request } from 'umi';

/** 获取规则列表 GET /api/rule */
export async function fetchListData(id, params, options) {
  return request('/api/image/list/' + id, {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
