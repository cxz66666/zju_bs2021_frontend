import { request } from 'umi';
export async function queryFakeList(params) {
  return request('/api/get_list', {
    params,
  });
}
export async function removeFakeList(params) {
  return request('/api/post_fake_list', {
    method: 'POST',
    data: { ...params, method: 'delete' },
  });
}
export async function addFakeList(params) {
  return request('/api/post_fake_list', {
    method: 'POST',
    data: { ...params, method: 'post' },
  });
}
export async function updateFakeList(params) {
  return request('/api/post_fake_list', {
    method: 'POST',
    data: { ...params, method: 'update' },
  });
}

export async function ListUser(params) {
  return request('/api/users/list', {
    method: 'GET',
    params: { ...params },
  });
}
export async function DeleteUser(params) {
  return request('/api/users/user', {
    method: 'DELETE',
    data: {
      ...params,
    },
  });
}

export async function ChangeRole(params) {
  return request('/api/users/role', {
    method: 'PUT',
    data: {
      ...params,
    },
  });
}

export async function QueryNum() {
  return request('/api/users/num', {
    method: 'GET',
  });
}
