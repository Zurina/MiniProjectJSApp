import React, { Component } from 'react';
import { View } from "react-native";
import { MapView } from 'expo'
import MyButton from './MyButton'
import Login from './Login'

export default class FirstMap extends Component {  

    constructor(props) {
        super(props)
        this.state = {
            showLoginScreen: false
        }
    }

    handleButtonPress = () => {
        this.setState({showLoginScreen: !this.state.showLoginScreen})
    }
    render() {
        if(this.state.showLoginScreen)
            return <Login login={this.props.handleLogin} />

        return (
            <View style={{ flex: 1, paddingTop: this.props.statusBarHeight }}>
            <MyButton style={{ flex: 2 }} onPressButton={this.handleButtonPress}
            txt="Login" />
            <MapView
              ref="map"
              style={{ flex: 14 }}
              onPress={this.props.onPress}
              mapType="standard"
              showsScale={true}
              //showsUserLocation={true}
              showsMyLocationButton={true}
              region={this.props.region}
            >
            <MapView.Marker
                key={1}
                coordinate={{latitude: this.props.latitude,
                            longitude: this.props.longitude}}
                title={"You"}
                pinColor="#00FF00"
            />
            </MapView>
            </View>
          )}
};


