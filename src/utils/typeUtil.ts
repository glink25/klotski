import { Component } from "canvee";

export type CustomEmitter<C extends Component, EmitNames, RecieverNames> = C & {
  emit: EmitNames;
  on: (n: RecieverNames, fn: (e: any) => void | boolean) => void;
};
