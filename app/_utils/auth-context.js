"use client";

import React, { useContext, createContext, useState, useEffect } from "react";
import {
	signInWithPopup,
	signOut,
	onAuthStateChanged,
	GithubAuthProvider,
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";
import { getUser } from "./firebase_services";

const AuthContext = createContext(undefined);

export const AuthContextProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [dbUser, setDBUser] = useState(null);
	
	const gitHubSignIn = () => {
		const provider = new GithubAuthProvider();
		return signInWithPopup(auth, provider);
	};
	
	const emailPasswordSignIn = (email, password) => {
		return signInWithEmailAndPassword(auth, email, password);
	};
	
	const emailPasswordSignUp = (email, password) => {
		return createUserWithEmailAndPassword(auth, email, password);
	};
	
	const firebaseSignOut = () => {
		return signOut(auth);
	};
	
	//Create and pass user data to context
	//Database information is stored in user
	//Auth information is stored in user.auth, in case it needs to be passed back to the authenticator
	//dbUser will be deprecated
	useEffect(() => {
		//Async function to fetch user data from Firestore
		const fetchUser = async (uid) => {
			const newUser = await getUser(uid);
			return newUser;
		};
		const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
			//If user is signed in, fetch user data and set it
			if (currentUser)
				fetchUser(currentUser.uid).then((newUser) => {
					setDBUser(newUser);
					setUser({ auth: currentUser, ...newUser });
					//console.log("AUTH-CONTEXT: Auth state changed:")
					//console.log({ auth: currentUser, ...newUser });
				});
			//If user is signed out, set user to null
			else
				setUser(null);
			
		});
		//It's called unsubscribe because it's a function that will unsubscribe the onAuthStateChanged listener
		//Aaron wrote it that way so I'm keeping it
		return () => unsubscribe();
		
	}, [auth.currentUser]);
	
	/*useEffect(() => {
		const fetchUser = async () => {
			const newUser = await getUser(user.uid);
			setDBUser(newUser);
		};
		if (user)
			fetchUser();
	}, [user]);*/
	
	return (
		<AuthContext.Provider value={{dbUser, user, gitHubSignIn, firebaseSignOut, emailPasswordSignIn, emailPasswordSignUp }}>
		{children}
		</AuthContext.Provider>
	);
};

export const useUserAuth = () => {
	//console.log(useContext(AuthContext));
	return useContext(AuthContext);
};