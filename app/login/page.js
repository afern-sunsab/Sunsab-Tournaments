"use client";
import { useState, useEffect } from "react";
import { useUserAuth } from "@utils/auth-context.js";
import { auth } from "@utils/firebase";
import {
  signInWithEmailAndPassword,
  signOut,
  getAuth,
  sendPasswordResetEmail,
} from "firebase/auth";
import Link from "next/link";

export default function Page() {
  const { user, firebaseSignOut } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //Document title
	useEffect(() => {
		document.title = "Tournaments - Login";
	}, []);

  function handleSignOut() {
    firebaseSignOut();
  }

  //Handles password reset
  function handlePasswordReset() {
    const auth = getAuth();

    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent.");
      })
      .catch((error) => {
        console.log("Error sending password reset email: " + error.message);
      });
  }

  function handleEmailPasswordSignIn(e) {
    e.preventDefault();

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        //Only allow logging in if email is verified
        /*if(userCredential.user.emailVerified){
			console.log("Email is verified.");
			window.location.href = `/dashboard`;
		}
		else{
			alert("Email is not verified.");
			//signOut(auth);
		}
      */
      })
      .catch((error) => {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        if (errorCode === "auth/invalid-credential") {
          alert("Invalid email or password");
        } else {
          console.log(errorCode, "Error message is ", errorMessage);
        }
      });
  }

  return (
    <div>
      <div className="relative min-h-screen flex items-center justify-center">
        {!user && (
          <div
            dir="ltr"
            className="text-center bg-white dark:bg-gray-500 p-8 rounded-xl"
          >
            <p className="text-xl text-header-text-0 font-semibold mb-5 dark:text-dark-header-text-0">
              Sign in to your account
            </p>
            <form
              onSubmit={handleEmailPasswordSignIn}
              className="mb-6 flex flex-col items-center"
            >
              <input
                type="email"
                value={email}
                className="bg-slate-100 text-black border-s-4 border-slate-300 p-2 mb-4"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                required
              />
              <input
                type="password"
                value={password}
                className="bg-slate-100 text-black border-s-4 border-slate-300 p-2 mb-4"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                required
              />
              <button
                type="submit"
                className="bg-slate-50 bg-navbar-body-0 active:bg-blue-400 active:dark:bg-blue-600 rounded text-black dark:text-white drop-shadow dark:bg-gray-600 p-2"
              >
                Sign In with Email
              </button>
            </form>
            <div className="drop-shadow">
              <button
                onClick={() => handlePasswordReset()}
                className="bg-slate-50 text-black active:bg-blue-400 active:dark:bg-blue-600 dark:text-white dark:bg-gray-600 rounded p-2"
              >
                Forgot Password
              </button>
              <Link
                href="signup"
                className="bg-slate-50 text-black active:bg-blue-400 active:dark:bg-blue-600 ml-6 dark:text-white dark:bg-gray-600 rounded p-2.5"
              >
                Sign Up
              </Link>
            </div>
          </div>
        )}
        {user && (
          <div className="text-center text-header-text-0">
            <p className=" text-3xl">
              Welcome, {user.displayName}
              <br /> <span className="text-xl">[{user.email}]</span>
            </p>
            <button
              onClick={handleSignOut}
              className=" bg-navbar-body-0 text-white py-4 px-6 rounded-xl drop-shadow mt-8"
            >
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
