import {
    createStackNavigator
  } from "react-navigation";
  import MobileNumber from "./MobileNumber";
  import OTPScreen from "./OTPScreen";
  import AddPost from './AddPost';
  import PostListing from './PostListing';

  const MainNavigator = createStackNavigator(
    {
        MobileNumber:MobileNumber,
        OTPScreen:OTPScreen,
        AddPost:AddPost,
        PostListing:PostListing
    },
    {
      initialRouteName: "MobileNumber"
    }
  );
export default MainNavigator;
  