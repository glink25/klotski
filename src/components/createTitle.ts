import { Text } from "simple-canvas";
import { textColor } from "../theme";

type TitleType = {
  text: string;
};
export default function createTitle({ text }: TitleType) {
  const title = new Text({
    text,
    style: {
      fontSize: 30,
      color: textColor,
      fontWeight: "bold",
    },
    transform: {
      origin: {
        x: 0.5,
        y: 0.5,
      },
      anchor: {
        x: 0.5,
        y: 0.05,
      },
      position: {
        x: 0,
        y: 15,
      },
    },
  });
  return title;
}
