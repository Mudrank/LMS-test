 ```js
 
 import * as firebase from 'firebase';
 require("@firebase/firestore")

 var firebaseConfig = {
   apiKey: "AIzaSyBuRVhS76vTlFOoReds7fQkZLPrdt97zFc",
   authDomain: "lms-b74c3.firebaseapp.com",
   projectId: "lms-b74c3",
   storageBucket: "lms-b74c3.appspot.com",
   messagingSenderId: "56740694912",
   appId: "1:56740694912:web:5e8e3aa45485cd5821cf65",
   measurementId: "G-D5W3NMBXX6"
 };
 // Initialize Firebase
 const firebaseApp = firebase.initializeApp(firebaseConfig);

 const db = firebaseApp.firestore();
 export default db;


 ```
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

      ````
        
      ````