import { Rect } from "canvee";
import { Size } from "canvee/lib/packages/type";
import { background } from "../theme";

type BgType = {
  size: Size;
};
export default function createBackground({ size }: BgType) {
  const bg = new Rect({
    transform: {
      size,
      anchor: {
        x: 0.5,
        y: 0.5,
      },
    },
    // borderColor: "pink",
    backgroundColor: background,
  });
  return bg;
}
