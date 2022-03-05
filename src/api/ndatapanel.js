import request from '@/utils/request'

// 地图范围数据
export function QJson(data) {
  return request({
    url: '/NDatapanel/QJson',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询地名
export function QPName() {
  return request({
    url: '/NDatapanel/QPName',
    method: 'get'
  })
}

// 查询地图内/发病数/死亡数/发病率/死亡率
export function QMapJson(data) {
  return request({
    url: '/NDatapanel/QMapJson',
    method: 'get',
    params: { 'where': data.where, 'dataType': data.dataType, 'type': data.type, 'name': data.name, 'x': data.x, 'time': data.time }
  })
}

// 查询展示数据/发病数/死亡数/发病率/死亡率
export function QDataJson(data) {
  return request({
    url: '/NDatapanel/QDataJson',
    method: 'get',
    params: { 'where': data.where, 'type': data.type, 'name': data.name, 'x': data.x, 'time': data.time }
  })
}

// 查询疾病列表
export function QDiseaseJson() {
  return request({
    url: '/NDatapanel/QDiseaseJson',
    method: 'get'
  })
}

// 更新疾病权重
export function UDJson(data) {
  return request({
    url: '/NDatapanel/UDJson',
    method: 'post',
    params: { 'id': data.id }
  })
}

// 查询发病率
export function QIncidenceRate(data) {
  return request({
    url: '/NDatapanel/QIncidenceRate',
    method: 'get',
    params: { 'time': data.time, 'timec': data.timec, 'detailed': data.detailed, 'type': data.type, 'where': data.where, 'name': data.name }
  })
}

// 查询死亡率
export function QMortality(data) {
  return request({
    url: '/NDatapanel/QMortality',
    method: 'get',
    params: { 'time': data.time, 'timec': data.timec, 'detailed': data.detailed, 'type': data.type, 'where': data.where, 'name': data.name }
  })
}

// 查询发病数
export function QNumberCases(data) {
  return request({
    url: '/NDatapanel/QNumberCases',
    method: 'get',
    params: { 'time': data.time, 'timec': data.timec, 'detailed': data.detailed, 'type': data.type, 'where': data.where, 'name': data.name }
  })
}

// 查询死亡数
export function QNumberDeaths(data) {
  return request({
    url: '/NDatapanel/QNumberDeaths',
    method: 'get',
    params: { 'time': data.time, 'timec': data.timec, 'detailed': data.detailed, 'type': data.type, 'where': data.where, 'name': data.name }
  })
}

// 查询周对比
export function QWComparison(data) {
  return request({
    url: '/NDatapanel/QWComparison',
    method: 'get',
    params: { 'type': data.type, 'where': data.where, 'name': data.name, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询日对比
export function QDComparison(data) {
  return request({
    url: '/NDatapanel/QDComparison',
    method: 'get',
    params: { 'type': data.type, 'where': data.where, 'name': data.name, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询近一月数据
export function QMData(data) {
  return request({
    url: '/NDatapanel/QMData',
    method: 'get',
    params: { 'type': data.type, 'where': data.where, 'name': data.name, 'timz': data.timz, 'timx': data.timx }
  })
}

// --------------------------------------------------------------------------------------------------------------------------

// 查询特定病种数据
export function QGDJson(data) {
  return request({
    url: '/NDatapanel/QGDJson',
    method: 'get',
    params: { 'type': data.type, 'name': data.name, 'table': data.table, 'where': data.where, 'dataType': data.dataType, 'time': data.time, 'x': data.x }
  })
}

// 查询省名
export function QName(data) {
  return request({
    url: '/NDatapanel/QName',
    method: 'get',
    params: { 'name': data.name }
  })
}

// 查询年份统计-确诊/重症/死亡
export function QXYStatistics(data) {
  return request({
    url: '/NDatapanel/QXYStatistics',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where }
  })
}

// 查询时间间隔-确诊/死亡
export function QXTInterval(data) {
  return request({
    url: '/NDatapanel/QXTInterval',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'time': data.time, 'x': data.x }
  })
}

// 查询年龄统计-确诊/重症/死亡
export function QAStatistics(data) {
  return request({
    url: '/NDatapanel/QAStatistics',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'time': data.time, 'x': data.x }
  })
}

// 查询行政区-确诊/重症/死亡
export function QXARegion(data) {
  return request({
    url: '/NDatapanel/QXARegion',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'time': data.time, 'x': data.x }
  })
}

// 查询季度-确诊/重症/死亡
export function QXQuarter(data) {
  return request({
    url: '/NDatapanel/QXQuarter',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'degree': data.degree, 'time': data.time, 'x': data.x }
  })
}

// 查询月份-确诊/重症/死亡
export function QXMonth(data) {
  return request({
    url: '/NDatapanel/QXMonth',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'degree': data.degree, 'time': data.time, 'x': data.x }
  })
}

// 查询病毒类型
export function QXVType(data) {
  return request({
    url: '/NDatapanel/QXVType',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'degree': data.degree, 'time': data.time, 'x': data.x }
  })
}

// 查询人群分部
export function QXCrowd(data) {
  return request({
    url: '/NDatapanel/QXCrowd',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'degree': data.degree, 'time': data.time, 'x': data.x }
  })
}

// 查询年龄组
export function QXAGroup(data) {
  return request({
    url: '/NDatapanel/QXAGroup',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'degree': data.degree, 'time': data.time, 'x': data.x }
  })
}

// 查询-确诊/重症/死亡+性别
export function QXJson(data) {
  return request({
    url: '/NDatapanel/QXJson',
    method: 'get',
    params: { 'name': data.name, 'table': data.table, 'where': data.where, 'degree': data.degree, 'time': data.time, 'x': data.x }
  })
}
