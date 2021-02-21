/** ********************************************************************************************
 * File: MobileNumber
 * Created By: Priyanka Suryawanshi
 * Created On: 20/02/2021
 ********************************************************************************************* */

import React, {Component} from 'react';
import {StyleSheet, Text, View,TextInput,Button,ToastAndroid,StatusBar,ActivityIndicator} from 'react-native';
import auth from '@react-native-firebase/auth';

export default class MobileNumber extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      mobileNumber: '',
      isLoading: false
    }
  }

  static navigationOptions = () => ({
    // Title of the header
    title: "Mobile Number",
    headerStyle: {
      backgroundColor: "#2B4F81"
    },
    headerTitleStyle: {
      color: "#ffffff",
      fontSize: 20,
      flex: 1,
      textAlign:'center'
    },
  });

  async getOtp(phoneNumber){
    if(phoneNumber.length==10){
      this.setState({isLoading: true})
      // Send mobile number for verification code
      try{
        const confirmation = await auth().signInWithPhoneNumber('+91 '+ phoneNumber);
        if(confirmation){
          this.setState({isLoading: false})
          this.props.navigation.navigate("OTPScreen",{confirmationResult: confirmation})
          // console.log("confirmation-->",confirmation)
        }
      }
      catch (error) {
        this.setState({isLoading: false})
        ToastAndroid.show("Please enter valid mobile number", ToastAndroid.SHORT);
      }
    }
    else{
      ToastAndroid.show("Please enter valid mobile number", ToastAndroid.SHORT);
    }
  }

  componentDidMount(){
    StatusBar.setBackgroundColor("#2B4F81");
  }

  render() {
    if(this.state.isLoading){
      return(
        <View style={styles.loaderParentView}>
          <ActivityIndicator 
              size='small' 
              color={"#fff"}
          />
        </View>
      )
    }
    return (
      <View style={styles.container}>
        <View style={styles.parentView}>
        <Text style={styles.enterPostTitle}>Enter Mobile Number :</Text>
        <TextInput
            mode="outlined"
            multiline={true}
            style={[styles.textinputNew,{marginBottom:20}]}
            text="#fff"
            placeholder="Mobile Number"
            value={this.state.mobileNumber}
            onChangeText={(mobileNumber) =>
              this.setState({ mobileNumber })
            }
        />
        <Button
          onPress={() => 
            this.getOtp(this.state.mobileNumber)
          }
          title="GET OTP"
          color="#2B4F81"
          disabled={this.state.isLoading}
        />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#4D71A3',
  },
  textinputNew: {
    width: "100%",
    height: 45,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: "#cdcdcd",
    paddingLeft: 15,
    alignSelf:'center',
    color:'#fff'
  },
  parentView: {
    width:'80%',
    alignSelf:'center'
  },
  enterPostTitle: {
    fontSize:15,
    paddingBottom:3,
    color:'#fff'
  },
  loaderParentView: {
    flex: 1, 
    padding: 20, 
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#4D71A3'
  },
});
