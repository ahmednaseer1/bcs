import { View, Text, Image, StyleSheet, Animated, TouchableOpacity } from "react-native";
import illustration1 from '../assets/illustration1.png'


const WelcomeScreen = ({navigation}) => {
    return(
        <View style={[styles.cont]}>
            <Animated.Image
                style = {[styles.im]}
                source={illustration1}
            />
            <View>
                <TouchableOpacity
                style={[styles.buton]}
                onPress={()=>{navigation.navigate('Login')}}
                >
                    <Text style={{color:'orange', textAlign:'center', fontSize:20,}}>
                        login
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity 
                style={[styles.buton]}
                onPress={()=>{navigation.navigate('Register')}}
                >
                    <Text style={{color:'orange', textAlign:'center', fontSize:20,}}>
                        Register
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    cont:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    im:{
        width:300,
        height:300,
        borderRadius:20,
        marginBottom:100,
        shadowColor:'#000',
        shadowOffset: { width: 10, height: 10 }, 
        shadowOpacity: 0.8,
        shadowRadius: 10,
        elevation: 20,
    },
    buton:{
        width:300,
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
    }
})

export default WelcomeScreen;