import React from 'react';
import { StyleSheet, View, TextInput } from "react-native";
import { Text, Button, Header } from 'react-native-elements';
import { BarCodeScanner, Permissions } from 'expo';
import { resolve } from 'node-isbn';
export default class BarcodeScanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasCameraPermission: null,
      inScanMode: false,
      scanInfo: {
        done: false,
        isbn: null,
        book: null
      }
    }
  }

  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    this.setState({ hasCameraPermission: status === 'granted' });
  }

  /**
   * Callback called when you hit the Scan button
   */
  placeSubmitHandler() {
    this.setState(
      {
        inScanMode: true
      }
    );
  }

  /**
   * 
   */
  _handleBarCodeRead = ({ data }) => {
    var isbn = data;
    this.setState({
      scanInfo: {
        done: true,
        isbn: isbn
      }
    });

    // Read the bara code and extract the book title
    resolve(isbn, (err, book) => {
      if (err) {
        alert(err);
      } else {
        var state = this.state;
        var scanInfo = state.scanInfo;
        scanInfo.book = book;
        this.setState(state);
      }
    });
  }

  render() {
    const { hasCameraPermission } = this.state;
    if (hasCameraPermission === null) {
      return <Text>Requesting for camera permission</Text>;
    } else if (hasCameraPermission === false) {
      return <Text>No access to camera</Text>;
    } else {
      return (
        <View style={[styles.container]}>
          {/* <Text  style={{ marginBottom: 20, fontSize :20 }}>Welcome to Reshma's Book Barcode Reader! </Text> */}

          <Header
            leftComponent={{ icon: 'menu', color: '#fff' }}
            centerComponent={{ text: 'Welcome to Reshma\'s Book Barcode Reader!', style: { color: '#fff' } }}
          />

          {!this.state.inScanMode && (
            <View>
              <Text style={{ fontSize: 20, marginTop: 20 }}>Press the button to scan a barcode</Text>


              <Button
                title="SCAN"
                titleStyle={{ fontWeight: "700" }}
                buttonStyle={{
                  backgroundColor: "rgba(92, 99,216, 1)",
                  width: 100,
                  height: 45,
                  marginTop: 20,
                  marginLeft: '25%',
                  borderColor: "transparent",
                  borderWidth: 0,
                  borderRadius: 5
                }}
                containerStyle={{ marginTop: 20 }}
                onPress={() => this.placeSubmitHandler()}
              />

            </View>
          )}

          {this.state.scanInfo.isbn && (
            <View>
              <Text>The code read has the following information</Text>
              <Text>ISBN: {this.state.scanInfo.isbn}</Text>
            </View>
          )}


          {this.state.scanInfo.book && (
            <View>
              <Text>Book: {this.state.scanInfo.book.title}</Text>
            </View>
          )}

          {this.state.inScanMode && !this.state.scanInfo.done && (
            <BarCodeScanner onBarCodeRead={this._handleBarCodeRead} style={StyleSheet.absoluteFill} />
          )}
        </View>

      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    //backgroundColor: "grey",
    marginTop: 50,
    marginRight: 20,
    paddingTop: 40,
    paddingLeft: 30,
    paddingBottom: 30,
  },
  buttonSyle: {
    width: "30%"
  }
});