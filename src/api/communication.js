import request from '@/utils/request'

// 查询今日感染人员数据
export function CSTData(data) {
  return request({
    url: '/Spread/CSTData',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询个人详细信息
export function CSPInformation(data) {
  return request({
    url: '/Spread/CSPInformation',
    method: 'get',
    params: { 'id': data.id, 'where': data.where, 'name': data.name }
  })
}

// 查询个人轨迹
export function CSPTrajectory(data) {
  return request({
    url: '/Spread/CSPTrajectory',
    method: 'get',
    params: { 'id': data.id, 'where': data.where, 'name': data.name, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询某时间段在缓冲区内的数据
export function CSBuffer(data) {
  return request({
    url: '/Spread/CSBuffer',
    method: 'get',
    params: { 'id': data.id, 'where': data.where, 'name': data.name, 'x': data.x, 'y': data.y, 'radius': data.radius, 'timz': data.timz, 'timx': data.timx }
  })
}

// 删除错误地点
export function DCBPlace(data) {
  return request({
    url: '/Spread/DCBPlace',
    method: 'get',
    params: { 'id': data.id, 'value': data.value, 'where': data.where, 'name': data.name }
  })
}

// 新增正确地点
export function ICBPlace(data) {
  return request({
    url: '/Spread/ICBPlace',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'id': data.id, 'time': data.time, 'x': data.x, 'y': data.y, 'value': data.value }
  })
}

// 更新错误地点
export function UCBPlace(data) {
  return request({
    url: '/Spread/UCBPlace',
    method: 'get',
    params: { 'id': data.id, 'value': data.value, 'where': data.where, 'name': data.name, 'newx': data.newx, 'newy': data.newy, 'newvalue': data.newvalue, 'time': data.time }
  })
}
