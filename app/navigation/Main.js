import { BaseColor } from "@config";
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Jumpers from "@screens/Jumpers";
import Calculate from "@screens/Calculate";
import Export from "@screens/Export";
import React from "react";
import { connect } from "react-redux";
import { logout } from "@actions";

const Tab = createDrawerNavigator();
const Stack = createStackNavigator();

const horizontalAnimation = {
  cardStyleInterpolator: ({ current, layouts }) => {
    return {
      cardStyle: {
        transform: [
          {
            translateX: current.progress.interpolate({
              inputRange: [0, 1],
              outputRange: [layouts.screen.width, 0],
            }),
          },
        ],
      },
    };
  },
};
const DrawerContent = (props) => {
  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem labelStyle={{ color: "#000", fontSize: 18 }} label="Jumpers" onPress={() => props.navigation.navigate("Jumpers")} />
      <DrawerItem labelStyle={{ color: "#000", fontSize: 18 }} label="Calculate Height" onPress={() => props.navigation.navigate("Calculate")} />
      <DrawerItem labelStyle={{ color: "#000", fontSize: 18 }} label="Export to Excel" onPress={() => props.navigation.navigate("Export")} />
    </DrawerContentScrollView>
  );
}

const mapDispatchToProps = { logout }

const CustomDrawerContent = connect(null, mapDispatchToProps)(DrawerContent);

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={() => ({
        tabBarActiveTintColor: BaseColor.primaryColor,
        tabBarInactiveTintColor: BaseColor.blackColor,
      })}
      drawerContent={(props) => <CustomDrawerContent {...props} />}

    >
      <Tab.Screen name="Jumpers" component={Jumpers} />
      <Tab.Screen name="Calculate" component={Calculate} />
      <Tab.Screen name="Export" component={Export} />
    </Tab.Navigator>
  )
}

export default function Main() {
  const _NAVIGATIONS = {
    TabNavigator,
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
        {Object.entries(_NAVIGATIONS).map(([key, value]) => <Stack.Screen name={key} key={key} component={value} options={horizontalAnimation} />)}
      </Stack.Navigator>
    </NavigationContainer>
  )
}
