import React from "react";
import { StyleSheet, Text, View, TextInput } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome5";

export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      allTransactions: [],
      lastTransaction: null,
      search: "",
    };
  }

  fetchData = async () => {
    var text = this.state.search.toUpperCase();
    text = text.split(" ");
    console.log(text);
    if (text[0].toUpperCase() === "B") {
      const transaction = await db
        .collection("Transactions")
        .where("bookId", "===", text)
        .startAfter(this.state.lastTransaction)
        .limit(10)
        .get();

      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data],
          lastTransaction: doc,
        });

        console.log();
      });
    } else if (text[0].toUpperCase() === "S") {
      const transaction = await db
        .collection("Transactions")
        .where("studentId", "===", text)
        .startAfter(this.state.lastTransaction)
        .limit(10)
        .get();

      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data],
          lastTransaction: doc,
        });
      });
    }
  };

  searchTransaction = async (txt) => {
    var text = text.split(" ");
    console.log(text);
    if (text[0].toUpperCase() === "B") {
      const transaction = await db
        .collection("transactions")
        .where("bookId", "===", text)
        .get();

      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data],
          lastTransaction: doc,
        });
      });
    } else if (text[0].toUpperCase() === "S") {
      const transaction = await db
        .collection("transactions")
        .where("studentId", "===", text)
        .get();

      transaction.docs.map((doc) => {
        this.setState({
          allTransactions: [...this.state.allTransactions, doc.data],
          lastTransaction: doc,
        });
      });
    }
  };

  componentDidMount = async () => {
    const ref = await db.collection("Transactions").limit(10).get();
    ref.docs.map((doc) => {
      this.setState({
        allTransactions: [],
        lastTransaction: doc,
      });
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.row}>
          <Icon style={styles.icon} name="search" color="#7f5af0" size={27} />
          <Text style={styles.title}>Search</Text>
        </View>
        <TextInput
          placeholder="Search Book/Student Id"
          onChangeText={(text) => {
            this.setState({ search: text });
          }}
          style={styles.inputBox}
          value={this.state.scannedBookId}
        />

        <TouchableOpacity
          style={styles.searchBtn}
          onPress={() => {
            this.searchTransaction(this.state.search);
          }}
        >
          <Text>Search</Text>
        </TouchableOpacity>

        <FlatList
          data={this.state.allTransactions}
          renderItem={({ item }) => (
            <View style={{ borderBottomWidth: 2 }}>
              <Text>{"BookId:" + item.bookId}</Text>
              <Text>{"studentId:" + item.studentId}</Text>
              <Text>{"transaction:" + item.transactionType}</Text>
              <Text>{"Date: " + item.date}</Text>
            </View>
          )}
          keyExtractor={(item, index) => index.toString()}
          onEndReached={this.fetchData}
          onEndReachedThreshold={0.7}
        />
      </View>
    );
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

  inputBox: {
    width: 200,
    height: 40,
    borderWidth: 1.5,
    borderRightWidth: 0,
    fontSize: 20,
  },
  searchBtn: {
    backgroundColor: "#FBC02D",
    width: 100,
    height: 50,
  },
});
