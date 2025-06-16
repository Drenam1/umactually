import { ref, set, Database } from "@firebase/database";
export interface Clock {
  name: string;
  description: string;
  totalSegments: number;
  filledSegments: number;
  repeating: boolean;
}
export default class GenericHelper {
  public static randomFromArray(arr: any[]) {
    return arr[Math.floor(Math.random() * arr.length)];
  }
  public static getKeyString(x: number, y: number) {
    return `${x}x${y}`;
  }

  public static createName() {
    const prefix = GenericHelper.randomFromArray([
      "BRAVE",
      "CLEVER",
      "SWIFT",
      "WISE",
      "BOLD",
      "FIERCE",
      "MIGHTY",
      "FEARLESS",
      "NOBLE",
      "GALLANT",
      "VALIANT",
      "DARING",
    ]);
    const animal = GenericHelper.randomFromArray([
      "LION",
      "TIGER",
      "EAGLE",
      "WOLF",
      "DRAGON",
      "PHOENIX",
      "BEAR",
      "SHARK",
      "FALCON",
      "PANTHER",
      "HAWK",
      "COBRA",
    ]);
    return `${prefix} ${animal}`;
  }

  public static generateId(length: number) {
    let result = "";
    const characters = "abcdefghijklmnopqrstvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  public static updatePlayer(
    db: Database,
    playerId: string,
    playerObject: any,
    lobbyObject?: any
  ) {
    if (db) {
      if (lobbyObject) {
        const lobbyRef = ref(
          db,
          `lobbies/${lobbyObject.id}/players/${playerId}`
        );
        set(lobbyRef, { ...playerObject });
      } else {
        const playerRef = ref(db, `players/${playerId}`);
        set(playerRef, { ...playerObject });
      }
    }
  }

  public static updateLobby(db: Database, lobbyObject?: any) {
    if (db && lobbyObject) {
      const lobbyRef = ref(db, `lobbies/${lobbyObject.id}}`);
      set(lobbyRef, { ...lobbyObject });
    }
  }
}
