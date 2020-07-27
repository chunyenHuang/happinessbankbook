import React, { useState, useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { AsyncStorage } from 'react-native';

import CustomHeader from 'components/CustomHeader';
import routes from './routes';

const filterRoutes = routes.filter((x) => x.type === 'stack');

const Stack = createStackNavigator();

export default function StackNavigator({ navigation, route }) {
  const [stacks, setStacks] = useState(filterRoutes.filter(({ groups }) => groups.includes('All')));

  navigation.setOptions({
    header: ({ previous, navigation }) => {
      const { title, rightComponent } = getHeaderProps(route);

      return (
        <CustomHeader
          title={title}
          leftComponent={{
            icon: 'arrow-back',
            color: '#fff',
            onPress: () => {
              previous && navigation.goBack();
            },
          }}
          rightComponent={rightComponent}
        />
      );
    },
  });

  useEffect(() => {
    (async () => {
      const [group] = await Promise.all([
        AsyncStorage.getItem('app:group'),
      ]);
      setStacks(filterRoutes.filter(({ groups }) => groups.includes(group) || groups.includes('All')));
    })();
  }, []);

  return (
    <Stack.Navigator>
      {stacks.map(({ name, component, options = {} }, index) => (
        <Stack.Screen
          key={index}
          name={name}
          component={component}
          options={options}
        />
      ))}
    </Stack.Navigator>
  );
}

function getHeaderProps(route) {
  /* beautify ignore:start */
  const routeName = route.state?.routes[route.state.index]?.name??'';
  /* beautify ignore:end */

  const { title, rightComponent } = filterRoutes.find(({ name }) => name === routeName) || {};

  return {
    title,
    rightComponent,
  };
}