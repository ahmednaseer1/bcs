import React, { useEffect, useState, useRef } from "react";
import { View, Text, Dimensions, Modal, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { getDistance } from 'geolib';
import { GOOGLE_MAPS_API_KEY } from "@env";
import MapView, { Marker, Polyline } from "react-native-maps";
import * as Location from "expo-location";
import polyline from "@mapbox/polyline";
import { MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import Geocoder from 'react-native-geocoding';

Geocoder.init(GOOGLE_MAPS_API_KEY); // Replace with your actual Google Maps API key


const { width, height } = Dimensions.get("screen");

const decodePolyline = (encoded) => {
  return polyline.decode(encoded).map((point) => ({
    latitude: point[0],
    longitude: point[1],
  }));
};

const HomeScreen = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [pickUpLocation, setPickUpLocation] = useState(null);
  const [dropLocation, setDropLocation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [activeField, setActiveField] = useState(null);
  const [inputValue, setInputValue] = useState("");
  const [currentLoc, setCurrentLoc] = useState(null);
  const [directions, setDirections] = useState(null);
  const [fare, setFare] = useState(null);
  const [eta, setEta] = useState(null);
  const [pickUpAddress, setPickUpAddress] = useState(null)
  const [dropAddress, setDropAddress] = useState(null);
  const [ride, setRide] = useState ('bike')
  const mapRef = useRef(null);

  const GOOGLE_API_KEY = GOOGLE_MAPS_API_KEY;

  const openModal = (field, currentValue) => {
    setActiveField(field);
    setInputValue(currentValue ? JSON.stringify(currentValue) : "");
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setActiveField(null);
    setSuggestions([]);
  };

  const handleSave = async () => {
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json`,
        {
          params: {
            address: inputValue,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const location = response.data.results[0]?.geometry.location; // Get lat/lng
      if (!location) {
        Alert.alert("Error", "Unable to fetch location.");
        return;
      }

      const formattedLocation = {
        latitude: location.lat,
        longitude: location.lng,
      };

      if (activeField === "pickUpLocation") setPickUpLocation(formattedLocation);
      else if (activeField === "dropLocation") setDropLocation(formattedLocation);

      closeModal();
    } catch (error) {
      console.error("Error saving location:", error);
      Alert.alert("Error", "Failed to fetch location.");
    }
  };

  const updateSuggestions = async (text) => {
    if (text.trim() === "") {
      setSuggestions([]);
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
        {
          params: {
            input: text,
            key: GOOGLE_MAPS_API_KEY,
            types: "geocode",
            components: "country:in",
          },
        }
      );
      const predictions = response.data.predictions;
      setSuggestions(predictions.map((place) => place.description));
    } catch (error) {
      console.error("Error fetching suggestions:", error);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert("Permission to access location was denied");
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setCurrentLoc({
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        });
      } catch (error) {
        console.error("Error getting location:", error);
      }
    })();
  }, []);

  const getDirections = async () => {
    if (!pickUpLocation || !dropLocation) {
      return;
    }

    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json`,
        {
          params: {
            origin: `${pickUpLocation.latitude},${pickUpLocation.longitude}`,
            destination: `${dropLocation.latitude},${dropLocation.longitude}`,
            key: GOOGLE_API_KEY,
          },
        }
      );

      const points = response.data.routes[0]?.overview_polyline?.points;
      if (points) {
        const decodedPoints = decodePolyline(points);
        setDirections(decodedPoints);
      } else {
        Alert.alert("Error", "No directions found.");
      }
    } catch (error) {
      console.error("Error fetching directions:", error);
      Alert.alert("Error", "Failed to fetch directions.");
    }
  };

  const calculateFare = () => {
    if (!pickUpLocation || !dropLocation) return;
  
    const distance = getDistance(
      { latitude: pickUpLocation.latitude, longitude: pickUpLocation.longitude },
      { latitude: dropLocation.latitude, longitude: dropLocation.longitude }
    );
  
    let totalFare = 0; // Declare totalFare outside the blocks
  
    if (ride === 'bike') {
      const baseFare = 50;
      const ratePerKm = 10;
      totalFare = baseFare + ratePerKm * (distance / 1000);
    } else if (ride === 'car') {
      const baseFare = 70;
      const ratePerKm = 20;
      totalFare = baseFare + ratePerKm * (distance / 1000);
    } else if (ride === 'auto') {
      const baseFare = 60;
      const ratePerKm = 15;
      totalFare = baseFare + ratePerKm * (distance / 1000);
    }
  
    setFare(totalFare.toFixed(2)); // Set the fare after calculation
  };
  
  const getETA = async () => {
    if (!pickUpLocation || !dropLocation) return;

    const origin = `${pickUpLocation.latitude},${pickUpLocation.longitude}`;
    const destination = `${dropLocation.latitude},${dropLocation.longitude}`;

    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&key=${GOOGLE_API_KEY}`
    );

    const etaValue = response.data.routes[0].legs[0].duration.text;
    setEta(etaValue);
  };

  useEffect(() => {
    calculateFare();
    getETA();
    getDirections();
  }, [ride, pickUpLocation, dropLocation]);


  // Function to render location
    const renderLocation = (location) => {
        if (location) {
        return `${location.latitude}, ${location.longitude}`;
        }
        return "Enter location";
    };

    // testing out
    const fetchAddress = async (location, setAddress) => {
        if (!location) return;
        try {
          const response = await axios.get(
            `https://maps.googleapis.com/maps/api/geocode/json`,
            {
              params: {
                latlng: `${location.latitude},${location.longitude}`,
                key: GOOGLE_MAPS_API_KEY,
              },
            }
          );
          if (response.data.results && response.data.results.length > 0) {
            const components = response.data.results[0].address_components;
      
            // Extract local area details
            const neighborhood = components.find((c) =>
              c.types.includes("neighborhood")
            )?.long_name || "";
      
            const sublocality = components.find((c) =>
              c.types.includes("sublocality")
            )?.long_name || "";
      
            const locality = components.find((c) =>
              c.types.includes("locality")
            )?.long_name || "";
      
            const state = components.find((c) =>
              c.types.includes("administrative_area_level_1")
            )?.long_name || "";
      
            const country = components.find((c) =>
              c.types.includes("country")
            )?.long_name || "";
      
            // Create a readable address
            const detailedAddress = `${neighborhood || sublocality || locality}, ${locality}, ${state}, ${country}`;
      
            setAddress(detailedAddress.trim());
        } else {
            setAddress("Address not found");
          }
        } catch (error) {
          console.error("Error fetching address:", error);
          setAddress("Error fetching address");
        }
      };
    
      // Fetch pickup address whenever pickUpLocation changes
      useEffect(() => {
        fetchAddress(pickUpLocation, setPickUpAddress);
      }, [pickUpLocation]);
    
      // Fetch drop address whenever dropLocation changes
      useEffect(() => {
        fetchAddress(dropLocation, setDropAddress);
      }, [dropLocation]);

      useEffect(() => {
        // Animate to the pickup location when it's set
        if (pickUpLocation && mapRef.current) {
          mapRef.current.animateToRegion(
            {
              latitude: pickUpLocation.latitude,
              longitude: pickUpLocation.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            },
            1000 // Animation duration in milliseconds
          );
        }
      }, [pickUpLocation]);

  return (
    <View style={styles.container}>
      <View style={styles.locationPutarea}>
        <TouchableOpacity
          style={styles.input}
          onPress={() => openModal("pickUpLocation", pickUpLocation)}
        >
          <Text>Pickup: {pickUpAddress}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.input}
          onPress={() => openModal("dropLocation", dropLocation)}
        >
          <Text>Drop: {dropAddress}</Text>
        </TouchableOpacity>
      </View>

      
        
      

      {currentLoc && (
        <View style={styles.mapContainer}>
            <MapView
            ref={mapRef}
            style={styles.map}
            initialRegion={currentLoc}
            showsUserLocation
            >
            {pickUpLocation && <Marker coordinate={pickUpLocation} title="Pickup Location" />}
            {dropLocation && <Marker coordinate={dropLocation} title="Drop Location" />}
            {directions && <Polyline coordinates={directions} strokeWidth={3} strokeColor="orange" />}
            </MapView>
        </View>
      )}

    <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>Fare: ₹{fare ? fare : 'Amount'}</Text>
        <Text style={styles.detailsText}>ETA: {eta ? eta : 'minutes'}</Text>
    </View>

    <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems:'center', marginVertical: 20, }}>
        {/* Bike Button */}
        <TouchableOpacity
          style={[
            styles.buton,
            {
              backgroundColor: ride === 'bike' ? 'black' : '#ccc',
              padding: 10,
              borderRadius: 5,
              width: ride === 'bike' ? 120 : 100,
              height: ride === 'bike' ? 80 : 60,

            },
          ]}
          onPress={() => setRide('bike')}
        >
          <FontAwesome5 name="motorcycle" size={20} color="orange" style={{ marginBottom: 5 }} />
          <Text style={{ color: 'orange' }}>Bike</Text>
        </TouchableOpacity>

        {/* Car Button */}
        <TouchableOpacity
          style={[
            styles.buton,
            {
              backgroundColor: ride === 'car' ? 'black' : '#ccc',
              padding: 10,
              borderRadius: 5,
              width: ride === 'car' ? 120 : 100,
              height: ride === 'car' ? 80 : 60,
            },
          ]}
          onPress={() => setRide('car')}
        >
          <MaterialCommunityIcons name="car" size={20} color="orange" style={{ marginBottom: 5 }} />
          <Text style={{ color: 'orange' }}>Car</Text>
        </TouchableOpacity>

        {/* Auto Button */}
        <TouchableOpacity
          style={[
            styles.buton,
            {
              backgroundColor: ride === 'auto' ? 'black' : '#ccc',
              padding: 10,
              borderRadius: 5,
              width: ride === 'auto' ? 120 : 100,
              height: ride === 'auto' ? 80 : 60,
            },
          ]}
          onPress={() => setRide('auto')}
        >
          <MaterialCommunityIcons name="rickshaw" size={20} color="orange" style={{ marginBottom: 5 }} />
          <Text style={{ color: 'orange' }}>Auto</Text>
        </TouchableOpacity>
      </View>


      <Modal
        transparent
        visible={modalVisible}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Enter {activeField}</Text>
            <TextInput
              style={styles.modalInput}
              value={inputValue}
              onChangeText={(text) => {
                setInputValue(text);
                updateSuggestions(text);
              }}
            />
            {suggestions.length > 0 && (
              <View style={styles.suggestionsContainer}>
                {suggestions.map((suggestion, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setInputValue(suggestion);
                      setSuggestions([]);
                    }}
                    style={styles.suggestionline}
                  >
                    <Text>{suggestion}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity onPress={closeModal} style={styles.button}>
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleSave} style={styles.button}>
                <Text style={styles.buttonText}>Save</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    alignItems:'center',
  },
  input: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 10,
    width:width*0.9,
  },
  map: {
    width: "100%",
    height: height / 3,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContainer: {
    width: 300,
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 8,
  },
  modalTitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
  },
  button: {
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 8,
    width:100,
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
  },
  suggestionsContainer: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    maxHeight: 250,
    overflow: "scroll",
  },
  suggestionline: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 5,
    margin: 5,
  },
  buton: {
    width: 100,
    height: 60,
    backgroundColor: "black",
    justifyContent: "center",
    borderRadius: 20,
    margin: 10,
    shadowColor: "#000",
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
    alignItems:'center',
  },
  locationPutarea: {
    alignItems: "center",
    justifyContent: "center",
  },
  mapContainer: {
    borderRadius: 20, // Adjust as needed
    overflow: 'hidden',
    width: "100%", // Adjust to your desired width
    height: height / 3, // Match the height of your map
  },
  detailsContainer:{
    flexDirection:'row',
    width:width*0.9,
    height: 100,
    justifyContent:'space-evenly',
    alignItems:'center',
    backgroundColor:'black',
    margin:10,
    borderRadius:20,
  },
  detailsText:{
    color:'orange',
    fontSize:15,
    fontWeight:'bold'
  }
  
});

export default HomeScreen;
