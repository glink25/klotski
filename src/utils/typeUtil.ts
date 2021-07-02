import { Component } from "canvee";

export type CustomEmitComponent<
  C extends Component,
  EmitNames,
  RecieverNames
> = C & {
  emit: (n: EmitNames) => void;
  on: (n: RecieverNames, fn: (e: any) => void | boolean) => void;
};
