/** ********************************************************************************************
 * File: PostListing
 * Created By: Priyanka Suryawanshi
 * Created On: 20/02/2021
 ********************************************************************************************* */

import React, {Component} from 'react';
import {StyleSheet, Text, View, TouchableOpacity, Image, ActivityIndicator, FlatList, ToastAndroid,BackHandler,Alert} from 'react-native';
import { Card } from "react-native-elements";

//ADD BUTTON UI
const AddButton = () => {
  return (
    <View style={{    height: 56,
      width: 56,
      borderRadius: 400,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",backgroundColor:'#2B4F81'}}>
      <Image source={require("../assets/add_button_image.png")} style={{height: 20, width: 20}} />
    </View>
  );
}

export default class PostListing extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      listingData:'',
      isLoading: true
    }
  }

  static navigationOptions = () => ({
    // Title of the header
    title: "Posts",
    headerStyle: {
      backgroundColor: "#2B4F81"
    },
    headerTitleStyle: {
      color: "#ffffff",
      fontSize: 20,
      flex: 1,
      textAlign:'center'
    },
    headerLeft:null
  });

  //API TO GET ALL THE POST DATA
  getPostsData = async() => {
    this.setState({isLoading:true})
    try {
      let response = await fetch('https://robust-seahorse-24.hasura.app/v1/query', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "type":"select",
        "args":{
          "table":"demo",
          "columns":["id","title","description","posted_by"]
        }
      })
      });
      let responseJson = await response.json();
      this.setState({listingData: responseJson,isLoading:false})
    } catch (error) {
      console.error(error);
    }
  }

  //API TO DELETE THE POST
  deletePost = async(postId) => {
    this.setState({isLoading:true})
    try {
      let response = await fetch('https://robust-seahorse-24.hasura.app/v1/query', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "type":"delete",
        "args":{
          "table":"demo",
          "where":{"id":postId}
        }
      })
      });
      ToastAndroid.show("You have successfully deleted the post ", ToastAndroid.SHORT);
      this.getPostsData();
    } catch (error) {
      console.error(error);
    }
  }

  componentDidMount(){
    //LISTENER TO FETCH THE DATA WHEN SCREEN IS FOCUSED
    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.getPostsData();
    })
    //Backhandler to handle device back button action
    this.backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      Alert.alert(
        'Exit from app',
        'Do you want to exit from app?',
        [
          {
            text: 'Yes',
            onPress: () => BackHandler.exitApp(),
          },
          {
            text: 'No',
            onPress: () =>
              // console.log("NO Pressed")
              null,
          },
        ],
        { cancelable: false }
      );
      return true;
    });
  }

  componentWillUnmount() {
    // REMOVE LISTENER
    this.focusListener.remove();
    this.backHandler.remove();
  }
  
  //THIS METHOD RENDER ALL THE FLATLIST DATA
  renderItem = ({ item }) => {
    return (
      <View style={styles.parentView}>
        <Card containerStyle={styles.cardborderradius} title={item.title} titleStyle={styles.cardTitleStyle}>
          <Text style={styles.descriptionStyle}>
            {item.description}
          </Text>
          <View style={styles.align}>
            <View style={styles.postedByViewStyle}>
              <Text style={styles.whiteColor}>POSTED_BY : {item.posted_by}</Text>
            </View>
            <View style={styles.imageContainer}>
              <TouchableOpacity style={styles.paddingRight}
                onPress={() => this.props.navigation.navigate("AddPost",{viewPage : "edit",postId: item.id,postTitle:item.title,postdesc: item.description})
              }>
                <Image source={require("../assets/edit.png")} />
              </TouchableOpacity >
              <TouchableOpacity  
                onPress={() => this.deletePost(item.id)
              }>
                <Image source={require("../assets/delete.png")} />
              </TouchableOpacity>
            </View>
          </View>
        </Card>
      </View>
    );
  };

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
    if(this.state.listingData.length<=0){
      return (
        <View style={styles.container}>
        <View style={styles.addComplaintContainer}>
          <TouchableOpacity
            onPress={() =>
              // console.log("hii")
              this.props.navigation.navigate("AddPost",{viewPage : "add"})
            }
          >
            <AddButton ButtonColor="#FF0000" />
          </TouchableOpacity>
          <Text style={styles.addText}>
            {"\n"}
            Click on the add button to add Posts
          </Text>
        </View>
      </View>
    );
    }
    else{
      return (
        <View style={styles.addButtonView}>
          <FlatList
            data={this.state.listingData}
            renderItem={this.renderItem}
            extraData={this.state.listingData}
          />
          <TouchableOpacity
            style={styles.floatingButtonStyle}
            onPress={() => this.props.navigation.navigate("AddPost",{viewPage : "add"})
          }>
            <AddButton ButtonColor="#FF0000" />
          </TouchableOpacity>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#4D71A3",
    alignItems: "center",
    justifyContent: "center",
  },
  addComplaintContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  addText: {
    color: "#fff",
    fontSize: 16
  },
  addButtonView: {
    flex: 1,
    backgroundColor: "#4D71A3"
  },
  parentView: {
    backgroundColor: "#4D71A3",
  },
  cardborderradius: {
    borderRadius: 10,
    backgroundColor:'#2B4F81'
  },
  floatingButtonStyle: {
    position: "absolute",
    width: "15%",
    height: "10%",
    alignItems: "center",
    justifyContent: "center",
    right: "2%",
    bottom: "1%",
  },
  cardTitleStyle: {
    color:"#fff",
    fontSize:16,
    textAlign:'left'
  },
  descriptionStyle: {
    marginBottom: 10,
    color:'#fff'
  },
  align: {
    flex:1,
    flexDirection:'row'
  },
  postedByViewStyle: {
    flex:3,
    alignSelf:'flex-end'
  },
  whiteColor: {color:'#fff'},
  imageContainer: {
    flex:1,
    flexDirection:'row',
    justifyContent:'flex-end',
    alignItems:'center'
  },
  paddingRight: {paddingRight:10},
  loaderParentView: {
    flex: 1, 
    padding: 20, 
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'#4D71A3'
  },
});
