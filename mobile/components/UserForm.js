import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
// import { useNavigation } from '@react-navigation/native';
import { Avatar, Text } from 'react-native-elements';
import { Hub } from 'aws-amplify';

import request from '../src/utils/request';
import { getOrganizationUser } from '../src/graphql/queries';
import AddTaskToUser from './AddTaskToUser';
// import UserTaskList from './UserTaskList';
import UserTransactionList from './UserTransactionList';
import PointsHandler from './PointsHandler';
import { currency } from '../src/utils/format';

export default function UserForm({ user: inUser, mode = 'view' }) {
  const [user, setUser] = useState(inUser);

  const load = async () => {
    Hub.dispatch('app', { event: 'loading' });

    const { organizationId, username } = inUser;
    const { data: { getOrganizationUser: userData } } = await request(getOrganizationUser, {
      organizationId,
      username,
    });

    userData && setUser(userData);

    Hub.dispatch('app', { event: 'loading-complete' });
  };

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [inUser]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Avatar
          rounded
          size="large"
          source={{ uri: `https://i.pravatar.cc/100?u=${inUser.username}` }}
        />
        <Text h4>{user.name}</Text>
        <Text h4>{currency(user.currentPoints, false)}</Text>
      </View>
      {mode !== 'view' &&
      <View style={styles.headerContainer}>
        <PointsHandler
          user={user}
          mode={'withdraw'}
          onUpdate={load}
        />
        {/* <PointsHandler
          user={user}
          mode={'adjustment'}
          onUpdate={load}
        /> */}
        <AddTaskToUser
          user={user}
          onUpdate={load}
        />
      </View>}
      {/* <UserTaskList tasks={user.tasks.items} /> */}
      <UserTransactionList
        user={user}
        onUpdate={load}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
});
