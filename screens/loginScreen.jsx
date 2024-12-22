import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useState } from "react";

import UserLogin from "../components/userLogin";
import DriverLogin from "../components/DriverLogin";

const LoginScreen = () => {

    const [Switch, setSwitch] = useState(false)


    return (
        <View>

            {Switch ? (
                <>
                <DriverLogin/>
                </>
            ) : (
                <>
                <UserLogin/>
                </>
            )}
            <View
                style = {[styles.butonContainer]}
            >
                <TouchableOpacity
                    onPress={()=>{setSwitch(false)}}
                    style = {[styles.buton]}
                >   
                    <Text style={{color:'orange', textAlign:'center', fontSize:15,}}>
                        User login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style = {[styles.buton]}
                    onPress={()=>{setSwitch(true)}}
                >
                    <Text style={{color:'orange', textAlign:'center', fontSize:15,}}>
                        Driver login
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

export default LoginScreen;