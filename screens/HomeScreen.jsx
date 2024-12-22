import { View, Text, Dimensions, Modal, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";
import axios from 'axios';
import { GOOGLE_MAPS_API_KEY } from '@env';

console.log(GOOGLE_MAPS_API_KEY);

const {width, height} = Dimensions.get('screen')


const HomeScreen = () => {

    const [suggestions, setSuggestions] = useState([]);
    const GOOGLE_API_KEY = GOOGLE_MAPS_API_KEY;
    const [pickUpLocation, setPickUpLocation] = useState('');
    const [dropLocation, setDropLocation] = useState('');
    const [modalVisible, setModalVisible] = useState(false);
    const [activeField, setActiveField] = useState(null);
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);

    const openModal = (field, currentValue) => {
        setActiveField(field);
        setInputValue(currentValue);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setActiveField(null);
    };

    const handleSave = () => {
        if (activeField === 'pickUpLocation') setPickUpLocation(inputValue);
        else if (activeField === 'dropLocation') setDropLocation(inputValue);
        closeModal();
    };

    const updateSuggestions = async (text) => {
        if (text.trim() === '') {
            setSuggestions([]);
            return;
        }
    
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/place/autocomplete/json`,
                {
                    params: {
                        input: text,
                        key: GOOGLE_API_KEY,
                        types: 'geocode', // Suggest only locations
                        components: 'country:in', // Limit suggestions to India (optional)
                    },
                }
            );
            const predictions = response.data.predictions;
            setSuggestions(predictions.map((place) => place.description));
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    const Locations = () => {
        return(
            <View >
                <TouchableOpacity style={[styles.input]} onPress={() => openModal('pickUpLocation', pickUpLocation)}>
                    <TextInput
                        placeholder="Enter pickup location"
                        value={pickUpLocation}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.input]} onPress={() => openModal('dropLocation', dropLocation)}>
                    <TextInput
                        placeholder="Enter Drop location"
                        value={dropLocation}
                        editable={false}
                    />
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <View style={[styles.locationArea]}>
            <Locations/>
            <Text>
                this is the home screen
            </Text>
            <Modal
                transparent={true}
                visible={modalVisible}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContainer}>
                        <Text style={styles.modalTitle}>Enter {activeField}</Text>
                        <TextInput
                            style={styles.modalInput}
                            placeholder={`Enter ${activeField}`}
                            value={inputValue}
                            onChangeText={(text) => {
                                setInputValue(text);
                                updateSuggestions(text); // Fetch suggestions from Google API
                            }}
                        />
                        
                        {/* Suggestions List */}
                        {suggestions.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                {suggestions.map((suggestion, index) => (
                                    <TouchableOpacity
                                        key={index}
                                        style={styles.suggestionItem}
                                        onPress={() => {
                                            setInputValue(suggestion);
                                            setSuggestions([]); // Clear suggestions after selection
                                        }}
                                    >
                                        <Text style={styles.suggestionText}>{suggestion}</Text>
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
}

const styles = StyleSheet.create({
    inputContainer:{
        justifyContent:'space-around',
        alignItems:'center'
    },
    input: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginVertical: 10,
        backgroundColor: '#f9f9f9',
        shadowColor:'#000',
        shadowOffset: { width: 5, height: 5 }, 
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
    },
    modalInput: {
        width: '100%',
        padding: 10,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    button: {
        flex: 1,
        alignItems: 'center',
        padding: 10,
        backgroundColor:'black',
        borderRadius:20,
        margin:5
    },
    buttonText: {
        color: 'orange',
        fontSize: 16,
    },
    suggestionsContainer: {
        marginTop: 10,
        width: '100%',
        backgroundColor: '#f9f9f9',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 5,
        maxHeight: 200,
        overflow: 'hidden',
    },
    suggestionItem: {
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    suggestionText: {
        fontSize: 16,
        color: '#333',
    },
    locationArea:{
        padding:20,

    }
})

export default HomeScreen;