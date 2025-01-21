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
        if (currentUser && currentUser.email) {
          console.log("Trying to send API req");
          fetch("/api/createEmailEntry", {
            // Adjust the endpoint path here
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email: currentUser.email }),
          })
            .then((response) => {
              if (!response.ok) {
                throw new Error("Network response was not ok");
              }
              return response.json();
            })
            .then((data) => {
              console.log(data);
            });
        }
      })
      .catch((error) => {
        console.log("Sign-in error");
        setButtonText("Sign In");
      });
    console.log("Finished Sign In process");
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
          <img src={user.photoURL || "./profile.png"} alt="PFP"></img>
          <div>{user.email}</div>
        </div>
      )}
    </div>
  );
};

export default SignInButton;
