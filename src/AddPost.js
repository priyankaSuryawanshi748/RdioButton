/** ********************************************************************************************
 * File: AddPost
 * Created By: Priyanka Suryawanshi
 * Created On: 20/02/2021
 ********************************************************************************************* */

import React, {Component} from 'react';
import {StyleSheet, Text, View,TextInput,Button,ToastAndroid,BackHandler} from 'react-native';

export default class AddPost extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      titleText: this.props.navigation.getParam("postTitle")?(this.props.navigation.getParam("postTitle")):'',
      descriptionText: this.props.navigation.getParam("postdesc")?(this.props.navigation.getParam("postdesc")):''
    }
  }

  static navigationOptions = () => ({
    // Title of of the header
    title: "Add Post",
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

  componentDidMount(){
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      this.props.navigation.goBack();
      return true;
    });
  }

  //API TO ADD THE POST
  addPost = async() => {
    if(this.state.titleText=='' || this.state.descriptionText==''){
      ToastAndroid.show("Please enter title and description in the field", ToastAndroid.SHORT);
    }
    else {
        try {
          let response = await fetch('https://robust-seahorse-24.hasura.app/v1/query', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "type":"insert",
            "args":{
              "table":"demo",
              "objects":[
                {"title":this.state.titleText,"description":this.state.descriptionText}
                ]
            }
          })
          });
          ToastAndroid.show("You have successfully added the post ", ToastAndroid.SHORT);
          this.props.navigation.navigate("PostListing")
        } catch (error) {
          console.error(error);
        }
      }
  }

  //API TO EDIT THE POST
  editPost = async() => {
    if(this.state.titleText=='' || this.state.descriptionText==''){
      ToastAndroid.show("Please enter title and description in the field", ToastAndroid.SHORT);
    }
    else {
        try {
          let response = await fetch('https://robust-seahorse-24.hasura.app/v1/query', {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "type":"update",
            "args":{
              "table":"demo",
              "$set":
                {"title":this.state.titleText,
                "description":this.state.descriptionText},
              "where":{"id":this.props.navigation.getParam("postId")}
            }
          })
          });
          ToastAndroid.show("You have successfully updated the post ", ToastAndroid.SHORT);
          this.props.navigation.navigate("PostListing")
        } catch (error) {
          console.error(error);
        }
      }
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.parentView}>
        <Text style={styles.enterPostTitle}>Enter Post Title :</Text>
        <TextInput
            mode="outlined"
            multiline={true}
            style={styles.textinputNew}
            text="#fff"
            placeholder="Title"
            value={this.state.titleText}
            onChangeText={(titleText) =>
              this.setState({ titleText })
            }
        />
        <Text style={[styles.enterPostTitle,{marginTop:25}]}>Enter Post Description :</Text>
        <TextInput
            mode="outlined"
            multiline={true}
            style={[styles.textinputNew,{marginBottom:30}]}
            text="#fff"
            placeholder="Description"
            value={this.state.descriptionText}
            onChangeText={(descriptionText) =>
              this.setState({ descriptionText })
            }
        />
        <Button
          onPress={() => this.props.navigation.getParam("viewPage")=="edit"?this.editPost():this.addPost()}
          title="SUBMIT"
          color="#2B4F81"
          accessibilityLabel="Learn more about this purple button"
        />
        </View>
      </View>
    );
  }
  componentWillUnmount() {
    // REMOVE LISTENER
    this.backHandler.remove();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#4D71A3',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
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
});
