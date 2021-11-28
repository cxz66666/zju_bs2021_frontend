/** 获取规则列表 GET /api/rule */
import { request } from 'umi';

export async function AddToProject(data, options) {
  return request('/api/project/addpi', {
    method: 'POST',
    data: data,
    ...(options || {}),
  });
}
