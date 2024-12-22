import { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Modal, TextInput, Dimensions } from "react-native";


const {width, height} = Dimensions.get('screen')


const DriverRegisteration = () => {

    const [name, setName] = useState('');
    const [dof, setDof] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
        if (activeField === 'email') setEmail(inputValue);
        else if (activeField === 'password') setPassword(inputValue);
        else if (activeField === 'name') setName(inputValue);
        else if (activeField === 'dof') setDof(inputValue);


        closeModal();
    };

    const handleRegister = async () => {
        setLoading(true);
        try {
            const response = await fetch('http://192.168.0.13:8000/drivers/register/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name:name,
                    email: email,
                    dof: dof,
                    password: password,
                }),
            });
    
            const data = await response.json();

            if (response.ok){
                Alert.alert(`Registration successful`)
            } else {
                Alert.alert('Registration failed', data.error || 'Unknown error');
            }
        } catch (error) {
            Alert.alert('Error', 'Something went wrong. Please try again.');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style = {[styles.formContainer]}>
            <View>
                <Text style={[styles.bigText]}>
                    Driver Registration
                </Text>
            </View>
            <View>
                <TouchableOpacity style={[styles.input]} onPress={() => openModal('name', name)}>
                    <TextInput
                        placeholder="Enter name"
                        value={name}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.input]} onPress={() => openModal('email', email)}>
                    <TextInput
                        placeholder="Enter Email"
                        value={email}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.input]} onPress={() => openModal('dof', dof)}>
                    <TextInput
                        placeholder="Enter date of birth"
                        value={dof}
                        editable={false}
                    />
                </TouchableOpacity>
                <TouchableOpacity style={[styles.input]} onPress={() => openModal('password', password)}>
                    <TextInput
                        placeholder="Enter Password"
                        value={password}
                        secureTextEntry={true}
                        editable={false}
                    />
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style = {[styles.buton]}
                onPress={handleRegister}
                disabled= {loading}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="orange" />
                ) : (
                <Text style={{ color: 'orange', textAlign: 'center', fontSize: 20 }}>
                    Register
                </Text>)}
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
    );
}

const styles = StyleSheet.create({
    formContainer:{
        width: width * 0.9,
        height:height * 0.7,
        padding:20,
        justifyContent:'space-evenly',
        alignItems:'center',
        backgroundColor:'wheat',
        borderRadius:20,
        margin:20,
        shadowColor:'#000',
        shadowOffset: { width: 5, height: 5 }, 
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    buton: {
        width: 300,
        height: 60,
        backgroundColor: 'black',
        justifyContent: 'center',
        borderRadius: 20,
        marginTop: 20,
        marginBottom: 40,
        shadowColor:'#000',
        shadowOffset: { width: 5, height: 5 }, 
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
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
    bigText:{
        fontSize:30,
        fontWeight:'bold',
        textShadowColor: 'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 4,
    }
})



export default DriverRegisteration;