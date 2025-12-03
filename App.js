import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Calculator from "./screens/Calculator";
import PrivacyPolicy from "./screens/PrivacyPolicy";
import TermsConditions from "./screens/TermsConditions";
import About from "./screens/About";
import HomeScreen from "./screens/HomeScreen";
import SplashScreen from "./screens/SplashScreen";
import CustomHeader from "./components/CustomHeader";
import { StatusBar } from "react-native";
import CustomDrawerContent from "./components/CustomDrawerContent";
import Cart from "./screens/Cart";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import CheckoutWebView from "./screens/CheckoutWebView";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

function DrawerNavigator() {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={({ route }) => ({
        // header: (props) => <CustomHeader {...props} />,
        header: (props) => {
          if (
            route.name === "Privacy Policy" ||
            route.name === "Terms Conditions" ||
            route.name === "Calculator"
          ) {
            return null;
          }
          return <CustomHeader {...props} />;
        },
        headerShown:
          route.name !== "Privacy Policy" ||
          route.name !== "Terms Conditions" ||
          route.name !== "Calculator",
        drawerPosition: "right",
        drawerStyle: {
          backgroundColor: "transparent",
          width: "100%",
        },
        overlayColor: "rgba(0, 0, 0, 0.3)",
      })}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Calculator" component={Calculator} />
      <Drawer.Screen name="Privacy Policy" component={PrivacyPolicy} />
      <Drawer.Screen name="Terms Conditions" component={TermsConditions} />
      <Drawer.Screen name="About" component={About} />
      <Drawer.Screen name="Cart" component={Cart} />
      <Drawer.Screen name="CheckoutWebView" component={CheckoutWebView} />
    </Drawer.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="light-content" backgroundColor="#204131" />
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Main" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
