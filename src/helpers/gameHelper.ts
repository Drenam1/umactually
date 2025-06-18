import {
  getDatabase,
  onChildAdded,
  onChildRemoved,
  onValue,
  ref,
  set,
} from "@firebase/database";
import { Lobby } from "../models/Lobby";

export default class GameHelper {
  public static initGame() {
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

  public static startGame(db: any, lobby: Lobby) {
    const lobbyRef = ref(db, `lobbies/${lobby.id}`);
    set(lobbyRef, { ...lobby, started: true });
  }
}
