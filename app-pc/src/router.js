import Vue from 'vue';
import Router from 'vue-router';
import VueCookie from 'vue-cookie';
import { Constants } from './utils/constants';

Vue.use(Router);
Vue.use(VueCookie);

let customImport;
const userType = Vue.cookie.get('userType');

// 开发环境不使用懒加载, 因为懒加载页面太多的话会造成webpack热更新太慢, 所以只有生产环境使用懒加载
if (process.env.NODE_ENV === 'production') {
  customImport = file => import(`@/views/${file}.vue`);
} else {
  customImport = file => require(`@/views/${file}.vue`).default;
}

// meta.title：tab上显示的标题
// meta.tabKey：tabKey一样的路由会被显示在同一个tab页面下
// meta.isMainPage：相同tabKey的主页面，这个页面跳转到其他与此页面相同tabKey的页面会被缓存，比如：主页面是订单列表页，其他页面是订单详情页
// isMainPage = false的页面跳转到不同tabKey的页面，也会被缓存（切换tab），但是跳转到相同tabKey的页面不会被缓存

let routes = [];
const defaultRoutes = [
  {
    path: '/',
    name: 'home',
    component: customImport('Home'),
    meta: { title: '首页', tabKey: 'home', isMainPage: true },
  },
  {
    path: '/login',
    name: 'login',
    component: customImport('user/Login'),
    meta: { title: '登录', tabKey: 'login' },
  },
  {
    path: '/password-edit',
    name: 'passwordEdit',
    component: customImport('user/PasswordEdit'),
    meta: { title: '修改密码', tabKey: 'passwordEdit' },
  },
  { path: '*', redirect: { name: 'home' } },
];

if (userType === 'admin') {
  // 管理员
  const merchantDefaultMeta = { title: '商家管理', tabKey: Constants.MERCHANT };
  const merchantDefaultBreadcrumbs = { breadcrumbs: [{ title: '商家管理', name: 'merchantList' }] };

  routes = [
    // 商家管理
    {
      path: '/merchant/list',
      name: 'merchantList',
      component: customImport('user/merchant/List'),
      meta: { ...merchantDefaultMeta, isMainPage: true },
    },
    {
      path: '/merchant/add',
      name: 'merchantAdd',
      component: customImport('user/merchant/Add'),
      meta: { ...merchantDefaultMeta, ...merchantDefaultBreadcrumbs, breadcrumbTitle: '新增' },
    },
    {
      path: '/merchant/edit/:merchantUuid',
      name: 'merchantEdit',
      component: customImport('user/merchant/Edit'),
      meta: { ...merchantDefaultMeta, ...merchantDefaultBreadcrumbs, breadcrumbTitle: '编辑' },
    },
  ];
} else {
  // 商家
  const accountDefaultMeta = { title: '账号信息', tabKey: Constants.MERCHANT };
  const accountDefaultBreadcrumbs = { breadcrumbs: [{ title: '账号信息', name: 'merchantView' }] };
  const orderDefaultMeta = { title: '订货单', tabKey: Constants.ORDER };
  const orderDefaultBreadcrumbs = { breadcrumbs: [{ title: '订货单', name: 'orderList' }] };
  const goodsCategoryDefaultMeta = { title: '类别管理', tabKey: Constants.GOODS_CATEGORY };

  routes = [
    // 账号信息
    {
      path: '/merchant/view/:merchantUuid',
      name: 'merchantView',
      component: customImport('user/merchant/View'),
      meta: { ...accountDefaultMeta, isMainPage: true },
    },
    {
      path: '/merchant/edit/:merchantUuid',
      name: 'merchantEdit',
      component: customImport('user/merchant/Edit'),
      meta: { ...accountDefaultMeta, ...accountDefaultBreadcrumbs, breadcrumbTitle: '编辑' },
    },
    // 订货单
    {
      path: '/bill/order/list',
      name: 'orderList',
      component: customImport('bill/order/List'),
      meta: { ...orderDefaultMeta, isMainPage: true },
    },
    {
      path: '/bill/order/add',
      name: 'orderAdd',
      component: customImport('bill/order/Add'),
      meta: { ...orderDefaultMeta, ...orderDefaultBreadcrumbs, breadcrumbTitle: '新增' },
    },

    // 商品类别
    {
      path: '/goods/goods_category/list',
      name: 'goodsCategoryList',
      component: customImport('goods/category/List'),
      meta: { ...goodsCategoryDefaultMeta, isMainPage: true },
    },
  ];
}

export default new Router({
  routes: [...defaultRoutes, ...routes],
});
