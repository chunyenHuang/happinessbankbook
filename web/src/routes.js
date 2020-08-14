import { Route } from 'react-router-dom';

import ProtectedRoute from 'components/ProtectedRoute';

import UserDashboard from 'views/User/Dashboard/Dashboard';
// import AdminDashboard from 'views/Admin/Dashboard/Dashboard';
import Organizations from 'views/Admin/Organizations/Organizations';
import Organization from 'views/Admin/Organization/Organization';
import Users from 'views/Admin/Users/Users';

export const general = [
].map((item) => {
  item.route = item.route || Route;
  return item;
});

export const user = [
  {
    title: '幸福存摺',
    paths: [
      { path: '/', exact: true },
      { path: '/dashboard', exact: true },
    ],
    component: UserDashboard,
  },
].map((item) => {
  item.route = item.route || ProtectedRoute;
  item.roles = ['Users'];
  return item;
});

export const admin = [
  // {
  //   title: '首頁',
  //   paths: [
  //     { path: '/', exact: true },
  //     { path: '/dashboard', exact: true },
  //   ],
  //   component: AdminDashboard,
  //   hideFromMenu: true,
  // },
  {
    title: '機構',
    paths: [
      { path: '/organizations', exact: true },
    ],
    component: Organizations,
  },
  {
    title: '機構',
    paths: [
      { path: '/organization/:id', exact: true },
    ],
    component: Organization,
    hideFromMenu: true,
  },
  {
    title: '軟體用戶',
    paths: [
      { path: '/appUsers', exact: true },
    ],
    component: Users,
  },
].map((item) => {
  item.route = item.route || ProtectedRoute;
  item.roles = ['OrgAdmins', 'AppAdmins'];
  return item;
});

export const appRoutes = [
  ...general, ...user, ...admin,
].reduce((all, item) => {
  item.paths.forEach(({ path, exact = true }) => {
    all.push(Object.assign({ path, exact }, item));
  });
  return all;
}, []);
