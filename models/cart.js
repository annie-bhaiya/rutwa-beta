// Require the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, child, push, update, onValue, remove } = require('firebase/database')
const { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } = require('firebase/auth')

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

function addItemToCart(data, uid){
    var dbRef = ref(db, '/users/'+uid+'/cart/')
    const id = push(dbRef).key;
    const updates = {};
    updates['/users/'+uid+'/cart/'+id] = data
    update(ref(db), updates)
}

function removeItemFromCart(itemID, uid){
    var dbRef = ref(db, '/users/'+uid+'/cart/'+itemID)
    remove(dbRef)
}

function getItems(uid){
    var dbRef = ref(db, '/users/'+uid+'/cart/')
    onValue(dbRef, (snapshot)=>{
        var cart = snapshot.val();
        console.log(cart)
    })
}

function emptyCart(uid){
    var dbRef = ref(db, '/users/'+uid+'/cart/')
    remove(dbRef)
}
// for (let i = 0; i < 11; i++) {
//     addItemToCart({id: i, date:new Date()}, 'lyPelJHQQybyX49zuMLBWsZOTXk1')
//   }

getItems('lyPelJHQQybyX49zuMLBWsZOTXk1')