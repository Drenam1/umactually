/* eslint-disable react-hooks/exhaustive-deps */
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
  get as getFromDatabase,
  Database,
  remove,
} from "firebase/database";

import "./App.css";
import LobbyControlBar from "./components/pages/lobbyControlBar/LobbyControlBar";
import LobbyHelper from "./helpers/lobbyHelper";

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
      };

      setPlayer(playerObject);

      set(playerRef, { ...playerObject });

      // Remove me from database when I disconnect

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

  React.useEffect(() => {
    if (db && player) {
      const playerRef = ref(db, `players/${playerId}`);
      onDisconnect(playerRef)
        .remove()
        .then(() => {
          let lobbyRef: any = undefined;
          if (player.lobbyId) {
            // If the player already has a lobby, we can fetch it
            lobbyRef = ref(db, `lobbies/${player.lobbyId}`);
          }
          if (lobbyRef && lobby) {
            const newLobbyObj = { ...lobby };
            delete newLobbyObj.players[playerId];
            if (Object.keys(newLobbyObj.players ?? {}).length === 0) {
              // If there are no players left in the lobby, remove the lobby
              onDisconnect(lobbyRef).remove();
            }
          }
        });
    }
  }, [db, lobby, player, playerId]);

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
    });

    onChildRemoved(allLobbiesRef, (snapshot) => {
      // Fires when a node is removed from the tree
    });
  }

  return (
    <header className="App-header">
      {player && (
        <LobbyControlBar
          createLobby={() => LobbyHelper.createLobby(db, playerId, setLobby)}
          joinLobby={() => LobbyHelper.joinLobby(db, playerId, setLobby)}
          leaveLobby={() =>
            LobbyHelper.leaveLobby(db, playerId, lobby, setLobby)
          }
          player={player}
          lobby={lobby}
        />
      )}
    </header>
  );
}

export default App;
