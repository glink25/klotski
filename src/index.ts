import "./style.css";
import SimpleCanvas, { Component, EventSystem, Shadow, Text } from "canvee";
import createBackground from "./components/createBackground";
import createTitle from "./components/createTitle";
import createMenu from "./components/createMenu";
import createBoard from "./components/createBoard";
import createRecord from "./components/createRecord";
import createSuccessPanel from "./components/createSuccessPanel";
import createDialog from "./components/createDialog";
import Enums from "./utils/enums";
import createSelector from "./components/createSelector";
import createInput from "./components/createInput";

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

const record = createRecord({ steps });
const successPanel = createSuccessPanel({
  titleText: "YOU WIN !!!",
  ButtonText: "Play Again",
});
successPanel.on("confirm", () => {
  location.reload();
});
const successDialog = createDialog({ scene, content: successPanel });

let boardImage: HTMLImageElement;
const Difficulty = new Enums(["Simple", "Medium", "Hard"]);
const options = [
  {
    text: "Start Game",
    callback: () => {
      const board = createBoard({
        level: Difficulty.currentIndex * 2 + 3,
        image: boardImage,
      });
      board.on("move", () => {
        steps += 1;
        record.emit("setRecord", steps);
        return true;
      });
      board.on("succed", () => {
        successDialog.emit("show");
      });
      scene.removeChild(menu);
      scene.removeChild(selector);
      scene.removeChild(input);
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

const selector = createSelector();
selector.on("choose", (e) => {
  boardImage = e.value;
});

const input = createInput({});

title.use(new Shadow({ color: "gray", offset: { x: 10, y: 10 }, blur: 10 }));

scene.addChild(bg);
scene.addChild(title);
scene.addChild(menu);
scene.addChild(selector);
scene.addChild(input);
