/** ********************************************************************************************
 * File: OTPScreen
 * Created By: Priyanka Suryawanshi
 * Created On: 20/02/2021
 ********************************************************************************************* */

import React, {Component} from 'react';
import {StyleSheet, Text, View,ToastAndroid,ActivityIndicator} from 'react-native';
import * as ReadSms from 'react-native-read-sms/ReadSms';
import OTPInput from 'react-native-otp';

export default class OTPScreen extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      otp: '',
      isLoading: true
    }
  }

  static navigationOptions = () => ({
    // Title of of the header
    title: "OTP",
    headerStyle: {
      backgroundColor: "#2B4F81"
    },
    headerRight: (<View />),
    headerTintColor: "#ffffff",
    headerTitleStyle: {
      color: "#ffffff",
      fontSize: 20,
      flex: 1,
      textAlign:'center'
    },
  });

  componentDidMount = () => {
      this.startReadSMS();
  }

  startReadSMS = async () => {
    const hasPermission = await ReadSms.requestReadSMSPermission();

    if(hasPermission) {
      this.setState({isLoading : false})
        ReadSms.startReadSMS((status, sms, error) => {
            if (status == "success") {
                // You will receive new sms here
                var firstWord = sms.split(" ")[0];
                this.setState({otp: firstWord})
            }
        });
    }
    else{
      this.startReadSMS();
    }
  }

  async VerifyOTP(otp){
    try {
      await this.props.navigation.getParam("confirmationResult")
      .confirm(otp)
      .then(user => {
        //You can get user id inside user data
        // console.log("user-->",user.user._user.uid)
        ToastAndroid.show("You have successfully logged in", ToastAndroid.SHORT);
        this.props.navigation.navigate("PostListing")
      })
      .catch(error => {
        ToastAndroid.show("Please enter valid OTP", ToastAndroid.SHORT);
      })
    } catch (error) {
      ToastAndroid.show("Please enter valid OTP", ToastAndroid.SHORT);
    }
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
        <Text style={styles.text}>Enter OTP password</Text>
        <OTPInput
          value={this.state.otp}
          onChange={
            (otp) => { this.setState({ otp: otp }) }}
          tintColor="#FB6C6A"
          offTintColor="#BBBCBE"
          otpLength={6}
          onCodeFilled={this.state.otp.length==6? this.VerifyOTP(this.state.otp) : ''}
          keyboardType={'numeric'}
        />
      </View>
    );
  }

  componentWillUnmount = () => {
    ReadSms.stopReadSMS();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#4D71A3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize:15,
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
