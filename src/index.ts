import "./style.css";
import SimpleCanvas, { Component, EventSystem, Text } from "simple-canvas";
import createBackground from "./components/createBackground";
import createTitle from "./components/createTitle";
import createMenu from "./components/createMenu";
import createBoard from "./components/createBoard";
import createRecord from "./components/createRecord";
import createSuccessPanel from "./components/createSuccessPanel";
import createDialog from "./components/createDialog";
import Enums from "./utils/enums";

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const SIZE = {
  width: canvas.getBoundingClientRect().width,
  height: canvas.getBoundingClientRect().height,
};
const deviceRatio = window.devicePixelRatio;
const AbsSize = {
  width: SIZE.width * deviceRatio,
  height: SIZE.height * deviceRatio,
};
const canvasSystem = new SimpleCanvas({
  canvas: document.getElementById("canvas") as HTMLCanvasElement,
  size: SIZE,
  devicePixelRatio: deviceRatio,
  systems: [new EventSystem({ preventScroll: true })],
});
const scene = canvasSystem.scene;

let steps = 0;
const bg = createBackground({ size: AbsSize });
const title = createTitle({ text: "KLOTSKI !" });

const [record, setRecord] = createRecord({ steps });
const successPanel = createSuccessPanel({
  titleText: "YOU WIN !!!",
  ButtonText: "Play Again",
  onTapButton: () => {
    location.reload();
  },
});
const successDialog = createDialog({ scene, content: successPanel });

const Difficulty = new Enums(["Simple", "Medium", "Hard"]);
const options = [
  {
    text: "Start Game",
    callback: () => {
      const board = createBoard({
        level: Difficulty.currentIndex * 2 + 3,
        onMove: () => {
          steps += 1;
          setRecord(steps);
        },
        onSuccess: () => {
          successDialog.show();
        },
      });
      scene.removeChild(menu);
      scene.addChild(record);
      scene.addChild(board);
    },
  },
  {
    text: `Difficulty: ${Difficulty.default}`,
    callback: (c: Component) => {
      (
        c.children[0] as unknown as Text
      ).text = `Difficulty: ${Difficulty.next}`;
    },
  },
];
const menu = createMenu(options);

scene.addChild(bg);
scene.addChild(title);
scene.addChild(menu);
