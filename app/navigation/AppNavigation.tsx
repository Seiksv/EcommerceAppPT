import React from "react";
import {
  NavigationContainer,
  NavigationIndependentTree,
} from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useAuth } from "../store/AuthContext";
import Icon from "react-native-vector-icons/FontAwesome";
import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";

import { LoginScreen } from "../screens/LoginScreen";
import { ProductsScreen } from "../screens/ProductsScreen";
import { ProductDetailScreen } from "../screens/ProductDetailScreen";
import { ProfileScreen } from "../screens/ProfileScreen";
import { SearchScreen } from "../screens/SearchScreen";

export type RootStackParamList = {
  Login: undefined;
  MainApp: undefined;
  ProductDetail: { productId: number };
};

export type MainTabParamList = {
  Products: undefined;
  Search: undefined;
  Profile: undefined;
  ProductDetail: { productId: number };
};

const Stack = createStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

export type ProductsScreenProps = BottomTabScreenProps<
  MainTabParamList,
  "Products"
>;

const MainTabNavigator = () => {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="Products"
        component={ProductsScreen as React.ComponentType<object>}
        options={{
          title: "Products",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="box" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen as React.ComponentType<object>}
        options={{
          title: "Search",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="search" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen as React.ComponentType<object>}
        options={{
          title: "Profile",
          headerShown: false,
          tabBarIcon: ({ color, size }) => (
            <Icon name="user" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

type AppNavigationProps = {};

export const AppNavigation: React.FC<AppNavigationProps> = () => {
  const { isAuthenticated } = useAuth();
  return (
    <NavigationIndependentTree>
      <NavigationContainer>
        <Stack.Navigator>
          {!isAuthenticated ? (
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ headerShown: false }}
            />
          ) : (
            <>
              <Stack.Screen
                name="MainApp"
                component={MainTabNavigator}
                options={{ title: "EcommerceApp" }}
              />
              <Stack.Screen
                name="ProductDetail"
                component={ProductDetailScreen}
                options={({ route }) => ({
                  title: `Product ${route.params.productId}`,
                })}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};
