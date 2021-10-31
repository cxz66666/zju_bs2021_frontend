// @ts-ignore

/* eslint-disable */
import { request } from 'umi';

/** 获取规则列表 GET /api/rule */
export async function rule(params, options) {
  return request('/api/class/list', {
    method: 'GET',
    params: { ...params },
    ...(options || {}),
  });
}
/** 新建规则 PUT /api/rule */

export async function updateRule(data, options) {
  return request('/api/class/update', {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}
/** 新建规则 POST /api/rule */

export async function addRule(data, options) {
  return request('/api/class/create', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}
/** 删除规则 DELETE /api/rule */

export async function removeRule(data, options) {
  return request('/api/class/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function removeTag(data, options) {
  return request('/api/class/tag/delete', {
    data,
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function addTag(data, options) {
  return request('/api/class/tag/create', {
    data,
    method: 'POST',
    ...(options || {}),
  });
}
