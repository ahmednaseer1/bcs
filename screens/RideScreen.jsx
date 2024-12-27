import { View, Text, StyleSheet, Dimensions } from "react-native";
import React, { useRef } from "react";
import MapView, { Marker, Polyline } from "react-native-maps";
import { MaterialCommunityIcons, FontAwesome5, Ionicons } from '@expo/vector-icons';


const { width, height } = Dimensions.get("screen");

const RideScreen = ({ route }) => {
    const mapRef = useRef(null); // Use useRef to create a reference for MapView

    // Check if route and route.params are defined before destructuring
    const { fare, eta, pickUpLocation, currentLoc, dropLocation, directions } = route.params || {};

    return (
        <View 
            style = {{justifyContent:'center', alignItems:'center', width:width}}
        >
            {currentLoc && (
                <View style={styles.mapContainer}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        initialRegion={{
                            ...currentLoc,
                            latitudeDelta: 0.0922,
                            longitudeDelta: 0.0421,
                        }}
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
            <View style={[styles.rideDetail]}>
                <View style={[styles.detailsT]}>
                    <Ionicons name="person" size={100} color="orange" style={{margin:20}} />
                    <View>
                        <Text style={{color:'orange',}}>
                            Driver name:
                        </Text>
                        <Text style={{color:'orange',}}>
                            licence plat:
                        </Text>
                    </View>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: height / 3,
    },
    mapContainer: {
        borderRadius: 20,
        overflow: 'hidden',
        width: "90%",
        height: height / 3,
        margin:10,
        justifyContent:"center",
        alignItems:'center'
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
      },
      rideDetail:{
        backgroundColor:'black',
        width:width*0.9,
        height:height*0.4,
        borderRadius:20
      },
      detailsT:{
        flexDirection:'row'
      }
});

export default RideScreen;