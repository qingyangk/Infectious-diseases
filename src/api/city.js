import request from '@/utils/request'

// 查询遮罩
export function qMask(data) {
  return request({
    url: '/usa/qMask',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询范围
export function qRange(data) {
  return request({
    url: '/usa/qRange',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 确诊-治愈-死亡
export function qDatas(data) {
  return request({
    url: '/usa/qDatas',
    method: 'get',
    params: { 'name': data.name, 'today': data.today, 'yesterday': data.yesterday }
  })
}

// 查询洲确诊
export function qZDeath(data) {
  return request({
    url: '/usa/qZDeath',
    method: 'get'
  })
}

// IMAP
// 查询地区确诊死亡
export function qCDHome(data) {
  return request({
    url: '/usa/qCDHome',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询地区日增确诊死亡
export function qDCDHome(data) {
  return request({
    url: '/usa/qDCDHome',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询地区现有确诊
export function qCurrentlyI(data) {
  return request({
    url: '/usa/qCurrentlyI',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询地区床|新冠床|ICU床
export function qDBed(data) {
  return request({
    url: '/usa/qDBed',
    method: 'get',
    params: { 'name': data.name, 'range': data.range }
  })
}

// 查询疫苗总数|第一针|完成
export function qDVaccines(data) {
  return request({
    url: '/usa/qDVaccines',
    method: 'get',
    params: { 'name': data.name, 'range': data.range }
  })
}

// 查询阳性阴性
export function qTesting(data) {
  return request({
    url: '/usa/qTesting',
    method: 'get',
    params: { 'name': data.name, 'range': data.range }
  })
}

// 查询排名
export function qRanking(data) {
  return request({
    url: '/usa/qRanking',
    method: 'get',
    params: { 'name': data.name, 'range': data.range, 'time': data.time }
  })
}

// 查询日排名
export function qDRanking(data) {
  return request({
    url: '/usa/qDRanking',
    method: 'get',
    params: { 'name': data.name, 'range': data.range, 'time': data.time }
  })
}

// 预测
// 查询报告死亡
export function qRDeath(data) {
  return request({
    url: '/usa/qRDeath',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询报告死亡未报告死亡
export function qRNDeath(data) {
  return request({
    url: '/usa/qRNDeath',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询日报告死亡
export function qDRDeath(data) {
  return request({
    url: '/usa/qDRDeath',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询日报告死亡未报告死亡
export function qDRNDeath(data) {
  return request({
    url: '/usa/qDRNDeath',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询医院所有床位|ICU床位
export function qHBeds(data) {
  return request({
    url: '/usa/qHBeds',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询预测感染
export function qPInfection(data) {
  return request({
    url: '/usa/qPInfection',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询确认感染|检测
export function qCInfection(data) {
  return request({
    url: '/usa/qCInfection',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询口罩利用
export function qMUtilization(data) {
  return request({
    url: '/usa/qMUtilization',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询日常感染和检测
export function qDIDetection(data) {
  return request({
    url: '/usa/qDIDetection',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询最新资讯
export function qLNews(data) {
  return request({
    url: '/usa/qLNews',
    method: 'get'
  })
}
