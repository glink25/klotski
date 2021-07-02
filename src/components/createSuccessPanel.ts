import { Rect, Text } from "canvee";
import { textColor } from "../theme";
import { CustomEmitter } from "../utils/typeUtil";
import createButton from "./createButton";

type SuccessPanelType = {
  titleText?: string;
  ButtonText?: string;
};
export default function createSuccessPanel({
  titleText = "you win",
  ButtonText = "replay",
}: SuccessPanelType) {
  const title = new Text({
    text: titleText,
    style: {
      fontWeight: "bold",
      fill: textColor,
    },
    transform: {
      anchor: {
        x: 0.5,
        y: 0.2,
      },
    },
  });
  const box = new Rect({
    transform: {
      size: {
        width: 400,
        height: 100,
      },
      anchor: {
        x: 0.5,
        y: 0.5,
      },
    },
    backgroundColor: "aliceblue",
  });
  const button = createButton({ text: ButtonText });
  button.transform.anchor.x = 0.5;
  button.transform.anchor.y = 0.7;
  button.on("tap", () => {
    box.emit("confirm");
  });
  box.addChild(title);
  box.addChild(button);
  return box as CustomEmitter<typeof box, "", "confirm">;
}
