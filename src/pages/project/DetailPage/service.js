import { request } from 'umi';
export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}
export async function QueryProject(id, data, options) {
  return request('/api/project/' + id, {
    data,
    method: 'GET',
    ...(options || {}),
  });
}

export async function ChangeStatus(id, data, options) {
  return request('/api/project/cs/' + id, {
    data,
    method: 'PUT',
    ...(options || {}),
  });
}

export async function ChooseNumber(id, params, options) {
  return request('/api/project/cn/' + id, {
    params: params,
    method: 'GET',
    ...(options || {}),
  });
}
