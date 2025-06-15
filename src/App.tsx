import React from "react";
import logo from "./logo.svg";
import GenericHelper from "./helpers/generichelper";

import * as FirebaseAuth from "firebase/auth";
import * as FirebaseDatabase from "firebase/database";
import "./App.css";

function App() {
  const playerColors = ["red", "orange", "yellow", "green", "purple"];

  let playerId;
  let playerRef;
  let players = {};
  let playerElements = {};

  const gameContainer = document.querySelector(".game-container");

  const auth = FirebaseAuth.getAuth();
  const db = FirebaseDatabase.getDatabase();
  FirebaseAuth.onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log(user);
      playerId = user.uid;
      const playerRef = FirebaseDatabase.ref(db, `players/${playerId}`);

      const name = GenericHelper.createName();

      FirebaseDatabase.set(playerRef, {
        id: playerId,
        name: name,
        direction: "right",
        color: GenericHelper.randomFromArray(playerColors),
        x: 3,
        y: 10,
        coins: 0,
      });

      // Remove me from database when I disconnect
      FirebaseDatabase.onDisconnect(playerRef).remove();

      // Begin the game
      //initGame();
    } else {
      // You're logged out
    }
  });
  FirebaseAuth.signInAnonymously(auth).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
    console.error(`Error signing in: ${errorCode} - ${errorMessage}`);
  });

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
