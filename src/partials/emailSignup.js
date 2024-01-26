import { Component } from "react";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getDatabase, ref, push, update } from 'firebase/database'
import './emailsignup.css'
import GoogleSignup from "./googleSignup";

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
const auth = getAuth(fire);
const db = getDatabase(fire);

export class EmailSignup extends Component{
    constructor(props) {
        super(props);
        this.state = {value: '', email:'', password:'', user:'', phone:''};
    
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this);
      }
    
      handleEmail = async(event) =>{
        this.setState({email: event.target.value});
      }

      handlePhone = async(event) =>{
        this.setState({phone: event.target.value})
      }
    
      handlePassword = async(event) =>{
        this.setState({password: event.target.value});
      }
    
      handleSubmit = async(event) =>{
        createUserWithEmailAndPassword(auth, this.state.email, this.state.password)
        .then((userCredential) => {
            const user = userCredential.user;
            const updates = {};
            updates['/users/' + user.uid] = this.state;
            update(ref(db), updates);
            var logins = ref(db, '/users/'+user.uid+'/logins')
            console.log(logins)
            const id = push(logins).key;
            const upddates = {};
            upddates['/users/'+user.uid+'/logins/'+id] = {date: new Date()};
            update(ref(db), upddates);
            window.location.href = '/dashboard';
    // ...
  })
  .catch((error) => {
    alert(error)
    // ..
  });
        event.preventDefault();
      }
    render(){
        return(
          <div className="container">
          <div className="my-form">
            <h1>SignUp</h1>
            <h5>SignUp to Rutwa to buy the best T-shirts and Hoodies.</h5>
            <form onSubmit={this.handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              className="form-control"
              required
              value={this.state.email}
              onChange={this.handleEmail}
            />
          </div>
        
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              className="form-control"
              required
              value={this.state.password}
              onChange={this.handlePassword}
            />
          </div>
        
          <div className="form-group">
            <label htmlFor="phone">Phone:</label>
            <input
              type="number"
              id="phone"
              className="form-control"
              required
              value={this.state.phone}
              onChange={this.handlePhone}
            />
          </div>
        <div className="submit-container">
          <input type="submit" value="Submit" className="btn btn-primary" />
          </div>
          <div className="login-link">Already have an account? <a href="./login">Login</a>
          </div></form>
          <div className="break">OR</div>
          <div className="social"><GoogleSignup /></div>
        </div>
        </div>
        )
    }
}