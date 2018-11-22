
import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    TextInput,
    TouchableHighlight
} from 'react-native';

export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "ChosenOne",
            password: "HÆHÆ",
            distance: 100000
        }
    }

    handleLogin = async () => {
        console.log(this.state)
        this.props.login(this.state)
    }

    render() {
        return (
            <ScrollView>
                <View style={styles.container}>
                <Text>Login</Text>
                <Text>Enter username:</Text>
                <TextInput
                    value={this.state.username}
                    style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) => this.setState({ username: text })}
                />
                <Text>Enter password:</Text>
                <TextInput
                    value={this.state.password}
                    style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) => this.setState({ password: text })}
                />
                <Text>Enter distance:</Text>
                <TextInput
                    value={String(this.state.distance)}
                    style={{ height: 40, width: 150, borderColor: 'gray', borderWidth: 1 }}
                    onChangeText={(text) => this.setState({ distance: text })}
                />
                <TouchableHighlight style={{ backgroundColor: "#4682B4", margin: 3 }} onPress={this.handleLogin}>
                    <Text style={{ fontSize: 22, textAlign: "center", padding: 5 }}>Login</Text>
                </TouchableHighlight>

                <Text>{JSON.stringify(this.state)}</Text>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
        margin: 20
    }
});