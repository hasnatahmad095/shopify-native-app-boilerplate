import { useFonts } from "expo-font";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "Gilroy-Semibold": require("../assets/fonts/Gilroy-Semibold.ttf"),
  });

  if (!fontsLoaded) {
    return null; 
  }

  return (
    <SafeAreaView style={styles.container}>

      <ScrollView style={styles.scrollView}>
        <View style={styles.card}>
          <Text style={styles.title}>HECSI</Text>
          <Text style={styles.description}>
            The Hand Eczema Severity Index (HECSI) score for the clinical
            assessment of hand eczema severity, was developed and published
            first time in 2005.
          </Text>
          <Text style={styles.description}>
            The HECSI score incorporates the extent of the eczema of both hands
            and six different clinical signs (for details, please see the
            Training module).
          </Text>

          {/* <View style={styles.gridContainer}>
            <View style={styles.row}>
              <TouchableOpacity style={styles.gridItem}>
                <View style={styles.iconContainer}>
                  <Image source={require("../assets/fingertips-icon.svg")} />
                </View>
                <Text style={styles.gridItemText}>Fingertips</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem}>
                <View style={styles.iconContainer}>
                  <Image source={require("../assets/excltips-icon.svg")} />
                </View>
                <Text style={styles.gridItemText}>Fingertips (excl tips)</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity style={styles.gridItem}>
                <View style={styles.iconContainer}>
                  <Image source={require("../assets/palmofhands-icon.svg")} />
                </View>

                <Text style={styles.gridItemText}>Palm of Hands</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.gridItem}>
                <View style={styles.iconContainer}>
                  <Image source={require("../assets/backofhands-icon.svg")} />
                </View>
                <Text style={styles.gridItemText}>Back of Hands</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.gridItem, styles.singleGridItem]}
              >
                <View style={styles.iconContainer}>
                  <Image source={require("../assets/wrists-icon.svg")} />
                </View>
                <Text style={styles.gridItemText}>Wrists</Text>
              </TouchableOpacity>
            </View>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#204131",
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: "100%",
  },
  title: {
    fontSize: "28px",
    fontWeight: "400",
    fontFamily: "Gilroy-Semibold",
    marginBottom: 10,
    color: "#204131",
  },
  description: {
    fontSize: "16px",
    color: "#454545",
    fontFamily: "Gilroy-Semibold",
    marginBottom: 10,
    lineHeight: 20,
  },
  gridContainer: {
    marginTop: 20,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  gridItem: {
    width: "48%",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 20,
    alignItems: "center",
  },
  singleGridItem: {
    width: "48%",
  },
  iconContainer: {
    marginBottom: 10,
    backgroundColor: "#204131",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 50,
  },

  gridItemText: {
    textAlign: "center",
    fontFamily: "Gilroy-Semibold",
    fontSize: 14,
    color: "#204131",
  },
});

export default HomeScreen;