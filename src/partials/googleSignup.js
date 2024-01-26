import React, { Component } from "react";
import { auth, googleProvider, db } from "../config/firebase";
import {
  signInWithPopup
} from "firebase/auth";
import { ref, push, update } from 'firebase/database';
import './GoogleSignup.css'

export default class GoogleSignup extends Component {

  signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider).then((usercred) => {
        const user = usercred.user;
            const updates = {};
            updates['/users/' + user.uid] = {
              displayName: user.displayName,
              email:user.email,
              photoURL:user.photoURL
            };
            update(ref(db), updates).then(()=>{
            var logins = ref(db, '/users/'+user.uid+'/logins')
            const id = push(logins).key;
            const upddates = {};
            upddates['/users/'+user.uid+'/logins/'+id] = {date: new Date()};
            update(ref(db), upddates).then(()=>{
            window.location = '/'
            })

            })
      });
    } catch (err) {
      alert(err);
    }
  };

  render() {
    return (
      <div>
        <button className="btn-google" onClick={this.signInWithGoogle}></button>
      </div>
    );
  }
}

