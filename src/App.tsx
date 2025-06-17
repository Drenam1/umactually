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
  get as getFromDatabase,
  ref,
  set,
  Database,
  onValue,
  remove,
} from "firebase/database";
import LobbyControlBar from "./components/pages/lobbyControlBar/LobbyControlBar";
import LobbyHelper from "./helpers/lobbyHelper";
import GameHelper from "./helpers/gameHelper";
import "./App.css";
import { Player } from "./models/Player";
import { Lobby } from "./models/Lobby";

function App() {
  const [auth, setAuth] = React.useState<Auth>();
  const [db, setDb] = React.useState<Database>();
  const [playerId, setPlayerId] = React.useState<string>("");
  const [lobbyId, setLobbyId] = React.useState<string>("");
  const [player, setPlayer] = React.useState<Player>();
  const [lobby, setLobby] = React.useState<Lobby>();

  React.useEffect(() => {
    const authInstance = getAuth();
    const dbInstance = getDatabase();
    setAuth(authInstance);
    setDb(dbInstance);
  }, []);

  React.useEffect(() => {
    if (!playerId) {
      setPlayer(undefined);
    } else {
      const playerRef = db && ref(db, `players/${playerId}`);
      if (db && playerRef) {
        getFromDatabase(playerRef).then((snapshot) => {
          const playerData = snapshot.val();
          if (playerData) {
            setPlayer(playerData as Player);
          }
        });

        onValue(playerRef, (snapshot) => {
          const playerData = snapshot.val();
          if (playerData) {
            setPlayer(playerData as Player);
          }
        });
      }
    }
  }, [playerId, db]);

  React.useEffect(() => {
    if (!lobbyId) {
      setLobby(undefined);
    } else {
      const lobbyRef = db && ref(db, `lobbies/${lobbyId}`);
      if (db && lobbyRef) {
        getFromDatabase(lobbyRef).then((snapshot) => {
          const lobbyData = snapshot.val();
          if (lobbyData) {
            setLobby(lobbyData as Lobby);
          }
        });

        onValue(lobbyRef, (snapshot) => {
          const lobbyData = snapshot.val();
          if (lobbyData) {
            setLobby(lobbyData as Lobby);
          }
        });
      }
    }
  }, [lobbyId, db]);

  React.useEffect(() => {
    if (auth && db) {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setPlayerId(user.uid);
        } else {
          // If the user is not authenticated, create a new anonymous user
          signInAnonymously(auth)
            .then((userCredential) => {
              // Signed in
              const user = userCredential.user;
              setPlayerId(user.uid);
            })
            .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
              console.error(`Error signing in: ${errorCode} - ${errorMessage}`);
            });
        }
      });
    }
  }, [auth, db]);

  React.useEffect(() => {
    if (playerId && db) {
      const playerRef = ref(db, `players/${playerId}`);

      const name = GenericHelper.createName();

      const playerObject: Player = {
        id: playerId,
        name: name,
        question: "",
        points: 0,
      };

      setPlayer(playerObject);

      set(playerRef, { ...playerObject });

      // Remove me from database when I disconnect

      // Begin the game
      GameHelper.initGame();
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
          if (lobby) {
            const lobbyRef = ref(db, `lobbies/${lobby.id}`);
            const playerLobbyRef = ref(
              db,
              `lobbies/${lobby.id}/players/${playerId}`
            );

            onDisconnect(playerLobbyRef)
              .remove()
              .then(() => {
                if (lobbyRef && lobby) {
                  if (playerId) {
                    if (Object.keys(lobby.players ?? {}).length === 0) {
                      // If there are no players left in the lobby, remove the lobby
                      onDisconnect(lobbyRef).remove();
                    }
                  }
                }
              });
          }
        });
    }
  }, [db, lobby, player, playerId]);

  return (
    <header className="App-header">
      {player && (
        <LobbyControlBar
          createLobby={() => LobbyHelper.createLobby(db, player, setLobbyId)}
          joinLobby={() => LobbyHelper.joinLobby(db, player, setLobbyId)}
          leaveLobby={() =>
            LobbyHelper.leaveLobby(db, player, lobby, setLobbyId)
          }
          lobby={lobby}
          player={player}
          updatePlayerName={(name: string) => {
            if (db) {
              GenericHelper.updatePlayer(
                db,
                playerId,
                { ...player, name },
                lobby
              );
            }
          }}
        />
      )}
      {player && lobby && lobby?.players?.length > 1 && (
        <div className="lobby-info">
          <h2>Lobby: {lobby.id}</h2>
          <p>Players:</p>
          <ul>
            {Object.values(lobby.players).map((p: any) => (
              <li key={p.id}>
                {p.name} (Points: {p.points})
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  );
}

export default App;
