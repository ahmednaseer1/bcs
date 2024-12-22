import { View, Text, TextInput, TouchableOpacity, Modal, StyleSheet } from "react-native";
import React from "react";

const LocationSearch = () => {

    const openModal = (field, currentValue) => {
        setActiveField(field);
        setInputValue(currentValue || '');
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setActiveField(null);
    };

    const handleSave = () => {
        if (activeField === 'pickup') setPickupLocation(inputValue);
        else if (activeField === 'drop') setDropLocation(inputValue);
        closeModal();
    };
    
    return(
        <View>
            <TouchableOpacity style={[styles.input]} onPress={() => openModal('email', email)}>
                <TextInput
                    placeholder="Enter pickup location"
                    value={''}
                    editable={false}
                />
            </TouchableOpacity>
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
                            onChangeText={setInputValue}
                        />
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
    )
}

const styles = StyleSheet.create({
    infoText: {
        fontSize: 16,
        marginVertical: 10,
        textAlign: 'center',
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
        backgroundColor: 'black',
        borderRadius: 20,
        margin: 5,
    },
    buttonText: {
        color: 'orange',
        fontSize: 16,
    },
});

export default LocationSearch;