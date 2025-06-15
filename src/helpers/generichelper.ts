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
}
