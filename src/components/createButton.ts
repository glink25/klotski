import { Rect, Text, Event } from "canvee";
import { buttonBackground, buttonTextColor } from "../theme";
import { CustomEmitter } from "../utils/typeUtil";

type TitleType = {
  text: string;
};
export default function createButton({ text }: TitleType) {
  const button = new Rect({
    transform: {
      size: {
        width: 150,
        height: 40,
      },
    },
    borderRadius: 4,
    backgroundColor: buttonBackground,
  });
  const buttonText = new Text({
    text: text,
    style: {
      // fontSize: 30,
      fill: buttonTextColor,
    },
    transform: {
      anchor: {
        x: 0.5,
        y: 0.5,
      },
    },
  });
  button.addChild(buttonText);

  const event = button.use(new Event());
  event.on("pointerdown", () => {
    button.transform.scale.x = 0.98;
    button.transform.scale.y = 0.98;
  });
  event.onGlobal("pointerup", () => {
    button.transform.scale.x = 1;
    button.transform.scale.y = 1;
  });
  event.on("pointerup", () => {
    button.emit("tap");
  });
  return button as CustomEmitter<typeof button, "tap", "">;
}
