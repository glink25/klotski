const travelMap = (
  map: Array<Array<number>>,
  fn: (n: number) => void | boolean
) => map.every((col) => col.every(fn));

const generateMap = (col: number) =>
  new Array(col * col)
    .fill(0)
    .map((_, i) => i)
    .sort(() => Math.random() - 0.5)
    .reduce((p, c, i) => {
      if (i % col === 0) {
        p.push([c]);
      } else {
        const j = parseInt(`${i / col}`);
        p[j].push(c);
      }
      return p;
    }, [] as Array<Array<number>>);

const validateMap = (map: Array<Array<number>>) => {
  const flat = map.flat();
  const flatMap = flat.filter((v) => v !== flat.length - 1);
  let count = 0;
  for (let i = 0; i < flatMap.length; i++) {
    for (let j = i + 1; j < flatMap.length; j++) {
      if (flatMap[i] > flatMap[j]) {
        count += 1;
      }
    }
  }
  return count % 2 === 0;
};

export default class Game {
  row: number;
  col: number;
  lastMovedItem: number;
  map: Array<Array<number>>;
  blank: number;
  constructor(row: number, col?: number) {
    if (row < 2) throw new Error("row must bigger than 2");
    this.row = row;
    this.col = col ?? row;
    this.lastMovedItem = -1;
    this.blank = row * this.col - 1;
    this.map = this.initMap();
  }
  private initMap() {
    let map = generateMap(this.col);
    while (!validateMap(map)) {
      map = generateMap(this.col);
    }
    return map;
  }
  findPositionInMap(value: number) {
    let x = -1;
    let y = -1;
    this.map.some((col, i) => {
      return col.some((v, j) => {
        if (v === value) {
          x = i;
          y = j;
          return true;
        }
        return false;
      });
    });
    return [x, y] as [number, number];
  }
  findAround(i: number, j: number) {
    let dir: [number, number] = [-2, -2];
    [
      [1, 0],
      [-1, 0],
      [0, 1],
      [0, -1],
    ].some(([x, y]) => {
      if (this.map[i + x] && this.map[i + x][j + y] === this.blank) {
        dir = [x, y];
        return true;
      }
      return false;
    });
    return dir[0] === -2 ? null : dir;
  }
  move(num: number) {
    const [i, j] = this.findPositionInMap(num);
    if (i === -1 || j == -1) return;

    const direction = this.findAround(i, j);
    if (!direction) return;
    const value = this.map[i][j];

    const move = {
      target: {
        i,
        j,
      },
      value,
      direction: direction.reverse(),
      movable: false,
    };
    if (direction[0] !== null && direction[1] !== null) {
      move.movable = true;
      this.map[i + direction[1]][j + direction[0]] = value;
      this.map[i][j] = this.blank;
    }
    return move;
  }
  check() {
    let i = -1;
    return travelMap(this.map, (v) => {
      const valid = v - i === 1;
      i = v;
      return valid;
    });
  }
  isCorrect(num: number) {
    let v = -1;
    travelMap(this.map, (x) => {
      v += 1;
      return x !== num;
    });
    const correct = v === num;
    return correct;
  }
}
