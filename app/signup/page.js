"use client";

import { createUser } from "@utils/user_services";
import {
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signOut,
  updateProfile,
} from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";
import { useUserAuth } from "../_utils/auth-context.js";
import { auth, db } from "../_utils/firebase";

//Change for user
//Add items
export async function addUser(userDoc) {
  console.log("Entered addUser.");
  const itemsRef = collection(db, "users");
  const docRef = await addDoc(itemsRef, userDoc);
  console.log("Document written with ID: ", docRef.id);
  return docRef.id;
}

export default function Page() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { user } = useUserAuth();
  const [name, setName] = useState("");

  //Handles the creation of a new user in Firebase Authentication
  async function handleRegister(e) {
    e.preventDefault();
    //Create user
    console.log("Creating user.");
    await createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Add user data to database
        //alert(userCredential.user)
        //addUserData(userCredential.user);
        //Don't log in yet, wait for email verification
        //signOut(auth);
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/email-already-in-use") {
          alert("An account with this email already exists");
        } else {
          console.log(errorCode, errorMessage);
        }
      });
    //Send email verification
    await sendEmailVerification(auth.currentUser)
      .then(() => {
        console.log("Email verification sent.");
      })
      .catch((error) => {
        console.log("Error sending email verification.: " + error.message);
      });
    //Add user name
    //console.log("Adding username.");
    await updateProfile(auth.currentUser, { displayName: displayName }).catch(
      (error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode, errorMessage);
      }
    );
    await addUserData(auth.currentUser);

    signOut(auth);
    handleRedirect();
  }

  //Add user to database (user collection in Cloud Firestore)
  async function addUserData(user) {
    /*console.log("Entered addUserData.");
    console.log(user.displayName);
    console.log(user.uid);
    console.log(user.email);*/

    const userDoc = {
      username: user.displayName,
      uid: user.uid,
      email: user.email,
      name: name,
    };

	//console.log("SIGNUP: Adding user to database.");
	await createUser(userDoc);
	//console.log("SIGNUP: User added to database.");

    /*
       const userDoc = {
              username: "Sterben",
                role: "customer",
                uid: "1234567890",
                email: "anthonyho992@gmail.com",
                name: "anthony",
        };
        */
    /*console.log("Adding user to database.");

    const docRef = await addUser(userDoc);
    console.log(docRef);
    console.log("User added to database.");*/
  }

  function handleRedirect() {
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen bg-gradient-to-t from-yellow-100 to-white flex flex-col justify-center sm:py-12">
      <div  className="p-10 xs:p-0 mx-auto md:w-full md:max-w-md">
        {!user && (
          <div className="bg-white shadow w-full rounded-lg divide-y divide-gray-200">
          <form onSubmit={handleRegister} className="px-5 py-7">
            <label htmlFor="email" className="block text-gray-600">
                Email
            </label>            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              required
            />
            <label htmlFor="password" className="block text-gray-600">
                Password
            </label>                 
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              required
            />
            <label htmlFor="username" className="block text-gray-600">
                Username
            </label>               
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
              required
            />
            <label htmlFor="name" className="block text-gray-600">
                Name
            </label>               
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
            />
            <button
              type="submit"
              className="bg-[#FED136] hover:bg-[#EFBB35] text-black font-bold py-2.5 px-8 rounded-full transition duration-300 transform hover:scale-105 w-full text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
              >
              <span className="inline-block mr-2">Sign Up with Email</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-4 h-4 inline-block"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </form>
          </div>
        )}
        {user && (
          <div className="min-h-screen flex flex-column items-center justify-center bg-white dark:bg-gray-500">
            <div className="text-slate-500">
              Hi {user.displayName} You will soon be redirected to your
              dashboard
            </div>
            <button
              onClick={handleRedirect}
              className="bg-slate-500 text-white p-2"
            >
              Go to Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
