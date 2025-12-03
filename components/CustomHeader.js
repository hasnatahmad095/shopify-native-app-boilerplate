import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const CustomHeader = ({ navigation }) => {
  return (
    <View style={styles.header}>
      <View style={styles.logoContainer}>
        <Image
          source={require("../assets/white-leo-logo.png")}
          style={styles.logo}
        />
      </View>
      <TouchableOpacity
        style={styles.menuButton}
        onPress={() => navigation.openDrawer()}
      >
        <Image source={require("../assets/menu.svg")} style={styles.menu} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#204131",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: "contain",
  },

  menuButton: {
    paddingHorizontal: 10,
    paddingVertical: 14,
    border: "1px solid #fff",
    borderRadius: "100%",
  },
});

export default CustomHeader;
