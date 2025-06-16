import {
  ref,
  get as getFromDatabase,
  set,
  remove,
  onValue,
  Database,
} from "@firebase/database";
import GenericHelper from "./generichelper";

export default class LobbyHelper {
  public static createLobby(
    db: Database | undefined,
    playerId: string,
    setLobby: (lobbyObject: any) => void
  ) {
    if (db) {
      const lobbyId = GenericHelper.generateId(6);
      const lobbyRef = ref(db, `lobbies/${lobbyId}`);
      const playerRef = ref(db, `players/${playerId}`);
      getFromDatabase(playerRef).then((snapshot: any) => {
        const player = snapshot.val();
        const lobbyObject = {
          id: lobbyId,
          players: {
            [playerId]: { ...player },
          },
        };
        set(lobbyRef, { ...lobbyObject });
        remove(playerRef);
        setLobby(lobbyObject);
        onValue(lobbyRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setLobby(data);
          } else {
            setLobby(undefined);
          }
        });
      });
    }
  }
  public static joinLobby(
    db: Database | undefined,
    playerId: string,
    setLobby: (lobbyObject: any) => void
  ) {
    if (db) {
      let lobbyId = prompt("Enter the lobby ID to join:");
      if (lobbyId) {
        lobbyId = lobbyId.trim();
        const playerRef = ref(db, `players/${playerId}`);
        const lobbyRef = ref(db, `lobbies/${lobbyId}`);
        getFromDatabase(playerRef).then((playerSnapshot) => {
          getFromDatabase(lobbyRef).then((lobbySnapshot) => {
            const playerData = playerSnapshot.val();
            const lobbyData = lobbySnapshot.val();
            const updatedLobby = {
              ...lobbyData,
              players: {
                ...lobbyData.players,
                [playerId]: { ...playerData },
              },
            };
            set(lobbyRef, { ...updatedLobby });
            remove(playerRef);
            setLobby(updatedLobby);
          });
        });
        onValue(lobbyRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            setLobby(data);
          } else {
            setLobby(undefined);
          }
        });
      }
    }
  }
  public static leaveLobby(
    db: Database | undefined,
    playerId: string,
    lobby: any,
    setLobby: (lobbyObject: any) => void
  ) {
    if (db) {
      const lobbyRef = ref(db, `lobbies/${lobby.id}`);
      const playerRef = ref(db, `lobbies/${lobby.id}/players/${playerId}`);
      getFromDatabase(playerRef).then((snapshot) => {
        const playerData = snapshot.val();
        const lobbyObject = { ...lobby };
        remove(playerRef);
        const newPlayerRef = ref(db, `players/${playerId}`);
        set(newPlayerRef, { ...playerData });
        delete lobbyObject.players[playerId];
        if (Object.keys(lobbyObject.players ?? {}).length === 0) {
          // If there are no players left in the lobby, remove the lobby
          remove(lobbyRef);
          setLobby(undefined);
        } else {
          set(lobbyRef, { ...lobbyObject });
          setLobby(undefined);
        }
      });
    }
  }
}
