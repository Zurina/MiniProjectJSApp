import React, { Component } from 'react';
import { View, Text } from "react-native";
import { MapView } from 'expo'
import MyButton from './MyButton'

export default class SecondMap extends Component {

    onCenterGameArea = () => {
        //TODO find out how to find center of polygon
        const longitude = this.props.allowedArea[0].longitude
        const latitude = this.props.allowedArea[0].latitude
        this.refs.map.animateToRegion({
          latitude,
          longitude,
          latitudeDelta: 0.002,
          longitudeDelta: 0.04,
        }, 1000);
      }

    render() {
        const info = this.props.serverIsUp ? this.props.status : " Server is not up";
        const friendMarkers = this.props.friends.map((friend, idx) => {
            //make distance
            const color = this.props.username === friend.username ? "#00FF00" : "red"
            return (
                <MapView.Marker
                    key={idx}
                    coordinate={{
                        latitude: friend.latitude,
                        longitude: friend.longitude
                    }}
                    title={friend.username}
                    pinColor={color}
                    description={`Distance between you: ${String((friend.distance / 1000).toFixed(2))}km`}
                />
            )
        })
        return (
            <View style={{ flex: 1, paddingTop: this.props.statusBarHeight }}>
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
                    {this.props.serverIsUp &&
                        <MapView.Polygon coordinates={this.props.allowedArea}
                            strokeWidth={1}
                            onPress={this.props.onPress}
                            fillColor="rgba(128, 153, 177, 0.5)" />
                    }
                    {friendMarkers}
                </MapView>

                <Text style={{ flex: 1, textAlign: "center", fontWeight: "bold" }}>
                    Your position (lat,long): {this.props.latitude}, {this.props.longitude}
                </Text>
                <Text style={{ flex: 1, textAlign: "center" }}>{info}</Text>

                <MyButton style={{ flex: 2 }} onPressButton={this.props.onPressButton.bind(this, true)}
                    txt="Upload real Position" />

                <MyButton style={{ flex: 2 }} onPressButton={this.onCenterGameArea}
                    txt="Show Game Area" />
            </View>
        );
    }
}


