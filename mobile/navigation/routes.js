import React from 'react';

import TabBarIcon from 'components/TabBarIcon';
import HomeScreen from 'screens/HomeScreen';
import SettingsScreen from 'screens/SettingsScreen';
import UserListScreen from 'screens/UserListScreen';
import TaskListScreen from 'screens/TaskListScreen';
import RewardListScreen from 'screens/RewardListScreen';
import UserTransactionListScreen from 'screens/UserTransactionListScreen';
import UserTransactionApplicationListScreen from 'screens/UserTransactionApplicationListScreen';
import StaffListScreen from 'screens/StaffListScreen';
import PendingApprovalUserListScreen from 'screens/PendingApprovalUserListScreen';
// import Colors from 'constants/Colors';
import ModifyUser from 'components/ModifyUser';
import UserScreenTopMenu from 'components/UserScreenTopMenu';
import ModifyTask from 'components/ModifyTask';
import CognitoUserListScreen from 'screens/CognitoUserListScreen';
import ProgramList from 'components/ProgramList';
import UserScreen from 'screens/UserScreen';
import Profile from 'components/Profile';
import GroupList from 'components/GroupList';
import ModifyProgram from 'components/ModifyProgram';
import ModifyGroup from 'components/ModifyGroup';
import ModifyReward from 'components/ModifyReward';
import Blank from 'components/Blank';

export default [
  {
    type: 'bottom-tab',
    name: 'Home',
    component: HomeScreen,
    title: '{{organizationName}}',
    rightComponent: null,
    options: {
      title: '首頁',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-home" />,
    },
    groups: [], // disable home for admins before the dashboard is implemented.
  },
  {
    type: 'bottom-tab',
    name: 'UserTransactionList',
    component: UserTransactionListScreen,
    title: '我的存摺',
    options: {
      title: '存摺',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-card" />,
    },
    groups: ['Users', 'N/A'],
  },
  {
    type: 'bottom-tab',
    name: 'UserList',
    component: UserListScreen,
    title: '學生列表',
    rightComponent: <ModifyUser button />,
    options: {
      title: '學生',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-people" />,
    },
    groups: ['AppAdmins', 'OrgAdmins', 'OrgManagers'],
  },
  {
    type: 'bottom-tab',
    name: 'TaskList',
    component: TaskListScreen,
    title: '任務列表',
    rightComponent: <ModifyTask />,
    options: {
      title: '任務',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-list-box" />,
    },
    groups: ['All'],
  },
  {
    type: 'bottom-tab',
    name: 'RewardList',
    component: RewardListScreen,
    title: '獎品列表',
    rightComponent: <ModifyReward />,
    options: {
      title: '獎品',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-star" />,
    },
    groups: ['All'],
  },
  {
    type: 'bottom-tab',
    name: 'UserTransactionApplicationList',
    component: UserTransactionApplicationListScreen,
    title: '申請列表',
    options: {
      title: '申請',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-checkmark-circle-outline" />,
    },
    groups: ['All'],
  },
  // {
  //   type: 'bottom-tab',
  //   name: 'StaffList',
  //   component: StaffListScreen,
  //   rightComponent: null,
  //   title: '職員列表',
  //   options: {
  //     title: '職員',
  //     tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-contacts" />,
  //   },
  //   groups: ['AppAdmins', 'OrgAdmins'],
  // },
  // {
  //   type: 'bottom-tab',
  //   name: 'PendingApprovalUserList',
  //   component: PendingApprovalUserListScreen,
  //   rightComponent: null,
  //   title: '申請列表',
  //   options: {
  //     title: '審核',
  //     tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-checkmark-circle-outline" />,
  //   },
  //   groups: ['AppAdmins', 'OrgAdmins'],
  // },
  {
    type: 'bottom-tab',
    name: 'Settings',
    component: SettingsScreen,
    title: '{{organizationName}}',
    rightComponent: null,
    options: {
      title: '設定',
      tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} name="md-settings" />,
    },
    groups: ['All'],
  },
  {
    type: 'stack',
    name: 'Blank',
    component: Blank,
    rightComponent: null,
    title: '',
    groups: ['All'],
  },
  {
    type: 'stack',
    name: 'User',
    component: UserScreen,
    rightComponent: ((user) => user ? <UserScreenTopMenu
      user={user}
    /> : null),
    title: '學生',
    groups: ['All'],
  },
  {
    type: 'stack',
    name: 'StaffList',
    component: StaffListScreen,
    rightComponent: null,
    title: '職員列表',
    showInSettingsMenu: true,
    groups: ['AppAdmins', 'OrgAdmins'],
  },
  {
    type: 'stack',
    name: 'PendingApprovalUserList',
    component: PendingApprovalUserListScreen,
    rightComponent: null,
    title: '申請列表',
    showInSettingsMenu: true,
    groups: ['AppAdmins', 'OrgAdmins'],
  },
  {
    type: 'stack',
    name: 'CognitoUserList',
    component: CognitoUserListScreen,
    rightComponent: null,
    title: '註冊用戶列表',
    showInSettingsMenu: true,
    groups: ['AppAdmins'],
  },
  {
    type: 'stack',
    name: 'Programs',
    component: ProgramList,
    rightComponent: <ModifyProgram />,
    title: '任務類別列表',
    showInSettingsMenu: true,
    groups: ['AppAdmins', 'OrgAdmins'],
  },
  {
    type: 'stack',
    name: 'Groups',
    component: GroupList,
    rightComponent: <ModifyGroup />,
    title: '學生分組列表',
    showInSettingsMenu: true,
    groups: ['AppAdmins', 'OrgAdmins'],
  },
  {
    type: 'stack',
    name: 'Profile',
    component: Profile,
    rightComponent: null,
    title: '個人資料',
    showInSettingsMenu: true,
    groups: ['All'],
  },
];
