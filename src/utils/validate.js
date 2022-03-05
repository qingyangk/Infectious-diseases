/**
 * Created by PanJiaChen on 16/11/18.
 */

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @param {string} str
 * @returns {Boolean}
 */
export function validUsername(str) {
  const valid_map = ['admin', 'virus', 'acute']
  return valid_map.indexOf(str.trim()) >= 0
}

/**
 * @param {string} str
 * @returns {Boolean}
 * */
// 这是新增的验证邮箱的函数
export function validEmail(str) {
  const emailReg = /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/
  return emailReg.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * */
// 这是新增的验证电话的函数
export function validTelephone(str) {
  const telephone = /^(?:(?:\+|00)86)?1(?:(?:3[\d])|(?:4[5-79])|(?:5[0-35-9])|(?:6[5-7])|(?:7[0-8])|(?:8[\d])|(?:9[189]))\d{8}$/
  return telephone.test(str)
}

/**
 * @param {string} str
 * @returns {Boolean}
 * */
// 这是新增的验证字母的函数
export function validLetter(str) {
  const letter = /^[a-zA-Z]\w{4,15}$/
  return letter.test(str)
}
/**
 * @param {string} str
 * @returns {Boolean}
 * */
// 这是新增的验证密码的函数
export function validPassword(str) {
  const password = /^[a-zA-Z]\w{5,17}$/
  return password.test(str)
}
