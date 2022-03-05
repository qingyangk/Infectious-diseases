import request from '@/utils/request'

// 地图范围数据
export function json(data) {
  return request({
    url: '/datapanel/json',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 市一级
export function maps(data) {
  return request({
    url: '/datapanel/maps',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 县一级
export function mapx(data) {
  return request({
    url: '/datapanel/mapx',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 镇一级
export function mapz(data) {
  return request({
    url: '/datapanel/mapz',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 陕西省总诊断病例 重症病例 死亡病例
export function qTotal() {
  return request({
    url: '/datapanel/qTotal',
    method: 'get'
  })
}

// 人群类型 病例类型 报告单位 年龄跨度
export function qStatistics() {
  return request({
    url: '/datapanel/qStatistics',
    method: 'get'
  })
}

// 行政区地区确诊 地区重症 地址死亡
export function AdministrativeRegion(data) {
  return request({
    url: '/datapanel/AdministrativeRegion',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 季度地区确诊 地区重症 地址死亡
export function Severe(data) {
  return request({
    url: '/datapanel/Quarter',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 月份地区确诊 地区重症 地址死亡
export function Month(data) {
  return request({
    url: '/datapanel/Month',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 病毒类型
export function qVirustype(data) {
  return request({
    url: '/datapanel/qVirustype',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 重症病毒类型
export function qCriticalpopulation(data) {
  return request({
    url: '/datapanel/qCriticalpopulation',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 重症病毒类型
export function qSeverevirus(data) {
  return request({
    url: '/datapanel/qSeverevirus',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 重症病毒类型
export function qSevereagegroup(data) {
  return request({
    url: '/datapanel/qSevereagegroup',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 死亡病毒类型
export function qThedead(data) {
  return request({
    url: '/datapanel/qThedead',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 死亡病毒类型
export function qDeathvirus(data) {
  return request({
    url: '/datapanel/qDeathvirus',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 死亡病毒类型
export function qDeathagegroup(data) {
  return request({
    url: '/datapanel/qDeathagegroup',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 年龄诊断 重症 死亡
export function qAgestatistics(data) {
  return request({
    url: '/datapanel/qAgestatistics',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 年份诊断 重症 死亡
export function qYearstatistics(data) {
  return request({
    url: '/datapanel/qYearstatistics',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 年龄组查询成功
export function qNormalagegroup(data) {
  return request({
    url: '/datapanel/qNormalagegroup',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 人群查询成功
export function qCrowddiagnosis(data) {
  return request({
    url: '/datapanel/qCrowddiagnosis',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 诊断-发病
export function DAReduction(data) {
  return request({
    url: '/datapanel/DAReduction',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}

// 死亡-发病
export function DRMorbidity(data) {
  return request({
    url: '/datapanel/DRMorbidity',
    method: 'get',
    params: { 'range': data.range, 'name': data.name }
  })
}
