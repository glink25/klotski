import { Rect, Text } from "canvee";
import { textColor } from "../theme";
import createButton from "./createButton";

type SuccessPanelType = {
  titleText?: string;
  ButtonText?: string;
  onTapButton?: () => void;
};
export default function createSuccessPanel({
  titleText = "you win",
  ButtonText = "replay",
  onTapButton = () => {},
}: SuccessPanelType) {
  const button = createButton({ text: ButtonText, onTap: onTapButton });
  button.transform.anchor.x = 0.5;
  button.transform.anchor.y = 0.7;
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
  box.addChild(title);
  box.addChild(button);
  return box;
}
