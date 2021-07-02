import { Rect, Component } from "canvee";
import createButton from "./createButton";

type MenuArg = Array<{
  text: string;
  callback: (comp: Component) => void;
}>;
export default function createMenu(arg: MenuArg) {
  const paddingTop = 20;
  const boxWidth = 200;
  const boxHeight = 40;
  const menu = new Rect({
    transform: {
      size: {
        width: 300,
        height: paddingTop + boxHeight / 2 + arg.length * (boxHeight + 10),
      },
      anchor: {
        x: 0.5,
        y: 0.5,
      },
    },
    backgroundColor: "transparent",
  });

  arg.forEach((config, index) => {
    const box = createButton({
      text: config.text,
    });
    box.on("tap", () => {
      config.callback(box);
    });
    box.transform.position.y =
      paddingTop + boxHeight / 2 + index * (boxHeight + 20);
    box.transform.anchor.x = 0.5;
    box.transform.size.width = boxWidth;
    box.transform.size.height = boxHeight;
    menu.addChild(box);
  });
  return menu;
}
