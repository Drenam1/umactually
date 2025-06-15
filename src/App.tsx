import React from "react";
import GenericHelper from "./helpers/generichelper";
import { getAuth, onAuthStateChanged, signInAnonymously } from "firebase/auth";
import {
  getDatabase,
  onDisconnect,
  onValue,
  onChildAdded,
  onChildRemoved,
  onChildChanged,
  ref,
  set,
} from "firebase/database";

import "./App.css";

function App() {
  function initGame() {
    const db = getDatabase();
    const allPlayersRef = ref(db, `players`);

    onValue(allPlayersRef, (snapshot) => {
      // Fires whenever a change occurs
      const players = snapshot.val() ?? {};
      Object.keys(players).forEach((key) => {
        const characterState = players[key];
        console.log(`Player ${key} is ${characterState.name}`);
      });
    });
    onChildAdded(allPlayersRef, (snapshot) => {
      // Fires when a new node is added to the tree
    });

    onChildRemoved(allPlayersRef, (snapshot) => {
      // Fires when a node is removed from the tree
    });
  }

  let playerId: any;

  const auth = getAuth();
  const db = getDatabase();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      playerId = user.uid;
      const playerRef = ref(db, `players/${playerId}`);

      const name = GenericHelper.createName();

      set(playerRef, {
        id: playerId,
        name: name,
      });

      // Remove me from database when I disconnect
      onDisconnect(playerRef).remove();

      // Begin the game
      initGame();
    } else {
      // You're logged out
    }
  });
  signInAnonymously(auth).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
    console.error(`Error signing in: ${errorCode} - ${errorMessage}`);
  });

  return (
    <div className="App">
      <header className="App-header">
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
