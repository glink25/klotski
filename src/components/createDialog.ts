import { Component, Cubic, Event, Rect, Tween } from "canvee";

type DialogArg = {
  scene: Component;
  content: Component;
};
export default function createDialog({ scene, content }: DialogArg) {
  const modal = new Rect({
    transform: {
      size: {
        ...scene.transform.size,
      },
      alpha: 0.01,
      anchor: { x: 0.5, y: 0.5 },
    },
    backgroundColor: "black",
  });
  const dialog = new Component({
    transform: {
      size: {
        ...scene.transform.size,
      },
      anchor: { x: 0.5, y: 0.5 },
      zIndex: 90,
    },
  });
  modal.use(new Event()).on("pointerup", (e) => {
    e.stopPropgation();
  });
  content.transform.scale.x = 0;
  content.transform.scale.y = 0;
  dialog.addChild(modal);
  dialog.addChild(content);

  let isShown = false;

  const tweenShow = new Tween({
    from: 0,
    to: 1,
    curve: Cubic.easeInOut,
    duration: 500,
  }).slicing((v) => {
    modal.transform.alpha = v * 0.6;
    content.transform.scale.x = v;
    content.transform.scale.y = v;
  });
  const show = () => {
    if (isShown) return;
    scene.addChild(dialog);
    tweenShow.play().after(() => {
      isShown = true;
    });
  };
  const hide = () => {
    if (!isShown) return;
    scene.removeChild(dialog);
    isShown = false;
  };
  return {
    component: dialog,
    show,
    hide,
  };
}
