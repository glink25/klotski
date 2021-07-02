import {
  Component,
  Event,
  Img,
  Linear,
  Rect,
  Text,
  Tween,
  Mask,
  Bounce,
  Elastic,
} from "canvee";
import { Point, Size } from "canvee/lib/packages/type";
import {
  boardBackground,
  boardItemBackground,
  emphasisColor,
  textColor,
} from "../theme";
import { CustomEmitter } from "../utils/typeUtil";
import Game from "./game";

type BoardArg = {
  level?: number;
  onMove?: () => void;
  onSuccess?: () => void;
  image?: HTMLImageElement;
};

function animatedMove(comp: Component, offset: Point, after = () => {}) {
  const from = { ...comp.transform.position };
  // const tween = new Tween({
  //   from: 0,
  //   to: 200,
  //   curve: Linear,
  //   duration: 200,
  // }).slicing((_, p) => {
  //   comp.transform.position.x = from.x + offset.x * p;
  //   comp.transform.position.y = from.y + offset.y * p;
  // });
  // tween.play().after(after);
  const tweenX = new Tween({
    from: from.x,
    to: from.x + offset.x,
    curve: Elastic.easeOut,
    duration: 400,
  }).slicing((v, p) => {
    comp.transform.position.x = v;
  });
  const tweenY = new Tween({
    from: from.y,
    to: from.y + offset.y,
    curve: Elastic.easeOut,
    duration: 400,
  }).slicing((v, p) => {
    comp.transform.position.y = v;
  });
  tweenY.play();
  tweenX.play().after(after);
}

function createNumberItem(
  size: Size,
  i: number,
  j: number,
  padding: number,
  value: number,
  _image: HTMLImageElement,
  _level: number
) {
  const item = new Rect({
    transform: {
      size,
      anchor: {
        x: 0,
        y: 0,
      },
      position: {
        x: size.width / 2 + padding + (size.width + padding) * i,
        y: size.height / 2 + padding + (size.height + padding) * j,
      },
    },
    backgroundColor: boardItemBackground,
    borderRadius: 4,
  });
  item.addChild(
    new Text({
      text: value.toString(),
      transform: {
        anchor: {
          x: 0.5,
          y: 0.5,
        },
      },
      style: {
        fill: textColor,
        fontWeight: "bold",
      },
    })
  );
  return item;
}
function createImageItem(
  size: Size,
  i: number,
  j: number,
  padding: number,
  _value: number,
  image: HTMLImageElement,
  level: number
) {
  const valueY = parseInt(`${_value / level}`);
  const valueX = _value % level;
  const item = new Rect({
    transform: {
      size,
      anchor: {
        x: 0,
        y: 0,
      },
      position: {
        x: size.width / 2 + padding + (size.width + padding) * i,
        y: size.height / 2 + padding + (size.height + padding) * j,
      },
    },
    backgroundColor: boardItemBackground,
    borderRadius: 4,
  });
  const w = image.width / level;
  const img = new Img({
    transform: { size, anchor: { x: 0.5, y: 0.5 } },
    image,
    clip: {
      x: w * valueX,
      y: w * valueY,
      w,
      h: image.height / level,
    },
  });
  item.addChild(img);
  item.use(new Mask());
  if (level < 7)
    item.addChild(
      new Text({
        text: _value.toString(),
        transform: {
          anchor: {
            x: 0.5,
            y: 0.5,
          },
        },
        style: {
          fill: textColor,
          fontWeight: "bold",
        },
      })
    );
  return item;
}

export default function createBoard({ level = 3, image }: BoardArg) {
  const game = new Game(level);
  const BOARD_SIZE = {
    width: 320,
    height: 320,
  };
  const padding = 8;
  const ITEM_SIZE = {
    width: (BOARD_SIZE.width - padding * (level + 1)) / level,
    height: (BOARD_SIZE.width - padding * (level + 1)) / level,
  };
  const board = new Rect({
    transform: {
      size: BOARD_SIZE,
      anchor: {
        x: 0.5,
        y: 0.5,
      },
    },
    name: "board",
    backgroundColor: boardBackground,
    borderRadius: 4,
  });

  const items: Rect[] = new Array(game.blank);

  const validateItem = image
    ? () => {
        for (let i = 0; i < items.length; i++) {
          if (game.isCorrect(i)) {
            items[i].children[0].transform.alpha = 1;
          } else {
            items[i].children[0].transform.alpha = 0.5;
          }
        }
      }
    : () => {
        for (let i = 0; i < items.length; i++) {
          if (game.isCorrect(i)) {
            items[i].backgroundColor = emphasisColor;
            (items[i].children[0] as Text).style.fill = "white";
          } else {
            items[i].backgroundColor = boardItemBackground;
            (items[i].children[0] as Text).style.fill = textColor;
          }
        }
      };
  const createItem = image ? createImageItem : createNumberItem;

  let isSucceed = false;
  const getIsSucced = () => isSucceed;

  game.map.forEach((row, j) => {
    row.forEach((value, i) => {
      if (value === game.blank) return;
      const item = createItem(ITEM_SIZE, i, j, padding, value, image!, level);
      const event = item.use(new Event());
      let canTap = true;
      event.on("pointerup", () => {
        if (!canTap) return;

        const move = game.move(value);
        if (move && move.movable) {
          canTap = false;
          animatedMove(
            item,
            {
              x: move.direction[0]! * (ITEM_SIZE.width + padding),
              y: move.direction[1]! * (ITEM_SIZE.height + padding),
            },
            () => {
              if (getIsSucced()) return;
              canTap = true;
              const isRight = game.check();
              validateItem();
              if (isRight) {
                isSucceed = true;
                canTap = false;
                board.emit("succed", undefined, { bubble: true });
              }
            }
          );
          item.emit("move", undefined, { bubble: true });
        }
      });
      items[value] = item;
      board.addChild(item);
    });
  });
  validateItem();
  return board as CustomEmitter<typeof board, "", "succed" | "move">;
}
