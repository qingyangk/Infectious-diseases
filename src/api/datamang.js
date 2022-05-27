import request from '@/utils/request'

// 保存表格数据
export function upTable(data) {
  return request({
    url: '/data/upTable',
    method: 'post',
    params: { 'OBJECTID': data.OBJECTID}
  })
}