import React, { Component } from 'react';
import { View, Text } from "react-native";

export default class Waiting extends Component {  
    render() {
        return(
            <View style={{
                flex: 1, flexDirection: "row", justifyContent: 'center',
                alignItems: "center", paddingTop: this.props.statusBarHeight
            }}>
                <Text style={{ fontSize: 35 }}>... Fetching data</Text>
            </View>
        )}
};


