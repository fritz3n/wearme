export enum Command {
    NONE = "NONE",
    STROBE = "STROBE",
    CALM = "CALM",
    FFT = "FFT"
}

export enum Mode {
    NONE = "NONE",
    TOGGLE = "TOGGLE",
    HOLD_OVERLAY = "HOLD_OVERLAY",
    HOLD_OVERRIDE = "HOLD_OVERRIDE"
}

export interface Action {
    command: Command
    mode: Mode
    x: number
    y: number
    id: string
}

export type AddAction = Omit<Action, "id">;

export interface ActiveAction {
    active: Command,
    hold: Command,
    holdMode: Mode,
    holdX: number,
    holdY: number,
}

export function getActiveAction(active: Action, hold: Action | undefined, holdX: number, holdY: number): ActiveAction {
    return {
        active: active.command,
        hold: hold?.command || Command.NONE,
        holdMode: hold?.mode || Mode.NONE,
        holdX: holdX,
        holdY: holdY
    }
}

export const ACTION_NONE: Action = { command: Command.NONE, mode: Mode.NONE, x: -1, y: -1, id: "NONE" };