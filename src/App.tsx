import React from "react";
import GenericHelper from "./helpers/generichelper";
import {
  Auth,
  getAuth,
  onAuthStateChanged,
  signInAnonymously,
} from "firebase/auth";
import {
  getDatabase,
  onDisconnect,
  onValue,
  onChildAdded,
  onChildRemoved,
  ref,
  set,
  Database,
} from "firebase/database";

import "./App.css";

function App() {
  const [auth, setAuth] = React.useState<Auth>();
  const [db, setDb] = React.useState<Database>();
  const [playerId, setPlayerId] = React.useState<string>("");
  const [player, setPlayer] = React.useState<any>();
  const [lobby, setLobby] = React.useState<any>();

  React.useEffect(() => {
    const authInstance = getAuth();
    const dbInstance = getDatabase();
    setAuth(authInstance);
    setDb(dbInstance);
  }, []);

  React.useEffect(() => {
    if (auth && db) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setPlayerId(user.uid);
        }
      });
    }
  }, [auth, db]);

  React.useEffect(() => {
    if (playerId && db) {
      const playerRef = ref(db, `players/${playerId}`);

      const name = GenericHelper.createName();

      const playerObject = {
        id: playerId,
        name: name,
        lobbyId: "",
      };

      setPlayer(playerObject);

      set(playerRef, { ...playerObject });

      // Remove me from database when I disconnect
      onDisconnect(playerRef).remove();

      // Begin the game
      initGame();
      if (auth) {
        signInAnonymously(auth).catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          // ...
          console.error(`Error signing in: ${errorCode} - ${errorMessage}`);
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerId, db, auth]);

  function initGame() {
    const db = getDatabase();
    const allPlayersRef = ref(db, `players`);
    onValue(allPlayersRef, (snapshot) => {
      // Fires whenever a change occurs
    });
    onChildAdded(allPlayersRef, (snapshot) => {
      // Fires when a new node is added to the tree
    });

    onChildRemoved(allPlayersRef, (snapshot) => {
      // Fires when a node is removed from the tree
    });

    const allLobbiesRef = ref(db, `lobbies`);
    onValue(allLobbiesRef, (snapshot) => {
      // Fires whenever a change occurs
    });
    onChildAdded(allLobbiesRef, (snapshot) => {
      // Fires when a new node is added to the tree
      const lobbies = snapshot.val();
      console.log(lobbies);
    });

    onChildRemoved(allLobbiesRef, (snapshot) => {
      // Fires when a node is removed from the tree
    });
  }
  function createLobby() {
    if (db) {
      const lobbyId = GenericHelper.generateId(6);
      const lobbyRef = ref(db, `lobbies/${lobbyId}`);
      const playerRef = ref(db, `players/${playerId}`);
      const lobbyObject = {
        id: lobbyId,
        players: {
          [playerId]: {
            name: player.name,
          },
        },
      };
      set(lobbyRef, { ...lobbyObject });
      set(playerRef, { ...player, lobbyId: lobbyId });
      setLobby(lobbyObject);
      setPlayer({ ...player, lobbyId: lobbyId });
    }
  }

  return (
    <header className="App-header">
      <button onClick={createLobby}>Create lobby</button>
    </header>
  );
}

export default App;
