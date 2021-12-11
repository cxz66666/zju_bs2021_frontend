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

export async function ChangeRegion(data, options) {
  return request('/api/project/cr', {
    data: data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function ChangeAnnotationType(data, options) {
  return request('/api/project/ct', {
    data: data,
    method: 'POST',
    ...(options || {}),
  });
}

export async function DeleteProject(id, options) {
  return request('/api/project/' + id, {
    method: 'DELETE',
    ...(options || {}),
  });
}
