// import React, { useState } from "react";
// import { StatusBar } from "expo-status-bar";
// import {
//   StyleSheet,
//   Text,
//   View,
//   ScrollView,
//   TouchableOpacity,
//   Image,
// } from "react-native";

// const regions = [
//   "Fingertips",
//   "Fingers (excl. tips)",
//   "Palm of hands",
//   "Back of hands",
//   "Wrists",
// ];
// const signs = [
//   "erythema",
//   "infiltration",
//   "vesicles",
//   "fissures",
//   "scaling",
//   "oedema",
// ];
// const areaOptions = [
//   { label: "0% (0)", value: 0 },
//   { label: "1-25% (1)", value: 1 },
//   { label: "26-50% (2)", value: 2 },
//   { label: "51-75% (3)", value: 3 },
//   { label: "76-100% (4)", value: 4 },
// ];
// const severityImages = {
//   erythema: [
//     require("../assets/Erythema-0.jpg"),
//     require("../assets/Erythema-1.jpg"),
//     require("../assets/Erythema-2.jpg"),
//     require("../assets/Erythema-3.jpg"),
//   ],
//   infiltration: [
//     require("../assets/Infiltration-0.jpg"),
//     require("../assets/Infiltration-1.jpg"),
//     require("../assets/Infiltration-2.jpg"),
//     require("../assets/Infiltration-3.jpg"),
//   ],
//   vesicles: [
//     require("../assets/Vesicles-0.jpg"),
//     require("../assets/Vesicles-1.jpg"),
//     require("../assets/Vesicles-2.jpg"),
//     require("../assets/Vesicles-3.jpg"),
//   ],
//   fissures: [
//     require("../assets/Fissures-0.jpg"),
//     require("../assets/Fissures-1.jpg"),
//     require("../assets/Fissures-2.jpg"),
//     require("../assets/Fissures-3.jpg"),
//   ],
//   scaling: [
//     require("../assets/Scaling-0.jpg"),
//     require("../assets/Scaling-1.jpg"),
//     require("../assets/Scaling-2.jpg"),
//     require("../assets/Scaling-3.jpg"),
//   ],
//   oedema: [
//     require("../assets/Oedema-0.jpg"),
//     require("../assets/Oedema-1.jpg"),
//     require("../assets/Oedema-2.jpg"),
//     require("../assets/Oedema-3.jpg"),
//   ],
// };

// export default function Calculator() {
//   const [regionData, setRegionData] = useState(
//     regions.reduce((acc, region) => {
//       acc[region] = {
//         areaScore: 0,
//         erythema: 0,
//         infiltration: 0,
//         vesicles: 0,
//         fissures: 0,
//         scaling: 0,
//         oedema: 0,
//       };
//       return acc;
//     }, {})
//   );

//   const updateRegion = (region, field, value) => {
//     setRegionData((prev) => ({
//       ...prev,
//       [region]: {
//         ...prev[region],
//         [field]: value,
//       },
//     }));
//   };

//   const calculateHECSIScore = () => {
//     let total = 0;
//     for (let region of regions) {
//       const data = regionData[region];
//       console.log(data, "data");
//       const severitySum = signs.reduce((sum, sign) => sum + data[sign], 0);
//       console.log(severitySum, "severitySum");

//       total += data.areaScore * severitySum;
//       console.log(total, "total");
//     }
//     return total;
//   };

//   const resetScore = () => {
//   const initialState = regions.reduce((acc, region) => {
//     acc[region] = {
//       areaScore: 0,
//       erythema: 0,
//       infiltration: 0,
//       vesicles: 0,
//       fissures: 0,
//       scaling: 0,
//       oedema: 0,
//     };
//     return acc;
//   }, {});
//   setRegionData(initialState);
// };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.header}>HECSI Score: {calculateHECSIScore()}</Text>

//       <TouchableOpacity style={styles.resetButton} onPress={resetScore}>
//   <Text style={styles.resetButtonText}>Reset Score</Text>
// </TouchableOpacity>

//       {regions.map((region) => (
//         <View key={region} style={styles.card}>
//           <Text style={styles.region}>{region}</Text>

//           <View style={styles.row}>
//             <Text style={styles.label}>Area Score:</Text>
//               <View style={styles.btncontainer}>
//             {areaOptions.map((opt) => (
//               <TouchableOpacity
//                 key={opt.value}
//                 onPress={() => updateRegion(region, "areaScore", opt.value)}
//                 style={[
//                   styles.areaButton,
//                   regionData[region].areaScore === opt.value &&
//                     styles.selectedButton,
//                 ]}
//               >
//                 <Text>{opt.label}</Text>
//               </TouchableOpacity>
//             ))}
//                </View>
//           </View>

//           {signs.map((sign) => (
//             <View key={sign} style={styles.signRow}>
//               <Text style={styles.label}>
//                 {sign.charAt(0).toUpperCase() + sign.slice(1)}:
//               </Text>
//               <View style={styles.btncontainer}>

//               {[0, 1, 2, 3].map((val) => (
//                 <TouchableOpacity
//                   key={val}
//                   onPress={() => updateRegion(region, sign, val)}
//                   style={[
//                     styles.imageButton,
//                     regionData[region][sign] === val &&
//                       styles.selectedImageButton,
//                   ]}
//                 >
//                   <Image
//                     source={severityImages[sign][val]}
//                     style={styles.image}
//                   />
//                 </TouchableOpacity>
//               ))}
//               </View>
//             </View>
//           ))}
//         </View>
//       ))}

//       <StatusBar style="auto" />
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//  container: {
//     marginTop: 40,
//     paddingHorizontal: 12,
//     paddingBottom: 30,
//     backgroundColor: "#f2f9ff",
//     flex: 1,
//   },
//   header: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 20,
//     color: "#007acc",
//     paddingTop:15
//   },
//   card: {
//     backgroundColor: "#fff",
//     padding: 14,
//     borderRadius: 12,
//     marginBottom: 25,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 3,
//   },
//   region: {
//     fontSize: 22,
//     fontWeight: "600",
//     marginBottom: 10,
//     color: "#007acc",
//   },
//   row: {
//     marginBottom: 12,
//   },
//   btncontainer : {
//     display:"flex",
//     flexDirection:"row",
//     justifyContent:"flex-start",
//     flexWrap:"wrap",
//   },
//   label: {
//     fontWeight: "500",
//     marginBottom: 6,
//     marginRight: 10,
//     fontSize: 14,
//     color: "#333",
//     minWidth: 100,
//   },
//   areaButton: {
//     width:"max-content",
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     margin: 4,
//     backgroundColor: "#e3f0ff",
//     borderRadius: 6,
//     borderWidth: 1,
//     borderColor: "#cce6ff",
//   },
//   selectedButton: {
//     backgroundColor: "#007acc",
//     borderColor: "#005f99",
//   },
//   signRow: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   imageButton: {
//     padding: 2,
//     margin: 4,
//     borderWidth: 1,
//     borderColor: "#ccc",
//   },
//   selectedImageButton: {
//     borderColor: "#007acc",
//     borderWidth: 2,
//   },
//   image: {
//     width: 50,
//     height: 50,
//     resizeMode: "contain",
//   },
//   resetButton: {
//   backgroundColor: "#e63946",
//   paddingVertical: 5,
//   paddingHorizontal: 10,
//   borderRadius: 8,
//   alignItems: "center",
//   marginBottom: 20,

//   alignSelf: "center",
// },
// resetButtonText: {
//   color: "#fff",
//   fontSize: 10,
//   fontWeight: "bold",
// },
// });

// ================================================================Updated Code================================================

import { useFonts } from "expo-font";
import { useState } from "react";
import { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Easing,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Animated } from "react-native";

const regions = [
  "Fingertips",
  "Fingers (excl. tips)",
  "Palm of hands",
  "Back of hands",
  "Wrists",
];

const regionIcons = {
  Fingertips: require("../assets/fingertips-icon.svg"),
  "Fingers (excl. tips)": require("../assets/excltips-icon.svg"),
  "Palm of hands": require("../assets/palmofhands-icon.svg"),
  "Back of hands": require("../assets/backofhands-icon.svg"),
  Wrists: require("../assets/wrists-icon.svg"),
};

const signs = [
  "erythema",
  "infiltration",
  "vesicles",
  "fissures",
  "scaling",
  "oedema",
];

const areaOptions = [
  { label: "0%(0)", value: 0 },
  { label: "1-25%(1)", value: 1 },
  { label: "26-50%(2)", value: 2 },
  { label: "76-100%(4)", value: 4 },
];

const severityImages = {
  erythema: [
    require("../assets/Erythema-0.jpg"),
    require("../assets/Erythema-1.jpg"),
    require("../assets/Erythema-2.jpg"),
    require("../assets/Erythema-3.jpg"),
  ],
  infiltration: [
    require("../assets/Infiltration-0.jpg"),
    require("../assets/Infiltration-1.jpg"),
    require("../assets/Infiltration-2.jpg"),
    require("../assets/Infiltration-3.jpg"),
  ],
  vesicles: [
    require("../assets/Vesicles-0.jpg"),
    require("../assets/Vesicles-1.jpg"),
    require("../assets/Vesicles-2.jpg"),
    require("../assets/Vesicles-3.jpg"),
  ],
  fissures: [
    require("../assets/Fissures-0.jpg"),
    require("../assets/Fissures-1.jpg"),
    require("../assets/Fissures-2.jpg"),
    require("../assets/Fissures-3.jpg"),
  ],
  scaling: [
    require("../assets/Scaling-0.jpg"),
    require("../assets/Scaling-1.jpg"),
    require("../assets/Scaling-2.jpg"),
    require("../assets/Scaling-3.jpg"),
  ],
  oedema: [
    require("../assets/Oedema-0.jpg"),
    require("../assets/Oedema-1.jpg"),
    require("../assets/Oedema-2.jpg"),
    require("../assets/Oedema-3.jpg"),
  ],
};

const Calculator = ({ navigation }) => {
  const [fontsLoaded] = useFonts({
    "Gilroy-Semibold": require("../assets/fonts/Gilroy-Semibold.ttf"),
  });

  const [selectedRegion, setSelectedRegion] = useState("Fingertips");
  const [expandedSign, setExpandedSign] = useState("erythema");
  const [toggle, setToggle] = useState(false);

  const [regionData, setRegionData] = useState(
    regions.reduce((acc, region) => {
      acc[region] = {
        areaScore: 0,
        erythema: 0,
        infiltration: 0,
        vesicles: 0,
        fissures: 0,
        scaling: 0,
        oedema: 0,
      };
      return acc;
    }, {})
  );

  const updateRegion = (region, field, value) => {
    setRegionData((prev) => ({
      ...prev,
      [region]: {
        ...prev[region],
        [field]: value,
      },
    }));
  };

  const calculateHECSIScore = () => {
    let total = 0;
    for (const region of regions) {
      const data = regionData[region];
      const severitySum = signs.reduce((sum, sign) => sum + data[sign], 0);
      total += data.areaScore * severitySum;
    }
    return total;
  };

  const resetScore = () => {
    const initialState = regions.reduce((acc, region) => {
      acc[region] = {
        areaScore: 0,
        erythema: 0,
        infiltration: 0,
        vesicles: 0,
        fissures: 0,
        scaling: 0,
        oedema: 0,
      };
      return acc;
    }, {});
    setRegionData(initialState);
    setSelectedRegion(regions[0]);
    setExpandedSign(signs[0]);
  };

  const toggleSign = (sign) => {
    if (expandedSign === sign) {
      setExpandedSign(null);
    } else {
      setExpandedSign(sign);
    }
  };

  if (!fontsLoaded) {
    return null;
  }

  const animationRefs = useRef(
    signs.reduce((acc, sign) => {
      acc[sign] = new Animated.Value(sign === expandedSign ? 1 : 0);
      return acc;
    }, {})
  );

  useEffect(() => {
    signs.forEach((sign) => {
      Animated.timing(animationRefs.current[sign], {
        toValue: expandedSign === sign ? 1 : 0,
        duration: 300,
        easing: Easing.out(Easing.ease),
        useNativeDriver: false,
      }).start();
    });
  }, [expandedSign]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{selectedRegion}</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.menuButton} onPress={resetScore}>
            <Image
              source={require("../assets/reset-icon.svg")}
              style={styles.menu}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() => navigation.openDrawer()}
          >
            <Image source={require("../assets/menu.svg")} style={styles.menu} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* HECSI Score Card */}
          <View style={styles.scoreCard}>
            <Text style={styles.scoreText}>
              HECSI Score: {calculateHECSIScore()}
            </Text>
          </View>

          {/* Area Score */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>Area Score:</Text>
            <View style={styles.areaOptionsContainer}>
              {areaOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.areaOption,
                    regionData[selectedRegion].areaScore === option.value &&
                      styles.selectedAreaOption,
                  ]}
                  onPress={() =>
                    updateRegion(selectedRegion, "areaScore", option.value)
                  }
                >
                  <Text
                    style={[
                      styles.areaOptionText,
                      regionData[selectedRegion].areaScore === option.value &&
                        styles.selectedAreaOptionText,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Signs */}
          {signs.map((sign) => (
            <View key={sign} style={styles.signContainer}>
              <TouchableOpacity
                style={styles.signHeader}
                onPress={() => toggleSign(sign)}
              >
                <Text style={styles.signTitle}>
                  {sign.charAt(0).toUpperCase() + sign.slice(1)}:
                </Text>
                <MaterialIcons
                  name={expandedSign === sign ? "remove" : "add"}
                  size={24}
                  color="#666"
                />
              </TouchableOpacity>
              {expandedSign === sign && (
                <Animated.View
                  style={{
                    overflow: "hidden",
                    height: animationRefs.current[sign].interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 120],
                    }),
                    opacity: animationRefs.current[sign],
                  }}
                >
                  <View style={styles.signImagesContainer}>
                    {[0, 1, 2, 3].map((val) => (
                      <TouchableOpacity
                        key={val}
                        style={[
                          styles.imageButton,
                          regionData[selectedRegion][sign] === val &&
                            styles.selectedImageButton,
                        ]}
                        onPress={() => updateRegion(selectedRegion, sign, val)}
                      >
                        <Image
                          source={severityImages[sign][val]}
                          style={styles.image}
                        />
                      </TouchableOpacity>
                    ))}
                  </View>
                </Animated.View>
              )}
            </View>
          ))}

          {/* Region Navigation */}
          <View style={styles.regionNavigation}>
            {regions
              .filter((region) => region !== selectedRegion)
              .map((region) => (
                <TouchableOpacity
                  key={region}
                  style={styles.regionButton}
                  onPress={() => setSelectedRegion(region)}
                >
                  <View style={styles.regionIconContainer}>
                    <Image source={regionIcons[region]} />
                  </View>
                  <Text style={styles.regionButtonText}>{region}</Text>
                </TouchableOpacity>
              ))}
          </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 33,
    backgroundColor: "#204131",
  },
  headerTitle: {
    fontSize: "28px",
    fontWeight: "bold",
    color: "white",
    fontFamily: "Gilroy-Semibold",
    flex: 1,
  },
  headerButtons: {
    width: "max-content",
    flexDirection: "row",
    gap: 10,
  },
  menuButton: {
    width: 44,
    height: 44,
    border: "1px solid #fff",
    borderRadius: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    backgroundColor: "#ffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  content: {
    padding: 20,
  },
  scoreCard: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 15,
    alignItems: "center",
    marginBottom: 20,
    border: "1px solid #D3D3D3",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  scoreText: {
    fontSize: "22px",
    fontFamily: "Gilroy-Semibold",
    color: "#204131",
  },
  sectionContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: "22px",
    fontFamily: "Gilroy-Semibold",
    color: "#000",
    marginBottom: 10,
  },
  areaOptionsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  areaOption: {
    maxWidth: "calc(100% / 4 - 8px)",
    backgroundColor: "white",
    borderRadius: 6,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 20,
    border: "1px solid #D3D3D3",
  },
  selectedAreaOption: {
    backgroundColor: "#204131",
  },
  areaOptionText: {
    color: "#454545",
    fontFamily: "Gilroy-Semibold",
    fontSize: "14px",
    textAlign: "center",
  },
  selectedAreaOptionText: {
    color: "white",
    fontFamily: "Gilroy-Semibold",
    fontSize: "14px",
  },
  signContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    marginBottom: 10,
    elevation: 1,
    border: "1px solid #D3D3D3",
  },
  signHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
  },
  signTitle: {
    fontSize: "16px",
    fontFamily: "Gilroy-Semibold",
    color: "#454545",
  },
  signImagesContainer: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
  },
  imageButton: {
    borderWidth: 2,
    borderColor: "transparent",
    overflow: "hidden",
    width: "23%",
    aspectRatio: 1,
  },
  selectedImageButton: {
    borderColor: "#006837",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  regionNavigation: {
    flex: 1,
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
    overflow: "scroll",
  },
  regionButton: {
    minWidth: "150px",
    border: "1px solid #D3D3D3",
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    width: "max-content",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  regionIconContainer: {
    marginBottom: 10,
    backgroundColor: "#204131",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 50,
  },
  regionButtonText: {
    fontSize: "16px",
    fontFamily: "Gilroy-Semibold",
    color: "#204131",
    textAlign: "center",
  },
});

export default Calculator;
