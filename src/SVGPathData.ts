import {TransformableSVG} from "./TransformableSVG";
export type CommandM = { relative: boolean, type: typeof SVGPathData.MOVE_TO, x: number, y: number };
export type CommandL = { relative: boolean, type: typeof SVGPathData.LINE_TO, x: number, y: number };
export type CommandH = { relative: boolean, type: typeof SVGPathData.HORIZ_LINE_TO, x: number };
export type CommandV = { relative: boolean, type: typeof SVGPathData.VERT_LINE_TO, y: number };
export type CommandZ = { type: typeof SVGPathData.CLOSE_PATH };
export type CommandQ = {
  relative: boolean;
  type: typeof SVGPathData.QUAD_TO;
  x1: number;
  y1: number;
  x: number;
  y: number;
};
export type CommandT = { relative: boolean, type: typeof SVGPathData.SMOOTH_QUAD_TO, x: number, y: number };
export type CommandC = {
    relative: boolean,
    type: typeof SVGPathData.CURVE_TO,
    x1: number, y1: number,
    x2: number, y2: number,
    x: number, y: number };
export type CommandS = {
  relative: boolean;
  type: typeof SVGPathData.SMOOTH_CURVE_TO;
  x2: number;
  y2: number;
  x: number;
  y: number;
};
export type CommandA = {
    relative: boolean,
    type: typeof SVGPathData.ARC,
    rX: number, rY: number,
    xRot: number, sweepFlag: 0 | 1, lArcFlag: 0 | 1,
    x: number, y: number
    cX?: number, cY?: number, phi1?: number, phi2?: number};
export type SVGCommand = CommandM | CommandL | CommandH | CommandV | CommandZ | CommandQ |
    CommandT | CommandC | CommandS | CommandA;

export type TransformFunction = (input: SVGCommand) => SVGCommand | SVGCommand[];

export class SVGPathData extends TransformableSVG {
  commands: SVGCommand[];
  constructor(content: string | SVGCommand[]) {
    super();
    if ("string" === typeof content) {
      this.commands = SVGPathData.parse(content);
    } else {
      this.commands = content;
    }
  }

  encode() {
    return SVGPathData.encode(this.commands);
  }

  getBounds() {
    const boundsTransform = SVGPathDataTransformer.CALCULATE_BOUNDS();

    this.transform(boundsTransform);
    return boundsTransform;
  }

  transform(
    transformFunction: (input: SVGCommand) => SVGCommand | SVGCommand[],
  ) {
    const newCommands = [];

    for (const command of this.commands) {
      const transformedCommand = transformFunction(command);

      if (Array.isArray(transformedCommand)) {
        newCommands.push(...transformedCommand);
      } else {
        newCommands.push(transformedCommand);
      }
    }
    this.commands = newCommands;
    return this;
  }

  static encode(commands: SVGCommand[]) {
    return encodeSVGPath(commands);
      }

  static parse(path: string) {
    const parser = new SVGPathDataParser();
    const commands: SVGCommand[] = [];
    parser.parse(path, commands);
    parser.finish(commands);
    return commands;
  }

  static readonly CLOSE_PATH: 1 = 1;
  static readonly MOVE_TO: 2 = 2;
  static readonly HORIZ_LINE_TO: 4 = 4;
  static readonly VERT_LINE_TO: 8 = 8;
  static readonly LINE_TO: 16 = 16;
  static readonly CURVE_TO: 32 = 32;
  static readonly SMOOTH_CURVE_TO: 64 = 64;
  static readonly QUAD_TO: 128 = 128;
  static readonly SMOOTH_QUAD_TO: 256 = 256;
  static readonly ARC: 512 = 512;
  static readonly LINE_COMMANDS = SVGPathData.LINE_TO | SVGPathData.HORIZ_LINE_TO | SVGPathData.VERT_LINE_TO;
  static readonly DRAWING_COMMANDS = SVGPathData.HORIZ_LINE_TO | SVGPathData.VERT_LINE_TO | SVGPathData.LINE_TO |
  SVGPathData.CURVE_TO | SVGPathData.SMOOTH_CURVE_TO | SVGPathData.QUAD_TO |
  SVGPathData.SMOOTH_QUAD_TO | SVGPathData.ARC;
}

import { encodeSVGPath } from "./SVGPathDataEncoder";
import {SVGPathDataParser} from "./SVGPathDataParser";
import {SVGPathDataTransformer} from "./SVGPathDataTransformer";
export { encodeSVGPath, SVGPathDataParser, SVGPathDataTransformer };