import React from "react";
import { View, Image, ScrollView } from "react-native";
function HeaderAD() {
  return (
    <ScrollView style={{ marginTop: 40 }}>
      <View style={{ backgroundColor: "#6F6B65", width: "100%", height: 50 }}>
        <Image
          source={require("../assets/Logo/headLogo.png")}
          style={{
            height: "100%",
            width: "15%",
            alignSelf: "center",
            marginTop: 2,
          }}
        />
      </View>
    </ScrollView>
  );
}

export default HeaderAD;
