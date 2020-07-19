import React, { useEffect, useState } from 'react';
import { StyleSheet, ScrollView, AsyncStorage, RefreshControl } from 'react-native';
import { ListItem } from 'react-native-elements';
import { List } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { API, graphqlOperation } from 'aws-amplify';

import { asyncListAll } from '../src/utils/request';
import { sortBy } from '../src/utils/sorting';
import Colors from '../constants/Colors';
import { listOrganizationGroups, getOrgUsersByGroupByActive } from '../src/graphql/queries';
import { onCreateOrganizationUser } from '../src/graphql/subscriptions';

export default function UserList() {
  const navigation = useNavigation();

  const [groups, setGroups] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const renderRefreshingControl = () => {
    return (
      <RefreshControl
        refreshing={isLoading}
        onRefresh={load} />
    );
  };

  const load = async () => {
    setIsLoading(true);

    const organizationId = await AsyncStorage.getItem('app:organizationId');

    const groups = await asyncListAll(listOrganizationGroups, { organizationId });

    const promises = groups.map(async (group) => {
      group.isExpanded = true;
      group.users = await asyncListAll(getOrgUsersByGroupByActive, {
        groupId: group.id,
        isActive: { eq: 1 },
        filter: {
          role: { eq: 'User' },
        },
      });
    });

    await Promise.all(promises);

    setGroups(groups);
    setIsLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    const subscription = API
      .graphql(graphqlOperation(onCreateOrganizationUser))
      .subscribe({
        next: (event) => {
          console.log(event);
          if (event) {
            const newUser = event.value.data.onCreateOrganizationUser;
            const matchedGroup = groups.find(({ id }) => id === newUser.groupId);
            if (matchedGroup) {
              matchedGroup.users.unshift(newUser);
              setGroups([...groups]);
            } else {
              load();
            }
          }
        },
      });

    return () => {
      subscription.unsubscribe();
    };
  }, [groups]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      refreshControl={renderRefreshingControl()}
    >
      <List.Section>
        {groups.map((group, index)=>(
          <List.Accordion
            key={index}
            title={`${group.name} (${group.users.length})`}
            description={group.description}
            descriptionStyle={{ marginTop: 10, fontSize: 12 }}
            expanded={group.isExpanded}
            onPress={()=>{
              group.isExpanded = !group.isExpanded;
              setGroups([...groups]);
            }}
          >
            {group.users.sort(sortBy('name', true)).sort(sortBy('isActive', true)).map((user)=>(
              <ListItem
                key={user.username}
                leftAvatar={{
                  title: `${user.name.substring(0, 1)}`,
                  borderRadius: 25,
                  width: 50,
                  height: 50,
                  color: 'red',
                  backgroundColor: Colors.light,
                  // source: { uri: `https://i.pravatar.cc/100?u=${user.username}` }
                }}
                title={user.name}
                subtitle={user.idNumber}
                subtitleStyle={styles.subtitle}
                bottomDivider
                chevron
                // badge={{
                //   // status: 'success',
                //   value: user.currentPoints/100,
                //   textStyle: styles.badgeText,
                //   badgeStyle: styles.badge,
                // }}
                onPress={() => navigation.navigate('User', user)}
              />
            ))}
          </List.Accordion>
        ))}
      </List.Section>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    color: Colors.light,
    paddingTop: 5,
  },
  badgeText: {
    color: '#ffffff',
    fontSize: 16,
    lineHeight: 16,
  },
  badge: {
    height: 25,
    padding: 5,
  },
});
