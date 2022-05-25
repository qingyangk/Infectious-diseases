import defaultSettings from '@/settings'

const title = defaultSettings.title || '疾病分析'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
