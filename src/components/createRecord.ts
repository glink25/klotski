import { Text } from "canvee";
import { textColor2 } from "../theme";

type RecordType = {
  steps?: number;
};
export default function createRecord({ steps = 0 }: RecordType) {
  const record = new Text({
    text: `steps: ${steps}`,
    style: {
      fontSize: 28,
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
        y: 0.15,
      },
      position: {
        x: 0,
        y: 15,
      },
    },
  });
  const setRecord = (s: number) => {
    record.text = `steps: ${s}`;
  };
  return [record, setRecord] as [typeof record, typeof setRecord];
}
