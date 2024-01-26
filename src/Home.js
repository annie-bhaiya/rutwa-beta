import React, { Component } from "react";
import { auth } from "./config/firebase";
import { Loader } from "./Loader";

export class Home extends Component {
    constructor(props){
        super(props);
        this.state ={
            user: null, // Set initial state to null
            authReady: false // Add a flag to track if auth state is ready
        }
    }

    componentDidMount(){
        auth.onAuthStateChanged(user => {
            if(user){
                const u = user.toJSON();
                this.setState({
                    user: u,
                    authReady: true // Set authReady flag to true when auth state is ready
                });
            } else {
                this.setState({
                    user: {},
                    authReady: true // Set authReady flag to true even if no user is authenticated
                });
            }
        });
    }

    render() {
        if (this.state.authReady) {
            if (this.state.user && this.state.user.uid) {
                window.location = '/dashboard';
            } else {
                window.location = '/signup';
            }
        }

        return <Loader />;
    }
}
