import React, { useEffect } from "react";
import { View, Image, StyleSheet } from "react-native";

const SplashScreen = ({ navigation }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace("Main");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/splash-bg.png")}
        style={styles.splashLogo}
      />
      <Image
        source={require("../assets/white-leo-logo.png")}
        style={styles.logo}
      />
      {/* <View style={styles.circle}></View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100vh",
    backgroundColor: "#204131",
    overflow: "hidden",
  },
  logo: {
    position: "absolute",
    top: "50%",
    left: "50%",
    width: "212px",
    height: "162px",
    transform: "translate(-50%, -50%)",
  },
  splashLogo: {
    width: "100%",
    resizeMode: "contain",
  },
  circle: {
    position: "absolute",
    width: "100px",
    height: "100px",
    borderRadius: "50%",
    boxShadow: "0px 0px 100px rgba(255, 255, 255, 0.1)",
    top: "8%",
    right: 0,
    zIndex: "-10",
  },
});

export default SplashScreen;
