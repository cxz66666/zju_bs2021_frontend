import { request } from 'umi';
export async function SubmitForm(params) {
  return request('/api/project/new', {
    method: 'POST',
    data: params,
  });
}

export async function QueryTags(params) {
  return request('/api/class/allclass', {
    method: 'GET',
    data: params,
  });
}

export async function QueryUsers(params) {
  return request('/api/users/alluser', {
    method: 'GET',
    data: params,
  });
}
