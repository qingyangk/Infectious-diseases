import request from '@/utils/request'

// 查询统计-模糊查询
export function QSFQuery(data) {
  return request({
    url: '/Query/QSFQuery',
    method: 'get',
    params: { 'table': data.table, 'where': data.where, 'name': data.name, 'vague': data.vague, 'pageNum': data.pageNum, 'pageSize': data.pageSize }
  })
}

// 查询统计-条件查询
export function QSCQuery(data) {
  return request({
    url: '/Query/QSCQuery',
    method: 'get',
    params: { 'table': data.table, 'where': data.where, 'name': data.name, 'type': data.type, 'condition': data.condition, 'QContent': data.QContent, 'pageNum': data.pageNum, 'pageSize': data.pageSize, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询统计-周边查询
export function QSPQuery(data) {
  return request({
    url: '/Query/QSPQuery',
    method: 'get',
    params: { 'table': data.table, 'where': data.where, 'name': data.name, 'x': data.x, 'y': data.y, 'radius': data.radius, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询统计-年份统计
export function QAStatistics(data) {
  return request({
    url: '/Query/QAStatistics',
    method: 'get',
    params: { 'table': data.table, 'where': data.where, 'name': data.name, 'type': data.type, 'condition': data.condition, 'QContent': data.QContent, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询统计-年龄统计
export function QYStatistics(data) {
  return request({
    url: '/Query/QYStatistics',
    method: 'get',
    params: { 'table': data.table, 'where': data.where, 'name': data.name, 'type': data.type, 'condition': data.condition, 'QContent': data.QContent, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询统计-区域统计
export function QRStatistics(data) {
  return request({
    url: '/Query/QRStatistics',
    method: 'get',
    params: { 'table': data.table, 'where': data.where, 'name': data.name, 'type': data.type, 'condition': data.condition, 'QContent': data.QContent, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询统计-人群统计
export function QPType(data) {
  return request({
    url: '/Query/QPType',
    method: 'get',
    params: { 'table': data.table, 'where': data.where, 'name': data.name, 'type': data.type, 'condition': data.condition, 'QContent': data.QContent, 'timz': data.timz, 'timx': data.timx }
  })
}

// 查询统计-年龄段统计
export function QAGroup(data) {
  return request({
    url: '/Query/QAGroup',
    method: 'get',
    params: { 'table': data.table, 'where': data.where, 'name': data.name, 'type': data.type, 'condition': data.condition, 'QContent': data.QContent, 'timz': data.timz, 'timx': data.timx }
  })
}

// // 更新病例
// export function QSUCase(data) {
//   return request({
//     url: '/Query/QSUCase',
//     method: 'post',
//     params: { 'OBJECTID': data.OBJECTID, 'number': data.number, 'gender': data.gender, 'birth': data.birth, 'age': data.age,
//       'workunit': data.workunit, 'contact': data.contact, 'belong': data.belong, 'addressgb': data.addressgb, 'address': data.address,
//       'population': data.population, 'case': data.case, 'dateonset': data.dateonset, 'diacrisis': data.diacrisis, 'death': data.death,
//       'disease': data.disease, 'reporting': data.reporting, 'unittype': data.unittype, 'laboratory': data.laboratory, 'severe': data.severe,
//       'remarks': data.remarks }
//   })
// }
