import { Images } from "@assets";
import { BaseColor } from "@config";
import React, { Component } from "react";
import { ActivityIndicator, Image, PermissionsAndroid, Platform, StyleSheet, View } from "react-native";

// app permission (android only)
const _PERMISSIONS = [
  PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
  PermissionsAndroid.PERMISSIONS.CAMERA,
  PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
];

export default class Loading extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.requestAndroidPermission();
    setTimeout(() => {
      this.props.navigation.navigate("Main");
    }, 1500);
  }

  requestAndroidPermission = async () => {
    try {
      if (Platform.OS != "android") return;
      const granted = await PermissionsAndroid.requestMultiple(_PERMISSIONS);
      let permissionGranted = true;
      let permissionNeverAsk = false;
      _PERMISSIONS.every((item, index) => {
        if (granted[item] !== PermissionsAndroid.RESULTS.GRANTED) {
          permissionNeverAsk = granted[item] === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN;
          permissionGranted = false;
          return false;
        };
        return true;
      })
      if (permissionGranted) {
      } else if (!permissionNeverAsk) {
        this.requestAndroidPermission();
      }
    } catch (err) {
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <View style={{ alignItems: "center", marginTop: -200 }}>
          <Image source={Images.logo} style={styles.logo} resizeMode={'contain'} />
        </View>
        <ActivityIndicator
          size="large"
          color={BaseColor.blackColor}
          style={styles.loading}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: BaseColor.whiteColor
  },
  logo: {
    width: 200,
    height: 200,
  },
  loading: {
    position: "absolute",
    top: 160,
    bottom: 0,
  }
});
