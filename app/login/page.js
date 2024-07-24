"use client";
import { useUserAuth } from "@utils/auth-context.js";
import { auth } from "@utils/firebase";
import {
  getAuth,
  sendPasswordResetEmail,
  signInWithEmailAndPassword
} from "firebase/auth";
import Link from "next/link";
import { useState } from "react";

export default function Page() {
  const { user, firebaseSignOut } = useUserAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

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
    <div  className="bg-gradient-to-t from-yellow-100 to-white flex justify-center items-center h-screen">
            <div className="w-1/2 h-screen hidden lg:block">
        <img
          src="https://fastly.picsum.photos/id/499/5000/3333.jpg?hmac=8XkC7IrqC_XkTuZ5BjOznGC4o7ka4SP5JY-sl07ajRk"
          alt="Placeholder Image"
          className="object-cover w-full h-full"
        />
      </div>
      <div className=" sm:p-20   lg:w-1/2 bg-white shadow  rounded-lg divide-y divide-gray-200  w-full ">
      
        {!user && (
          <div>
          <h1 className="text-2xl font-semibold mb-4">Login</h1>
          <form onSubmit={handleEmailPasswordSignIn}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full"
                required
              />
            </div>
            <div className="mb-6 text-blue-500">
              <button
                type="button"
                onClick={handlePasswordReset}
                className="hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <button
              type="submit"
              className="bg-[#FED136] hover:bg-[#EFBB35] text-black font-bold py-2.5 px-8 rounded-full transition duration-300 transform hover:scale-105 w-full text-sm shadow-sm hover:shadow-md font-semibold text-center inline-block"
            >
              <span className="inline-block mr-2">Login</span>
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
          <div className="mt-6 text-blue-500 text-center">
            <Link href="signup" className="hover:underline">
              Sign up Here
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
