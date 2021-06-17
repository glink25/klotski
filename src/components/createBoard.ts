import { Component, Event, Linear, Rect, Text, Tween } from "simple-canvas";
import { Point } from "simple-canvas/types/type";
import {
  boardBackground,
  boardItemBackground,
  emphasisColor,
  textColor,
} from "../theme";
import Game from "./game";

type BoardArg = {
  level?: number;
  onMove?: () => void;
  onSuccess?: () => void;
};

function animatedMove(comp: Component, offset: Point, after = () => {}) {
  const from = { ...comp.transform.position };
  const tween = new Tween({
    from: 0,
    to: 200,
    curve: Linear,
    duration: 200,
  }).slicing((_, p) => {
    comp.transform.position.x = from.x + offset.x * p;
    comp.transform.position.y = from.y + offset.y * p;
  });
  tween.play().after(after);
}

export default function createBoard({
  level = 3,
  onMove = () => {},
  onSuccess = () => {},
}: BoardArg) {
  const game = new Game(level);
  const BOARD_SIZE = {
    width: 320,
    height: 320,
  };
  const padding = 7;
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
    backgroundColor: boardBackground,
    borderRadius: 4,
  });

  let canTap = true;
  const items: Rect[] = new Array(game.blank);

  const validateItem = () => {
    for (let i = 0; i < items.length; i++) {
      if (game.isCorrect(i)) {
        items[i].backgroundColor = emphasisColor;
        (items[i].children[0] as Text).style.color = "white";
      } else {
        items[i].backgroundColor = boardItemBackground;
        (items[i].children[0] as Text).style.color = textColor;
      }
    }
  };

  game.map.forEach((row, j) => {
    row.forEach((value, i) => {
      if (value === game.blank) return;
      const item = new Rect({
        transform: {
          size: ITEM_SIZE,
          anchor: {
            x: 0,
            y: 0,
          },
          position: {
            x: ITEM_SIZE.width / 2 + padding + (ITEM_SIZE.width + padding) * i,
            y:
              ITEM_SIZE.height / 2 + padding + (ITEM_SIZE.height + padding) * j,
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
            color: textColor,
            fontWeight: "bold",
          },
        })
      );
      const event = item.use(new Event());
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
              canTap = true;
              const rights = game.check();
              validateItem();
              if (rights) {
                onSuccess();
                canTap = false;
              }
            }
          );
          onMove();
        }
      });
      items[value] = item;
      board.addChild(item);
    });
  });
  validateItem();
  return board;
}
