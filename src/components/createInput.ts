import { Component, Event, Linear, Rect, Text, Tween } from "canvee";
import { inputBackgroundColor, inputTextColor } from "../theme";

type InputArg = {
  text?: string;
};
function getPosFromEvent(e: MouseEvent | TouchEvent) {
  const pos = (e as TouchEvent).touches
    ? (e as TouchEvent).touches[0]
    : (e as MouseEvent);
  return {
    x: pos.clientX,
    y: pos.clientY,
  };
}
function setElPosition(el: HTMLElement, e: MouseEvent | TouchEvent) {
  const pos = getPosFromEvent(e);
  el.style.left = `${pos.x}px`;
  el.style.top = `${pos.y}px`;
}

function createUnderline() {
  const line = new Rect({
    transform: {
      size: {
        width: 100,
        height: 2,
      },
      anchor: {
        x: 0.5,
        y: 1,
      },
      alpha: 0.01,
    },
    backgroundColor: "black",
  });
  const hide = () => {
    new Tween({
      from: line.transform.size.width,
      to: 0,
      duration: 200,
      curve: Linear,
    })
      .slicing((v) => {
        line.transform.size.width = v;
      })
      .after(() => {
        line.transform.alpha = 0.01;
      })
      .play();
  };

  const show = () => {
    line.transform.alpha = 1;
    new Tween({
      from: 0,
      to: line.transform.size.width,
      duration: 200,
      curve: Linear,
    })
      .slicing((v) => {
        line.transform.size.width = v;
      })
      .play();
  };
  const controller = {
    hide,
    show,
  };
  return [line, controller] as [typeof line, typeof controller];
}
const MIN_WIDTH = 100;
export default function createInput({ text = "" }: InputArg) {
  const input = new Rect({
    name: "input",
    transform: {
      size: {
        width: MIN_WIDTH,
        height: 30,
      },
      anchor: {
        x: 0.5,
        y: 0.7,
      },
    },
    backgroundColor: inputBackgroundColor,
  });
  const inputText = new Text({
    text,
    style: {
      fontSize: 20,
      fill: inputTextColor,
      textAign: "left",
    },
    transform: {
      anchor: {
        x: 0,
        y: 0.5,
      },
    },
  });
  const [underline, underlineController] = createUnderline();
  underline.transform.size.width = input.transform.size.width;
  const controller = {};
  const textEl = document.createElement("input");
  textEl.style.position = "absolute";
  textEl.style.left = "-1000px";
  textEl.style.top = "-1000px";
  textEl.style.zIndex = "-100";
  textEl.value = text;
  textEl.type = "text";
  textEl.style.color = "transparent";
  textEl.oninput = () => {
    inputText.text = textEl.value;
    const textWidth = inputText.transform.size.width;
    if (textWidth > MIN_WIDTH - 50) {
      input.transform.size.width = textWidth + 50;
    } else {
      input.transform.size.width = MIN_WIDTH;
    }
    underline.transform.size.width = input.transform.size.width;
  };
  textEl.onfocus = () => {
    underline.transform.size.width = input.transform.size.width;
    underlineController.show();
  };
  textEl.onblur = () => {
    underlineController.hide();
  };
  document.body.appendChild(textEl);
  input.use(new Event()).on("pointerdown", (e) => {
    setElPosition(textEl, e.raw as MouseEvent | TouchEvent);
    textEl.focus();
  });
  input.addChild(inputText);
  input.addChild(underline);
  return [input, controller] as [typeof input, typeof controller];
}
