"use client";

import { User } from "firebase/auth";
import React, { useState } from "react";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "../firebase.config";
import "../app/globals.css";

const SignInButton = () => {
  const [user, setUser] = useState<User | null>(null);
  const [buttonText, setButtonText] = useState("Sign In");

  const handleSignIn = () => {
    setButtonText("Signing In...");
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    signInWithPopup(auth, provider)
      .then((result) => {
        const currentUser = result.user;
        setUser(currentUser);
        const newButtonText = currentUser?.email ? "Sign Out" : "Sign In";
        setButtonText(newButtonText);
      })
      .catch((error) => {
        console.error("Sign-in error:", error.message);
        setButtonText("Sign In");
      });
  };

  const handleSignOut = () => {
    setUser(null);
    setButtonText("Sign In");
  };

  const handleClick = () => {
    if (buttonText === "Sign In") {
      handleSignIn();
    } else {
      handleSignOut();
    }
  };

  return (
    <div className="buttons">
      <button className="sign-in-button" onClick={handleClick}>
        {buttonText}
      </button>
      {user && (
        <div className="user-display">
          <img src="/profile.png"></img>
          <div>{user.email}</div>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
