import React, { Component } from 'react';
import { Platform, Alert } from 'react-native';
import { Constants, Location, MapView, Permissions, Notifications } from 'expo';
import Waiting from './components/Waiting'
import FirstMap from './components/FirstMap'
import SecondMap from './components/SecondMap'

const SERVER_URL = "https://mathiasbigler.com/MiniProjectJS/";

export default class App extends Component {
  constructor() {
    super();
    console.ignoredYellowBox = ['Warning: View.propTypes'];
    this.state = {
      loggedIn: false,
      username: null,
      latitude: null,
      longitude: null,
      errorMessage: null,
      allowedArea: null,
      region: null,
      serverIsUp: false,
      statusBarHeight: Constants.statusBarHeight - 1,
      notification: ""
    };
  }

  async componentDidMount() {
    try {
      const res = await fetch(`${SERVER_URL}api/geoapi/allowedarea`).then(res => res.json());
      this.setState({ allowedArea: res.geometry.coordinates, serverIsUp: true });
    } catch (err) {
      this.setState({ serverIsUp: false });
    }

    //Hack to ensure the showsMyLocationButton is shown initially. Idea is to force a repaint
    setTimeout(() => this.setState({ statusBarHeight: Constants.statusBarHeight }), 500);
    if (Platform.OS === 'android' && !Constants.isDevice) {
      this.setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      this._getLocationAsync();
    }
  }

  _getLocationAsync = async () => {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'Permission to access location was denied',
      });
    }
    let location = await Location.getCurrentPositionAsync({});
    this.setState(
      {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        region: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }
      });
  };

  onPress = (event) => {
    // 'const coordinate = event.nativeEvent.coordinate;
    // const pos = { coordinates: [coordinate.longitude, coordinate.latitude] };
    // console.log(pos)'

    // console.log("Location for press: " + JSON.stringify(pos));
    // fetch(`${SERVER_URL}/geoapi`, {
    //   method: "post",
    //   body: JSON.stringify(pos),
    //   headers: new Headers({
    //     'Content-Type': 'application/json'
    //   })
    // })
    //   .then(res => res.json())
    //   .then(res => {
    //     this.setState({ status: res.msg });
    //     setTimeout(() => this.setState({ status: "- - - - - - - - - - - - - - - - - - - -" }), 2000);
    //   }).catch(err => {
    //     Alert.alert("Error", "Server could not be reached")
    //     this.setState({ serverIsUp: false });
    //   })
  }

  onPressButton = async () => { // Update user position
    let location = await Location.getCurrentPositionAsync({});
    let body = {
        username: this.state.username,
        coordinates: [location.coords.longitude, location.coords.latitude],
    }
    let options = {
      method: "post",
      body: JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }
    try {
      const res = await fetch(`${SERVER_URL}api/positions/update`, options).then(res => res.json());
      this.setState({ status: res.msg });
      setTimeout(() => this.setState({ status: "- - - - - - - - - - - - - - - - - - - -" }), 1000);

      await fetch(`${SERVER_URL}api/geoapi/findNearbyFriends/${location.coords.longitude}/${location.coords.latitude}/${this.state.distance}`)
      .then(res => res.json())
      .then(r => {
        if (r.status === 403)
          Alert.alert("Error", r.msg)
        else {
          console.log(r.friends)
          this.setState({ friends: r.friends })
        }
      })
    } catch (err) {
      Alert.alert("Error", "Server could not be reached")
      this.setState({ serverIsUp: false });
    }
  }

  handleLogin = async (data) => {
    let location = await Location.getCurrentPositionAsync({});
    let latitude = location.coords.latitude
    let longitude = location.coords.longitude
    let body = {
      username: data.username,
      password: data.password,
      distance: parseInt(data.distance),
      longitude,
      latitude
    }
    let options = {
      method: "post",
      body: JSON.stringify(body),
      headers: new Headers({ 'Content-Type': 'application/json' })
    }
    await fetch(`${SERVER_URL}api/login`, options)
      .then(res => res.json())
      .then(res => {
        if (res.status === 403)
          Alert.alert("Error", res.msg)
        else
          this.setState({ friends: res.friends, distance: data.distance, loggedIn: true, username: data.username })
      })

    //FOR NOTIFICATIONS

    let pushToken = await Notifications.getExpoPushTokenAsync();
    await fetch(`${SERVER_URL}api/login/notify`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: Constants.deviceId,
        pushToken,
        latitude,
        longitude
      })
    });
    this._notificationSubscription = Notifications.addListener(this._handleNotification);
  }

  _handleNotification = (notification) => {
    const msg = notification.data;
    const message = `User ${msg.id} just got online. Located at ${msg.latitude}, ${msg.longitude}`
    Alert.alert(message);
    this.setState({
      notification: message,
      region: {
        latitude: parseInt(msg.latitude),
        longitude: parseInt(msg.longitude),
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      }
    });
  };

  render() {
    if (!this.state.loggedIn) {
      if (!this.state.region)
        return <Waiting statusBarHeight={this.state.statusBarHeight} />;
      else
        return <FirstMap
          handleLogin={this.handleLogin}
          region={this.state.region}
          onPress={this.onPress}
          latitude={this.state.latitude}
          longitude={this.state.longitude}
          statusBarHeight={this.state.statusBarHeight}
        />
    }

    if (!this.state.region) {
      return <Waiting statusBarHeight={this.state.statusBarHeight} />
    }
    else {
      return <SecondMap
        region={this.state.region}
        onPress={this.onPress}
        latitude={this.state.latitude}
        longitude={this.state.longitude}
        statusBarHeight={this.state.statusBarHeight}
        username={this.state.username}
        allowedArea={this.state.allowedArea}
        onPressButton={this.onPressButton}
        onCenterGameArea={this.onCenterGameArea}
        friends={this.state.friends}
        serverIsUp={this.state.serverIsUp}
        status={this.state.status}
      />

    }
  }
}
