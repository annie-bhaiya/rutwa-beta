import { Component } from "react";
import { auth } from "./config/firebase";
import { signOut } from "firebase/auth";

export class Logout extends Component{
componentDidMount(){
    signOut(auth).then(()=>{
        window.location.href="/login"
    })
}
render(){
    return(
        <div>
            <h1>Logging out...</h1>
        </div>
    );
}
}