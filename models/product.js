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

function createProduct(data){
    var productsRef = ref(db, '/products/'+data.id)
    set(productsRef, data)
}

function deleteProduct(pid){
    remove(ref(db, '/products/'+pid))
}

function rate(pid, data){
    var ratingRef=ref(db, '/products/'+pid+'/rating/rating')
    var ratingsRef=ref(db, '/products/'+pid+'/rating/number')
    var rateRef=ref(db, '/products/'+pid+'/rating/rate')
    get(ratingRef).then((snapshot)=>{
        if(snapshot.exists()){
            get(ratingsRef).then((ratings)=>{
                var newRate = (snapshot.val()+data.rating)/(ratings.val()+1)
                set(rateRef, newRate.toFixed(1))
                set(ratingRef, snapshot.val()+data.rating)
                set(ratingsRef, ratings.val()+1)
            })
        }else{
            set(ratingRef, data.rating)
            set(ratingsRef, 1)
            set(rateRef, data.rating)
        }
    })
}

function addReview(data, pid){
    var productRef = ref(db, '/products/'+pid+'/reviews/')
    push(productRef, data)
    if(data.rating){
        rate(pid, data)
    }
}

function deleteReview(pid, reviewID){
    var reviewRef = ref(db, '/products/'+pid+'/reviews/'+reviewID)
    remove(reviewRef)
}

// createProduct({
//     id: 'anime',
//     title: 'anime tshirt',
//     photos:{
//         1:{
//             url:'https://images.pexels.com/photos/18399245/pexels-photo-18399245/free-photo-of-brunette-woman-posing-on-a-field.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
//         },
//         2:{
//             url:'https://images.pexels.com/photos/18427938/pexels-photo-18427938/free-photo-of-autumn-mountains.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load'
//         }
//     },
//     desc: 'An amazing anime T-shirt loved by anime fans!'
// })

addReview({
    photos:{
                0:{
                    url:'https://images.pexels.com/photos/15919897/pexels-photo-15919897/free-photo-of-woman-sitting-on-platform.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load'
                },
                1:{
                    url:'https://images.pexels.com/photos/17079655/pexels-photo-17079655/free-photo-of-tents-on-camping-in-mountains.jpeg?auto=compress&cs=tinysrgb&w=1600&lazy=load'
                }
            },
    title:'Cool one',
    desc:'lorem ipsum dor',
    uid: "CQJGG4C6LSXgpp5Gxjh8NGbVes02"
}, 'anime')