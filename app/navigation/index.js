import Loading from "@screens/Loading";
import { createAppContainer, createSwitchNavigator } from "react-navigation";
import Main from "./Main";

const AppNavigator = createSwitchNavigator(
  {
    Loading: Loading,
    Main: Main,
  },
  {
    initialRouteName: "Loading"
  }
);

export default createAppContainer(AppNavigator);
