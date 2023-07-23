import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Router from "./router";
import { Provider } from "react-redux";
import store from "./Store/store";

function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: "#FDF3E6" }}>
      <NavigationContainer style={{ flex: 1, backgroundColor: "#FDF3E6" }}>
        <Provider store={store}>
          <Router></Router>
        </Provider>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

export default App;
