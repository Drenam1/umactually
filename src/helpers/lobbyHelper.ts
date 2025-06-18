import {
  ref,
  get as getFromDatabase,
  set,
  remove,
  Database,
  onValue,
} from "@firebase/database";
import GenericHelper from "./generichelper";
import { Lobby } from "../models/Lobby";
import { Player } from "../models/Player";

export default class LobbyHelper {
  public static createLobby(
    db: Database | undefined,
    player: any,
    setLobbyId: (lobbyId: string) => void
  ) {
    if (db) {
      const lobbyId = GenericHelper.generateId(6);
      const lobbyRef = ref(db, `lobbies/${lobbyId}`);
      const playerRef = ref(db, `players/${player.id}`);
      const lobbyObject = {
        id: lobbyId,
        players: {
          [player.id]: { ...player, points: 0 },
        },
        started: false,
      };
      set(lobbyRef, { ...lobbyObject });
      remove(playerRef);
      setLobbyId(lobbyId);
    }
  }
  public static joinLobby(
    db: Database | undefined,
    player: any,
    setLobbyId: (lobbyId: string) => void
  ) {
    if (db) {
      let lobbyId = prompt("Enter the lobby ID to join:");
      if (lobbyId) {
        lobbyId = lobbyId.trim().toLowerCase();
        const playerRef = ref(db, `players/${player.id}`);
        const lobbyRef = ref(db, `lobbies/${lobbyId}`);
        getFromDatabase(lobbyRef).then((lobbySnapshot) => {
          const lobbyData = lobbySnapshot.val();
          if (!lobbyData?.started) {
            const updatedLobby = {
              ...lobbyData,
              players: {
                ...lobbyData.players,
                [player.id]: { ...player, points: 0 },
              },
            };
            set(lobbyRef, { ...updatedLobby });
            remove(playerRef);
            if (lobbyId) {
              setLobbyId(lobbyId);
            }
          }
        });
      }
    }
  }
  public static leaveLobby(
    db: Database | undefined,
    player: any,
    lobby: any,
    setLobbyId: (setLobbyId: string) => void
  ) {
    if (db) {
      const playerRef = ref(db, `lobbies/${lobby.id}/players/${player.id}`);
      const lobbyPlayersRef = ref(db, `lobbies/${lobby.id}/players`);
      remove(playerRef);
      const newPlayerRef = ref(db, `players/${player.id}`);
      set(newPlayerRef, { ...player, points: 0 });
      getFromDatabase(lobbyPlayersRef).then((snapshot) => {
        const playersData = snapshot.val();
        if (!playersData || Object.keys(playersData).length === 0) {
          const lobbyRef = ref(db, `lobbies/${lobby.id}`);
          remove(lobbyRef);
        }
        setLobbyId("");
      });
    }
  }

  public static subscribeToPlayer(
    db: Database,
    lobby: Lobby | undefined,
    playerId: string,
    setPlayer: (player: Player | undefined) => void
  ) {
    const playerRef = lobby
      ? ref(db, `lobbies/${lobby.id}/players/${playerId}`)
      : ref(db, `players/${playerId}`);
    if (db && playerRef) {
      onValue(playerRef, (snapshot) => {
        const playerData = snapshot.val();
        if (playerData) {
          setPlayer(playerData as Player);
        } else {
          setPlayer(undefined);
        }
      });
    }
  }
}
