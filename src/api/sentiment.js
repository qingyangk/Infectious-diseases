import request from '@/utils/request'

// 舆情分析-矩阵
export function MAtrix(data) {
  return request({
    url: '/sentiment/MAtrix',
    method: 'get'
  })
}

// 舆情分析-来源
export function Source(data) {
  return request({
    url: '/sentiment/Source',
    method: 'get'
  })
}

// 舆情分析-时间查询
export function POTQuery(data) {
  return request({
    url: '/sentiment/POTQuery',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timz': data.timz, 'timx': data.timx }
  })
}

// 舆情分析-区域查询
export function POAQuery(data) {
  return request({
    url: '/sentiment/POAQuery',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'range': data.range, 'timz': data.timz, 'timx': data.timx }
  })
}

// 舆情分析-文本分析
export function TAnalysis(data) {
  return request({
    url: '/sentiment/TAnalysis',
    method: 'post',
    data: data.data
  })
}

// 舆情分析-标注分析
export function PAnalysis(data) {
  return request({
    url: '/sentiment/PAnalysis',
    method: 'post',
    data: data
  })
}

// 舆情分析-时序统计
export function Sequential(data) {
  return request({
    url: '/sentiment/Sequential',
    method: 'get',
    params: { 'where': data.where, 'name': data.name, 'timz': data.timz, 'timx': data.timx }
  })
}
