import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";

import HomeScreen from "../Screen/HomeScreen";
import LoginScreen from "../Screen/LoginScreen";
import RegisterScreen from "../Screen/RegisterScreen";
import ArcadeList from "../Screen/ArcadeList";
import InboxScreen from "../Screen/InboxScreen";
import ArcadeDetail from "../Screen/ArcadeDetail";
import CreateArcade from "../Screen/AddArcade";
import MessageScreen from "../Screen/MessageScreen";
import EditProfileScreen from "../Screen/ProfileScreen";
import BookmarkList from "../Screen/BookmarkScreen";
import GameList from "../Screen/GameScreen";
import FollowerList from "../Screen/FollowerScreen";
import FollowingList from "../Screen/FollowingScreen";
import UserProfile from "../Screen/UserProfile";
import SearchAccount from "../Screen/SearchAccount";
import UserSchedule from "../Screen/UserSchedule";
import OtherProfile from "../Screen/OtherProfile";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const Router = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    checkAuthentication();
  }, []);

  const checkAuthentication = async () => {
    try {
      const token = await AsyncStorage.getItem("access_token");
      setIsAuthenticated(!!token);
    } catch (error) {
      console.log(error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("access_token");
      setIsAuthenticated(false);
      navigation.navigate("Login");
    } catch (error) {
      console.log(error);
    }
  };

  if (!isAuthenticated) {
    return (
      <Stack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Dashboard" component={Router} />
      </Stack.Navigator>
    );
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Arcade List") {
            iconName = focused ? "rocket" : "rocket-outline";
          } else if (route.name === "Create") {
            iconName = "game-controller";
          } else if (route.name === "Inbox") {
            iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          } else if (route.name === "Account") {
            iconName = focused ? "person" : "person-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Arcade List" component={ArcadeList} />
      <Tab.Screen name="Create" component={CreateArcade} />
      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen name="Account">
        {() => <UserProfile handleLogout={handleLogout} />}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator screenOptions={({ route }) => ({ headerShown: false })}>
      <Stack.Screen name="Dashboard" component={HomeScreen} />
      <Stack.Screen name="GameList" component={GameList} />
      <Stack.Screen name="Bookmark" component={BookmarkList} />
      <Stack.Screen name="SearchAccount" component={SearchAccount} />
      <Stack.Screen name="UserSchedule" component={UserSchedule} />
      <Stack.Screen name="ArcadeDetail" component={ArcadeDetail} />
      <Stack.Screen name="Profile" component={EditProfileScreen} />
      <Stack.Screen name="Follower" component={FollowerList} />
      <Stack.Screen name="Following" component={FollowingList} />
      <Stack.Screen name="VisitAccount" component={OtherProfile} />
      <Stack.Screen name="Message" component={MessageScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
};

const TabBar = ({ state, descriptors, navigation }) => {
  const centerButtonHandler = () => {
    navigation.navigate("Create");
  };

  return (
    <View style={styles.container}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const { tabBarIcon: TabIcon } = options;
        const isFocused = state.index === index;

        if (route.name === "Create") {
          return (
            <TouchableOpacity
              key={route.key}
              onPress={centerButtonHandler}
              style={styles.centerButtonContainer}
            >
              <View style={styles.centerButton}>
                {TabIcon && (
                  <TabIcon
                    name={route.name}
                    focused={isFocused}
                    size={24}
                    color="#5A5A5A"
                  />
                )}
              </View>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => navigation.navigate(route.name)}
            style={styles.tabContainer}
          >
            {TabIcon && (
              <TabIcon
                name={route.name}
                focused={isFocused}
                size={30}
                color={isFocused ? "black" : "gray"}
              />
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    backgroundColor: "white",
    height: 60,
    elevation: 8,
  },
  tabContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
  },
  centerButtonContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    top: -40,
    width: 80,
    height: 80,
    borderRadius: 30,
    backgroundColor: "#666666",
    elevation: 8,
  },
  centerButton: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FDF3E6",
  },
});

export default Router;
