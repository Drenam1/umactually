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
  ref,
  set,
  Database,
  onValue,
} from "firebase/database";
import LobbyHelper from "./helpers/lobbyHelper";
import GameHelper from "./helpers/gameHelper";
import "./App.css";
import { Player } from "./models/Player";
import { Lobby } from "./models/Lobby";
import StartPage from "./components/pages/startPage/StartPage";
import LobbyControlBar from "./components/lobbyControlBar/LobbyControlBar";
import EnterQuestionPage from "./components/pages/enterQuestionPage/EnterQuestionPage";
import GamePage from "./components/pages/gamePage/GamePage";

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
    } else if (db) {
      LobbyHelper.subscribeToPlayer(db, lobby, playerId, setPlayer);
    }
  }, [playerId, db, lobby]);

  React.useEffect(() => {
    if (!lobbyId) {
      setLobby(undefined);
    } else {
      const lobbyRef = db && ref(db, `lobbies/${lobbyId}`);
      if (db && lobbyRef) {
        onValue(lobbyRef, (snapshot) => {
          const lobbyData = snapshot.val();
          if (lobbyData) {
            setLobby(lobbyData as Lobby);
          } else {
            setLobby(undefined);
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

  console.log(player);
  console.log(lobby);
  const playersArray: any[] = lobby?.players && Object.values(lobby.players);
  const questionsArray = (
    lobby?.players ? playersArray.map((p: any) => p.question) : []
  )
    .filter((q: any) => !!q)
    ?.sort((a: any, b: any) => {
      return a.id.localeCompare(b.id);
    });
  console.log("Questions Array:", questionsArray);

  return (
    <div className="App">
      {db && player && (
        <header className="App-header">
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
                  player.id,
                  { ...player, name },
                  lobby
                );
              }
            }}
          />
          {lobby && !lobby.started && (
            <StartPage
              db={db}
              player={player}
              lobby={lobby}
              setLobbyId={setLobbyId}
            />
          )}
          {lobby?.started && !player.question && (
            <EnterQuestionPage db={db} player={player} lobby={lobby} />
          )}
          {lobby?.started &&
            lobby.players[player.id].question &&
            !player.question && (
              <div className="question-submitted">
                <h2>Question Submitted!</h2>
                <p>
                  Waiting for other players to submit their questions before the
                  round starts.
                </p>
                <h3>Waiting for...</h3>
                <ul>
                  {playersArray
                    .filter((player) => !player.question)
                    .map((p: Player) => (
                      <li key={p.id}>{p.name}</li>
                    ))}
                </ul>
              </div>
            )}
          {lobby?.started &&
            questionsArray.length === Object.values(lobby?.players).length && (
              <GamePage
                db={db}
                player={player}
                lobby={lobby}
                currentQuestion={questionsArray[0]}
                playerArray={playersArray}
              />
            )}
        </header>
      )}
    </div>
  );
}

export default App;
