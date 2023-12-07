// App.js

import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerList from './src/components/customerList';

const Stack = createStackNavigator();

const App = () => {
  const [customers, setCustomers] = useState([]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="CustomerListing">
        <Stack.Screen
          name="CustomerList"
          component={CustomerList}
          options={{ headerShown: false, }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
