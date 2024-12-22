import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useState } from "react";

// components
import UserRegistration from "../components/userRegistration";
import DriverRegisteration from "../components/DriverRegisteration"

const RegisterScreen = () => {

    const [Switch, setSwitch] = useState(false);

    return(
        <View>
            {Switch ? (<>
                <DriverRegisteration/>
            </>) : (<>
                <UserRegistration/>
            </>)}
            <View
                style = {[styles.butonContainer]}
            >
                <TouchableOpacity
                    onPress={()=>{setSwitch(false)}}
                    style = {[styles.buton]}
                >   
                    <Text style={{color:'orange', textAlign:'center', fontSize:14,}}>
                        User Registration
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {[styles.buton]}
                    onPress={()=>{setSwitch(true)}}
                >
                    <Text style={{color:'orange', textAlign:'center', fontSize:14,}}>
                        Driver Registration
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    buton:{
        width:150,
        height:60,
        backgroundColor:'black',
        color:'orange',
        justifyContent:'center',
        borderRadius:20,
        marginTop:20,
        shadowColor:'#000',
        shadowOffset: { width: 5, height: 5 }, 
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 8,
    },
    butonContainer:{
        flexDirection:'row',
        justifyContent:'space-evenly'

    }
})


export default RegisterScreen;