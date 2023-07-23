import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import axios from "axios";
import { useEffect, useRef } from "react";
import { WebView } from "react-native-webview";
import { BASE_URL } from "../config/api";

export default function MidtransPayment({
  redirect_url,
  setSubProcess,
  subProcess,
}) {
  const navigation = useNavigation();
  const isMounted = useRef(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);
  return (
    <WebView
      javaScriptEnabled={true}
      javaScriptCanOpenWindowsAutomatically={true}
      domStorageEnabled={true}
      cacheEnabled={true}
      allowFileAccessFromFileURLs={true}
      allowFileAccess={true}
      cacheMode="LOAD_NO_CACHE"
      source={{ uri: redirect_url }}
      onShouldStartLoadWithRequest={(event) => {
        let match = event.url.match(/(?<=transaction_status=)[^&]+/);
        let transaction_status = match ? match[0] : null;
        console.log(transaction_status);
        if (transaction_status === "settlement" && isMounted.current) {
          setSubProcess?.({
            ...subProcess,
            pending: false,
            paid: true,
          });
          (async () => {
            const token = await AsyncStorage.getItem("access_token");
            const config = {
              headers: {
                access_token: token,
              },
            };
            const { data } = await axios.patch(
              `${BASE_URL}/midtrans/success`,
              {},
              config
            );
            await AsyncStorage.setItem("premium", "true");
            console.log(data);
          })();
          navigation.navigate("Account");
          return false;
        }
        return true;
      }}
    />
  );
}
