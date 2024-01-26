// Require the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, child, push, update, onValue } = require('firebase/database')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendSignInLinkToEmail, signInWithPhoneNumber   } = require('firebase/auth')

const firebaseConfig = {
  apiKey: "AIzaSyC4plBV-fHAMVskez6ehxPDNbEhvMbaFoQ",
  authDomain: "rutwa-in.firebaseapp.com",
  databaseURL: "https://rutwa-in-default-rtdb.firebaseio.com",
  projectId: "rutwa-in",
  storageBucket: "rutwa-in.appspot.com",
  messagingSenderId: "1006936828276",
  appId: "1:1006936828276:web:6fd09b43ccb6a3bde3e421",
  measurementId: "G-6R3F77FJ65"
};

// Initialize Firebase
const fire = initializeApp(firebaseConfig);
const db = getDatabase(fire);
const auth = getAuth(fire);

function createEmailUser(data) {

    createUserWithEmailAndPassword(auth, data.email, data.password)
    .then((userCredential) => {
      console.log(userCredential.user.uid)
      // Signed in 
      const userID = userCredential.user.uid;
          
  
    // Write the new post's data simultaneously in the users list and the user's post list.
    const updates = {};
    updates['/users/' + userID] = data;
    update(ref(db), updates);
      logins = ref(db, '/users/'+userID+'/logins')
      console.log(logins)
      const id = push(logins).key;
      const upddates = {};
      upddates['/users/'+userID+'/logins/'+id] = {date: new Date()};
      update(ref(db), upddates);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      return errorCode;
      // ..
    });
  }

  function signInEmail(data){
    signInWithEmailAndPassword(auth, data.email, data.password)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    const dbRef = ref(db, '/users');

onValue(dbRef, (snapshot) => {
  snapshot.forEach((childSnapshot) => {
    if(childSnapshot.child('/email').val()==data.email){
      logins = ref(db, '/users/'+childSnapshot.key+'/logins')
      console.log(logins)
      const id = push(logins).key;
      const updates = {};
      updates['/users/'+childSnapshot.key+'/logins/'+id] = {date: new Date()};
      update(ref(db), updates);
    }
    // ...
  });
}, {
  onlyOnce: true
});
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  });
  }