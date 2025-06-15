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
  remove,
} from "firebase/database";

import "./App.css";
import LobbyControlBar from "./components/pages/lobbyControlBar/LobbyControlBar";

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
            if (Object.keys(newLobbyObj.players).length === 0) {
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

  function leaveLobby() {
    if (db) {
      const lobbyRef = ref(db, `lobbies/${player.lobbyId}`);
      const playerRef = ref(db, `players/${playerId}`);
      const playerObject = { ...player, lobbyId: "" };
      const lobbyObject = { ...lobby };
      delete lobbyObject.players[playerId];
      if (Object.keys(lobbyObject.players).length === 0) {
        // If there are no players left in the lobby, remove the lobby
        remove(lobbyRef);
        setLobby(undefined);
      } else {
        set(lobbyRef, { ...lobbyObject });
        setLobby(lobbyObject);
      }
      set(playerRef, { ...playerObject });
      setPlayer({ ...playerObject });
    }
  }

  function joinLobby() {
    if (db) {
      let lobbyId = prompt("Enter the lobby ID to join:");
      if (lobbyId) {
        lobbyId = lobbyId.trim();
        const lobbyRef = ref(db, `lobbies/${lobbyId}`);
        onValue(lobbyRef, (snapshot) => {
          if (snapshot.exists()) {
            const lobbyData = snapshot.val();
            const playerRef = ref(db, `players/${playerId}`);
            const lobbyRef = ref(db, `lobbies/${lobbyId}`);
            const updatedLobby = {
              ...lobbyData,
              players: {
                ...lobbyData.players,
                [playerId]: {
                  name: player.name,
                },
              },
            };
            set(playerRef, { ...player, lobbyId: lobbyId });
            set(lobbyRef, { ...updatedLobby });
            setLobby(updatedLobby);
            setPlayer({ ...player, lobbyId: lobbyId });
          }
        });
      }
    }
  }

  return (
    <header className="App-header">
      {player && (
        <LobbyControlBar
          createLobby={createLobby}
          joinLobby={joinLobby}
          leaveLobby={leaveLobby}
          player={player}
          lobby={lobby}
        />
      )}
    </header>
  );
}

export default App;
