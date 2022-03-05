import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/user/login',
    method: 'post',
    params: { 'username': data.username, 'password': data.password, 'system': data.system }
  })
}

export function getInfo(data) {
  return request({
    url: '/user/info',
    method: 'post',
    params: { 'username': data.username }
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'get'
  })
}
