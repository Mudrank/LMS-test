import React from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  KeyboardAvoidingView,
  ToastAndroid,
} from "react-native";
import * as Permissions from "expo-permissions";
import { BarCodeScanner } from "expo-barcode-scanner";

import Icon from "react-native-vector-icons/FontAwesome5";

import * as firebase from "firebase";
import db from "../config.js";

export default class Transaction extends React.Component {
  constructor() {
    super();
    this.state = {
      hasPermission: null,
      scanned: false,
      scannedStudentId: false,
      scannedBookId: false,
      scannedData: " ",
      btnState: "normal",
      transactionMsg: "",
    };
  }

  getCamPermissions = async (id) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    console.log(status);
    this.setState({
      hasPermission: status === "granted",
      btnState: id,
      scanned: false,
    });
  };

  handleScan = async ({ type, data }) => {
    const { btnState } = this.state;

    if (btnState === "bookId") {
      this.setState({
        scanned: true,
        scannedBookId: data,
        btnState: "normal",
      });
    } else if (btnState === "studentId") {
      this.setState({
        scanned: true,
        scannedStudentId: data,
        btnState: "normal",
      });
    }
  };

  handleTransaction = async () => {
    var transactionType = await this.checkBookElgiblity;

    console.log(transactionType);

    if (!transactionType) {
      alert("The book does don't exist in our database (yet)");

      this.setState({
        scannedStudentId: " ",
        scannedBookId: " ",
      });
    } else if (transactionType === "Issue") {
      var isStudentElgible = await this.checkStudentElgiblityBookIssue;

      if (isStudentElgible) {
        this.InitializeBookIssue;
        alert("Book issued to the student");
      }
    } else {
      var isStudentElgible = await this.checkStudentElgiblityBookReturn;
      if (isStudentElgible) {
        this.InitializeBookReturn;
        alert("Book Returned!");
      }
    }

    db.collection("Books")
      .doc(this.state.scannedBookId)
      .get()
      .then((doc) => {
        console.log(doc);
        var book = doc.data();

        if (book.bookAvailablity) {
          this.InitializeBookIssue();
          transactionType = "Book issued";
          ToastAndroid.show(transactionType, ToastAndroid.SHORT);
        } else {
          this.InitializeBookReturn();
          transactionType = "Book returned";
          ToastAndroid.show(transactionType, ToastAndroid.SHORT);
        }

        this.setState({
          transactionMsg: transactionMsg,
        });
      });
  };

  checkStudentElgiblityBookReturn = async () => {
    const transactionRef = db.collection("Transations")
      .where("bookId", "===", this.state.scannedBookId).limit(1)
      .get()
      var isStudentElgible = '' 
      transactionRef.docs.map( doc =>{
          var lastBookTransaction = doc.data();
          if (lastBookTransaction.noOfBooksIssued < 2){
isStudentElgible = true;
          }else{
            isStudentElgible = false;
            alert('Student has already issued 2 books')

            this.setState({
              scannedStudentId: " ",
              scannedBookId: " ",
            });
          }
        })
      

      return isStudentElgible
  };



  checkStudentElgiblityBookIssue = async () => {
    const studentRef = db      .collection("Students")
      .where("studentId", "===", this.state.scannedStudentId)
      .get()
      var isStudentElgible = '' 
      if (studentRef.docs.length == 0){
        this.setState({
          scannedStudentId: " ",
          scannedBookId: " ",
        });

        isStudentElgible = false;
        alert('student Id does not exist!')

      }else{
        studentRef.docs.map( doc =>{
          var student = doc.data();
          if (student.noOfBooksIssued < 2){
isStudentElgible = true;
          }else{
            isStudentElgible = false;
            alert('Student has already issued 2 books')

            this.setState({
              scannedStudentId: " ",
              scannedBookId: " ",
            });
          }
        })
      }

      return isStudentElgible
  };


  InitializeBookIssue = async () => {
    db.collection("Transactions").add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "issued",
    });
    db.collection("Books").doc(this.state.scannedBookId).update({
      bookAvailablity: false,
    });
    db.collection("Students")
      .doc(this.state.scannedStudentId)
      .update({
        noOfBooksIssued: firebase.firestore.FieldValue.increment(1),
      });
    alert("Book Issued");

    this.setState({
      scannedStudentId: " ",
      scannedBookId: " ",
    });
  };

  InitializeBookReturn = async () => {
    db.collection("Transactions").add({
      studentId: this.state.scannedStudentId,
      bookId: this.state.scannedBookId,
      date: firebase.firestore.Timestamp.now().toDate(),
      transactionType: "return",
    });
    db.collection("Books").doc(this.state.scannedBookId).update({
      bookAvailablity: true,
    });
    db.collection("Students")
      .doc(this.state.scannedStudentId)
      .update({
        noOfBooksIssued: firebase.firestore.FieldValue.increment(-1),
      });
    alert("Book Returned");

    this.setState({
      scannedStudentId: " ",
      scannedBookId: " ",
    });
  };

  render() {
    if (this.state.hasPermission && this.state.btnState === true) {
      return (
        <BarCodeScanner
          onBarCodeScanned={this.state.scanned ? undefined : this.handleScan}
          style={StyleSheet.absoluteFillObject}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <KeyboardAvoidingView behavior="padding" enabled>
            <View style={styles.row}>
              <Icon
                style={styles.icon}
                name="money-check"
                color="#7f5af0"
                size={27}
              />
              <Text style={styles.title}>Transactions</Text>
            </View>

            <TextInput
              placeholder="Student Id"
              keyboardAppearance="dark"
              style={styles.input}
              onChangeText={(txt) => {
                this.setState({
                  scannedStudentId: txt,
                });
              }}
              value={this.state.scannedStudentId}
            ></TextInput>

            <TouchableOpacity
              style={styles.scan}
              onPress={this.getCamPermissions(studentId)}
            >
              <Text>Scan Student Id </Text>
            </TouchableOpacity>

            <TextInput
              placeholder="Book Id"
              keyboardAppearance="dark"
              style={styles.input}
              onChangeText={(txt) => {
                this.setState({
                  scannedBookId: txt,
                });
              }}
              value={this.state.scannedBookId}
            ></TextInput>

            <TouchableOpacity
              style={styles.scan}
              onPress={this.getCamPermissions(bookId)}
            >
              <Text>Scan Book Id </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.scan}
              onPress={this.handleTransaction()}
            >
              <Text>Submit </Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#16161a",
  },
  row: {
    flexDirection: "row",
  },
  icon: {
    padding: 10,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#fffffe",
  },
  scan: {
    alignItems: "center",
    backgroundColor: "#DDDDDD",
    padding: 10,
  },
});
