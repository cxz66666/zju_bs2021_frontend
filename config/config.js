// https://umijs.org/config/
import { defineConfig } from 'umi';
import { join } from 'path';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  layout: {
    // https://umijs.org/zh-CN/plugins/plugin-layout
    locale: true,
    siderWidth: 208,
    ...defaultSettings,
  },
  //https://umijs.org/zh-CN/plugins/plugin-locale
  locale: {
    // default zh-CN
    default: 'zh-CN',
    antd: true,
    // default true, when it is true, will use `navigator.language` overwrite default
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@ant-design/pro-layout/es/PageLoading',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          path: '/user/login',
          layout: false,
          name: 'login',
          component: './user/Login',
        },
        {
          path: '/user',
          redirect: '/user/login',
        },
        {
          name: 'register-result',
          icon: 'smile',
          path: '/user/register-result',
          layout: false,
          component: './user/register-result',
        },
        {
          name: 'register',
          icon: 'smile',
          layout: false,
          path: '/user/register',
          component: './user/register',
        },
        {
          component: '404',
        },
      ],
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      icon: 'dashboard',
      routes: [
        {
          path: '/dashboard',
          redirect: '/dashboard/workplace',
        },
        {
          name: 'workplace',
          icon: 'smile',
          path: '/dashboard/workplace',
          component: './dashboard/workplace',
        },
      ],
    },

    {
      name: 'exception',
      icon: 'warning',
      path: '/exception',
      hideInMenu: true,

      routes: [
        {
          path: '/exception',
          redirect: '/exception/403',
        },
        {
          name: '403',
          icon: 'smile',
          path: '/exception/403',
          component: './exception/403',
        },
        {
          name: '404',
          icon: 'smile',
          path: '/exception/404',
          component: './exception/404',
        },
        {
          name: '500',
          icon: 'smile',
          path: '/exception/500',
          component: './exception/500',
        },
      ],
    },
    {
      name: 'account',
      icon: 'user',
      path: '/account',
      routes: [
        {
          path: '/account',
          redirect: '/account/center',
        },
        {
          name: 'center',
          icon: 'smile',
          path: '/account/center',
          component: './account/center',
        },
        {
          name: 'settings',
          icon: 'smile',
          path: '/account/settings',
          component: './account/settings',
        },
      ],
    },
    {
      path: '/tag',
      name: 'Tag页',
      icon: 'profile',
      routes: [
        {
          name: '标记管理',
          icon: 'smile',
          path: '/tag/tag-list',
          component: './tag/ClassTableList',
        },
      ],
    },
    {
      path: '/users',
      name: '用户管理',
      icon: 'smile',
      routes: [
        {
          name: '用户列表',
          icon: 'smile',
          path: '/users/user-list',
          component: './users/UserList',
          access: 'canSysAdmin',
        },
      ],
    },
    {
      path: '/',
      redirect: '/dashboard/workplace',
    },
    {
      name: '上传管理',
      icon: 'smile',
      path: '/upload',
      routes: [
        {
          name: '上传文件',
          icon: 'smile',
          path: '/upload/image',
          component: './upload/Upload',
        },
        {
          name: '图片预览',
          icon: 'smile',
          path: '/upload/list',
          component: './upload/List',
        },
        {
          name: '存储配置',
          icon: 'smile',
          path: '/upload/setting',
          component: './upload/Setting',
          access: 'canSysAdmin',
        },
      ],
    },
    {
      name: '项目总览',
      icon: 'smile',
      path: '/project',
      routes: [
        {
          name: '创建项目',
          icon: 'smile',
          path: '/project/create',
          component: './project/Create',
          access: 'canAdmin',
        },
        {
          name: '项目详情页',
          icon: 'smile',
          path: '/project/detail/:id',
          hideInMenu: true,
          component: './project/DetailPage',
        },
        {
          name: '项目列表',
          icon: 'smile',
          path: '/project/list',
          component: './project/ListCardList',
        },
      ],
    },
    {
      component: '404',
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': defaultSettings.primaryColor,
  },
  // esbuild is father build tools
  // https://umijs.org/plugins/plugin-esbuild
  esbuild: {},
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
  // Fast Refresh 热更新
  fastRefresh: {},
  openAPI: [
    {
      requestLibPath: "import { request } from 'umi'",
      // 或者使用在线的版本
      // schemaPath: "https://gw.alipayobjects.com/os/antfincdn/M%24jrzTTYJN/oneapi.json"
      schemaPath: join(__dirname, 'oneapi.json'),
      mock: false,
    },
    {
      requestLibPath: "import { request } from 'umi'",
      schemaPath: 'https://gw.alipayobjects.com/os/antfincdn/CA1dOm%2631B/openapi.json',
      projectName: 'swagger',
    },
  ],
  nodeModulesTransform: {
    type: 'none',
  },
  mfsu: {},
  webpack5: {},
  exportStatic: {},
});
