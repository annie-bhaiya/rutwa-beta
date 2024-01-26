// Require the functions you need from the SDKs you need
const { initializeApp } = require("firebase/app");
const { getDatabase, ref, child, push, update, onValue, remove, get, set } = require('firebase/database')

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

function createcoupon(data){
    couponsRef = ref(db, '/coupons/'+data.code)
    set(couponsRef, data)
}

function deletecoupon(cid){
    remove(ref(db, '/coupons/'+cid))
}

createcoupon({
    code:'WELCOME',
    discount:'10'
})