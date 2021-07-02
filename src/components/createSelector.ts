import { Event, Text } from "canvee";
import { textColor2 } from "../theme";
import { CustomEmitter } from "../utils/typeUtil";
import useFile, { FileType } from "../utils/useFile";

function ellipsis(str: string, length = 10) {
  return str.length > length ? str.slice(0, length - 3).concat("...") : str;
}

export default function createSelector(text = "choose image:") {
  const textButton = new Text({
    text,
    style: {
      fontSize: 24,
      fill: textColor2,
      fontWeight: "bold",
    },
    transform: {
      origin: {
        x: 0.5,
        y: 0.5,
      },
      anchor: {
        x: 0.5,
        y: 0.8,
      },
      position: {
        x: 0,
        y: 15,
      },
    },
  });
  textButton.use(new Event()).on("pointerup", () => {
    useFile({ type: FileType.Img })
      .then((files) => {
        const url = URL.createObjectURL(files[0]);
        const img = document.createElement("img");
        img.src = url;
        textButton.text = `choose img: ${ellipsis(files[0].name)}`;
        // onChoose(img);
        textButton.emit("choose", img);
      })
      .catch(() => {});
  });

  return textButton as CustomEmitter<typeof textButton, "", "choose">;
}
