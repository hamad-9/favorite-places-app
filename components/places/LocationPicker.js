import { StyleSheet, View, Alert, Text, Image } from "react-native";
import {
  getCurrentPositionAsync,
  useForegroundPermissions,
  PermissionStatus,
} from "expo-location";
import OutlinedButton from "../ui/OutlinedButton";
import { Colors } from "../../constants/colors";
import { useEffect, useState } from "react";
import { getMapPreview } from "../../util/location";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

function LocationPicker({ onPickLocation }) {
  const [pickedLocation, setPickedLocation] = useState();

  const isFocused = useIsFocused();
  const navigation = useNavigation();
  const route = useRoute();

  const [locationPermissionInformation, requestPermission] =
    useForegroundPermissions();

  // I'm checking the route.params because the params will only set when AddPlace screen was navigated from Map screen.

  useEffect(() => {
    if (isFocused && route.params) {
      const mapPickedLocation = {
        lat: route.params.pickedLat,
        lng: route.params.pickedLng,
      };
      setPickedLocation(mapPickedLocation);
    }
  }, [route, isFocused]);

  useEffect(() => {
    onPickLocation(pickedLocation);
  }, [pickedLocation, onPickLocation]);

  //this is required for the both operating systems ios and android................................................

  async function verifyPermissions() {
    if (
      locationPermissionInformation.status === PermissionStatus.UNDETERMINED
    ) {
      // if the app opened for the first time
      const permissionResponse = await requestPermission();
      return permissionResponse.granted;
    }

    if (locationPermissionInformation.status === PermissionStatus.DENIED) {
      //if we do not have permission
      Alert.alert(
        "Insufficient Permissions!",
        "You need to grant location permissions to use this app."
      );
      return false;
    }

    return true; // this mean that we have the permission to use the camera.
  }
  //...............................................................................................................
  async function getLocationHandler() {
    const hasPermission = await verifyPermissions();
    if (!hasPermission) {
      return;
    }
    const location = await getCurrentPositionAsync();
    setPickedLocation({
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    });
  }
  function pickOnMapHandler() {
    navigation.navigate("Map");
  }

  let locationPreview = <Text> No location picked yet! </Text>;
  if (pickedLocation) {
    console.log(getMapPreview(pickedLocation.lat, pickedLocation.lng));
    locationPreview = (
      <Image
        style={styles.mapPreviewImage}
        source={{
          uri: getMapPreview(pickedLocation.lat, pickedLocation.lng),
        }}
      />
    );
  }

  return (
    <View>
      <View style={styles.mapPreview}>{locationPreview}</View>
      <View style={styles.actions}>
        <OutlinedButton icon="location" onPress={getLocationHandler}>
          Locate user
        </OutlinedButton>
        <View style={{ minWidth: 10 }}></View>
        <OutlinedButton icon="map" onPress={pickOnMapHandler}>
          Pick on Map
        </OutlinedButton>
      </View>
    </View>
  );
}

export default LocationPicker;

const styles = StyleSheet.create({
  mapPreview: {
    width: "100%",
    height: 200,
    marginVertical: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.primary100,
    borderRadius: 4,
    overflow: "hidden",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  mapPreviewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 4,
  },
});
