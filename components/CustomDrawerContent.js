import { View, Text, StyleSheet, TouchableOpacity, Image, SafeAreaView, ScrollView } from "react-native"
import { MaterialIcons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"

const CustomDrawerContent = ({ navigation }) => {
  const menuItems = [
    {
      name: "Calculator",
      label: "HECSI Calculator",
      icon:  require("../assets/calculator-icon.svg"),
      route: "Calculator",
    },
    {
      name: "Privacy Policy",
      label: "Privacy Statement",
      icon: require("../assets/privacy-icon.svg"),
      route: "Privacy Policy",
    },
    {
      name: "Terms Conditions",
      label: "Terms of Use",
      icon: require("../assets/terms-icon.svg"),
      route: "Terms Conditions",
    },
    {
      name: "Cart",
      label: "Cart",
      icon: require("../assets/terms-icon.svg"),
      route: "Cart",
    },
  ]

  const handleNavigation = (route) => {
    navigation.navigate(route)
    navigation.closeDrawer()
  }

  return (
    <SafeAreaView style={styles.container}>
      <BlurView intensity={90} tint="light"  style={styles.drawerContent}>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/leo-green-logo.png")} style={styles.logo} />
          </View>
          <TouchableOpacity style={styles.closeButton} onPress={() => navigation.closeDrawer()}>
            <MaterialIcons name="close" size={30} color="#204131" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <TouchableOpacity key={index} style={styles.menuItem} onPress={() => handleNavigation(item.route)}>
                <Image source={item.icon} style={styles.iconimages} />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </BlurView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.3)", 
  },
  drawerContent: {
    flex: 1,
    backgroundColor: "rgb(255, 255, 255)",
    marginLeft: 50, 
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 25,
    paddingVertical: 30,
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 80,
    height: 60,
    resizeMode: "contain",
  },
  closeButton: {
    padding: 5,
  },
  menuContainer: {
    flex: 1,
    paddingTop: 20,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginHorizontal: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  menuText: {
    fontSize: 20,
    color: "#454545",
    fontWeight: "500",
  },
   iconimages : {
    width: 24,
    height: 24,
    marginRight: 15,
  },
})

export default CustomDrawerContent
