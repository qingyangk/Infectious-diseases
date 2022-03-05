import request from '@/utils/request'

// 查询城市-当前体温/血压/心率
export function QPCondition(data) {
  return request({
    url: '/City/QPCondition',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timx': data.timx, 'timz': data.timz, 'monitor': data.monitor, 'wenduga': data.wenduga, 'wendudi': data.wendudi, 'xinlvga': data.xinlvga, 'xinlvdi': data.xinlvdi, 'xueygga': data.xueygga, 'xueygdi': data.xueygdi, 'xueydga': data.xueydga, 'xueyddi': data.xueyddi }
  })
}

// 查询城市-历史体温/血压/心率
export function QHCondition(data) {
  return request({
    url: '/City/QHCondition',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timx': data.timx, 'timz': data.timz, 'type': data.type, 'monitor': data.monitor, 'wenduga': data.wenduga, 'wendudi': data.wendudi, 'xinlvga': data.xinlvga, 'xinlvdi': data.xinlvdi, 'xueygga': data.xueygga, 'xueygdi': data.xueygdi, 'xueydga': data.xueydga, 'xueyddi': data.xueyddi }
  })
}

// 查询城市-播报
export function QCBroadcasting(data) {
  return request({
    url: '/City/QCBroadcasting',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timx': data.timx, 'timz': data.timz, 'monitor': data.monitor }
  })
}

// 查询城市-查询
export function QQuery(data) {
  return request({
    url: '/City/QQuery',
    method: 'get',
    params: { 'ID': data.ID, 'timx': data.timx, 'timz': data.timz }
  })
}

// 查询城市-隔离人员
export function QQuarantine(data) {
  return request({
    url: '/City/QQuarantine',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timx': data.timx, 'timz': data.timz }
  })
}

// 查询隔离人员-轨迹
export function QTrajectory(data) {
  return request({
    url: '/City/QTrajectory',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'id': data.id, 'timx': data.timx, 'timz': data.timz }
  })
}

// 行程监测-------------------------------------------------------------
// 查询小区打卡数
export function RQuarters(data) {
  return request({
    url: '/City/RQuarters',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timx': data.timx, 'timz': data.timz }
  })
}

// 疫苗监测-------------------------------------------------------------
// 查询小区接种疫苗数
export function NOVaccinations(data) {
  return request({
    url: '/City/NOVaccinations',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'type': data.type, 'timx': data.timx, 'timz': data.timz }
  })
}

// 查询小区总人口
export function QTPopulation(data) {
  return request({
    url: '/City/QTPopulation',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'type': data.type }
  })
}

// 查询小区总接种疫苗数
export function QTVaccinations(data) {
  return request({
    url: '/City/QTVaccinations',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'type': data.type }
  })
}

// 查询医院接种数
export function QNOHVaccinations(data) {
  return request({
    url: '/City/QNOHVaccinations',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'type': data.type }
  })
}

// 查询疫苗种类
export function QVType(data) {
  return request({
    url: '/City/QVType',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'type': data.type }
  })
}

// 小区疫苗接种率
export function QCVRate(data) {
  return request({
    url: '/City/QCVRate',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'type': data.type, 'timx': data.timx }
  })
}

// 信令监测-------------------------------------------------------------
// 查询画圈行程
export function QCStroke(data) {
  return request({
    url: '/City/QCStroke',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'range': data.range, 'timx': data.timx, 'timz': data.timz }
  })
}

// 健康打卡-------------------------------------------------------------
// 查询每日健康打卡情况
export function ClockIn(data) {
  return request({
    url: '/City/ClockIn',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timx': data.timx, 'timz': data.timz }
  })
}

// 查询周期打卡情况
export function CClockIn(data) {
  return request({
    url: '/City/CClockIn',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timx': data.timx, 'timz': data.timz }
  })
}

// 查询个人历史体温
export function CHistory(data) {
  return request({
    url: '/City/CHistory',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'email': data.email, 'timx': data.timx, 'timz': data.timz }
  })
}

// 查询用户名用户
export function GUser(data) {
  return request({
    url: '/City/GUser',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'value': data.value }
  })
}
