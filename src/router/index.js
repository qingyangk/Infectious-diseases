import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },

  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  // 非急性-监测面板 || 急性-全球战疫
  {
    path: '/',
    component: Layout,
    redirect: '/datapanel'
  },

  {
    path: '/datapanel',
    component: Layout,
    redirect: '/datapanel/index',
    children: [
      {
        path: 'index',
        name: '数据面板',
        component: () => import('@/views/datapanel/index'),
        meta: { title: '数据面板', icon: 'el-icon-platform-eleme', roles: ['virus'], noCache: true }
      },
      {
        path: 'detailed',
        name: '详细面板',
        component: () => import('@/views/datapanel/components/index'),
        meta: { title: '详细面板', icon: 'el-icon-platform-eleme', roles: ['virus'], noCache: false }
      },
      {
        path: 'index',
        name: '全球战疫',
        component: () => import('@/views/global/index'),
        meta: { title: '全球战疫', icon: 'el-icon-eleme', roles: ['acute'], noCache: true }
      }
    ]
  },

  // 非急性-查询统计
  {
    path: '/query',
    component: Layout,
    children: [{
      path: 'index',
      name: '查询统计',
      component: () => import('@/views/query/index'),
      meta: { title: '查询统计', icon: 'el-icon-delete-solid', roles: ['virus'] }
    }]
  },

  // 非急性-城市监测
  {
    path: '/rmonitor',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '城市监测',
        component: () => import('@/views/rmonitor/index'),
        meta: { title: '城市监测', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'potential',
        name: '健康打卡',
        component: () => import('@/views/rmonitor/components/potential'),
        meta: { title: '健康打卡', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'signalling',
        name: '信令监测',
        component: () => import('@/views/rmonitor/components/signalling'),
        meta: { title: '信令监测', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'pass',
        name: '关口监测',
        component: () => import('@/views/rmonitor/components/pass'),
        meta: { title: '关口监测', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'trip',
        name: '行程访问',
        component: () => import('@/views/rmonitor/components/trip'),
        meta: { title: '行程访问', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'meteorological',
        name: '气象监测',
        component: () => import('@/views/rmonitor/components/meteorological'),
        meta: { title: '气象监测', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'vaccines',
        name: '疫苗监测',
        component: () => import('@/views/rmonitor/components/vaccines'),
        meta: { title: '疫苗监测', icon: 'el-icon-delete-solid', roles: ['virus'] }
      }
      // {
      //   path: 'mosquito',
      //   name: '虫媒监测',
      //   component: () => import('@/views/rmonitor/components/mosquito'),
      //   meta: { title: '虫媒监测', icon: 'el-icon-delete-solid', roles: ['virus'] }
      // }
    ]
  },

  // 非急性-专题地图
  {
    path: '/map',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '填色图',
        component: () => import('@/views/map/index'),
        meta: { title: '填色图', icon: 'el-icon-s-tools', roles: ['virus'] }
      },
      {
        path: 'reli',
        name: '热力图',
        component: () => import('@/views/map/components/re'),
        meta: { title: '热力图', icon: 'el-icon-s-tools', roles: ['virus'] }
      },
      {
        path: 'yingguang',
        name: '荧光图',
        component: () => import('@/views/map/components/ying'),
        meta: { title: '荧光图', icon: 'el-icon-s-tools', roles: ['virus'] }
      },
      {
        path: 'jvhe',
        name: '聚合图',
        component: () => import('@/views/map/components/jv'),
        meta: { title: '聚合图', icon: 'el-icon-s-tools', roles: ['virus'] }
      },
      {
        path: 'fenglei',
        name: '分类图',
        component: () => import('@/views/map/components/feng'),
        meta: { title: '分类图', icon: 'el-icon-s-tools', roles: ['virus'] }
      },
      {
        path: 'sanwei',
        name: '三维图',
        component: () => import('@/views/map/components/san'),
        meta: { title: '三维图', icon: 'el-icon-s-tools', roles: ['virus'] }
      },
      {
        path: 'midu',
        name: '密度图',
        component: () => import('@/views/map/components/mi'),
        meta: { title: '密度图', icon: 'el-icon-s-tools', roles: ['virus'] }
      },
      {
        path: 'shijian',
        name: '时间图',
        component: () => import('@/views/map/components/shi'),
        meta: { title: '时间图', icon: 'el-icon-s-tools', roles: ['virus'] }
      }
    ]
  },

  // 非急性-时空分异
  {
    path: '/spacetime',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '标准差椭圆',
        component: () => import('@/views/spacetime/index'),
        meta: { title: '标准差椭圆', icon: 'el-icon-user-solid', roles: ['virus'] }
      },
      {
        path: 'lengre',
        name: '冷热点分析',
        component: () => import('@/views/spacetime/components/lengRe'),
        meta: { title: '冷热点分析', icon: 'el-icon-user-solid', roles: ['virus'] }
      },
      {
        path: 'xinxing',
        name: '新兴时空热点分析',
        component: () => import('@/views/spacetime/components/xinXing'),
        meta: { title: '新兴时空热点分析', icon: 'el-icon-user-solid', roles: ['virus'] }
      },
      {
        path: 'jvbu',
        name: '局部自相关',
        component: () => import('@/views/spacetime/components/jvBu'),
        meta: { title: '局部自相关', icon: 'el-icon-user-solid', roles: ['virus'] }
      },
      {
        path: 'dili',
        name: '地理加权回归',
        component: () => import('@/views/spacetime/components/gwr'),
        meta: { title: '地理加权回归', icon: 'el-icon-user-solid', roles: ['virus'] }
      }

    ]
  },

  // 非急性-模拟预测+扩散预警
  {
    path: '/forecast',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '模拟预测',
        component: () => import('@/views/forecast/index'),
        meta: { title: '模拟预测', icon: 'el-icon-phone', roles: ['virus'] }
      },
      {
        path: 'seir',
        name: 'SEIR模拟',
        component: () => import('@/views/forecast/components/seir'),
        meta: { title: 'SEIR模拟', icon: 'el-icon-phone', roles: ['virus'] }
      },
      {
        path: 'CForecast',
        name: '城市模拟',
        component: () => import('@/views/forecast/components/cForecast'),
        meta: { title: '城市模拟', icon: 'el-icon-phone', roles: ['virus'] }
      },
      {
        path: 'arima',
        name: '城市预测',
        component: () => import('@/views/forecast/components/arima'),
        meta: { title: '城市预测', icon: 'el-icon-phone', roles: ['virus'] }
      }
    ]
  },

  // 非急性-传播图谱
  {
    path: '/communicationmap',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '传播调查',
        component: () => import('@/views/communicationmap/index'),
        meta: { title: '传播调查', icon: 'el-icon-more', roles: ['virus'] }
      },
      {
        path: 'graphMovie',
        name: '传播演化',
        component: () => import('@/views/communicationmap/components/graphMovie'),
        meta: { title: '传播演化', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'riskRegion',
        name: '地域风险',
        component: () => import('@/views/communicationmap/components/riskRegion'),
        meta: { title: '地域风险', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'riskTravel',
        name: '出行风险',
        component: () => import('@/views/communicationmap/components/riskTravel'),
        meta: { title: '出行风险', icon: 'el-icon-delete-solid', roles: ['virus'] }
      },
      {
        path: 'meteorological',
        name: '气象调查',
        component: () => import('@/views/communicationmap/components/meteorological'),
        meta: { title: '气象调查', icon: 'el-icon-delete-solid', roles: ['virus'] }
      }
    ]
  },

  // 非急性-舆情分析
  {
    path: '/sentiment',
    component: Layout,
    children: [
      {
        path: 'index',
        name: '舆情分析',
        component: () => import('@/views/sentiment/index'),
        meta: { title: '舆情分析', icon: 'el-icon-star-on', roles: ['virus'] }
      },
      {
        path: 'emotionalAnalysis',
        name: '情感分析',
        component: () => import('@/views/sentiment/components/emotionalAnalysis'),
        meta: { title: '舆情', icon: 'el-icon-delete-solid', roles: ['virus'] }
      }
    ]
  },

  // 非急性-数据管理
  {
    path: '/datamanag',
    component: Layout,
    children: [{
      path: 'index',
      name: '数据管理',
      component: () => import('@/views/datamanag/index'),
      meta: { title: '数据管理', icon: 'el-icon-s-goods', roles: ['virus'] }
    }]
  },

  // 急性-多维监测
  {
    path: '/monitor',
    component: Layout,
    children: [{
      path: 'index',
      name: '多维监测',
      component: () => import('@/views/monitor/index'),
      meta: { title: '多维监测', icon: 'el-icon-delete', roles: ['acute'] }
    }]
  },

  // 急性-城市查询
  {
    path: '/city',
    component: Layout,
    children: [{
      path: 'index',
      name: '城市查询',
      component: () => import('@/views/city/index'),
      meta: { title: '城市查询', icon: 'el-icon-setting', roles: ['acute'] }
    }]
  },

  // 急性-舆情分析
  {
    path: '/publicsentiment',
    component: Layout,
    children: [{
      path: 'index',
      name: '舆情分析',
      component: () => import('@/views/publicsentiment/index'),
      meta: { title: '舆情分析', icon: 'el-icon-user', roles: ['acute'] }
    }]
  },

  // 急性-扩散预警
  {
    path: '/diffusion',
    component: Layout,
    children: [{
      path: 'index',
      name: '扩散预警',
      component: () => import('@/views/diffusion/index'),
      meta: { title: '扩散预警', icon: 'el-icon-phone-outline', roles: ['acute'] }
    }]
  },

  // 急性-时空分析
  {
    path: '/datamanaganalysis',
    component: Layout,
    children: [{
      path: 'index',
      name: '时空分析',
      component: () => import('@/views/datamanaganalysis/index'),
      meta: { title: '时空分析', icon: 'el-icon-more-outline', roles: ['acute'] }
    }]
  },

  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
