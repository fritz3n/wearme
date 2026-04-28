import { type Action, ACTION_NONE, type ActiveAction, type AddAction, getActiveAction } from "./action";
import { ActionState } from "./uiManager";

export interface XY {
    x: number,
    y: number
}

export class ActionManager {
    actionStatesChangedEvent: (states: Record<string, ActionState>) => void = () => {};
    actionChangedEvent: (action: ActiveAction) => void = () => {};

    actions: Record<string, Action> = {};

    activeAction: Action = ACTION_NONE;
    holdAction: Action | undefined = undefined;

    holdXY: XY = { x: -1, y: -1 };

    holdCoordinates(xy: XY) {
        this.holdXY = xy;
        if (this.activeAction.id != ACTION_NONE.id || this.holdAction) {
            this.actionChanged();
        }
    }

    actionEvent(id: string, up: boolean) {
        let action = this.actions[id];
        let mode = action.mode;

        if (mode == "TOGGLE") {
            if (up)
                return;

            this.activeAction = this.activeAction.id == id ? ACTION_NONE : action;
        } else {
            if (up) {
                this.holdAction = undefined;
            } else {
                this.holdAction = action;
            }
        }
        this.actionStatesChanged();
        this.actionChanged();
    }

    addAction(addAction: AddAction) {
        let id = this.generateId(addAction);
        let action = { ...addAction, id };
        this.actions[id] = action;
    }

    private generateId(action: AddAction) {
        return `${action.command}-${action.x}-${action.y}`
    }

    private actionStatesChanged() {
        let states: Record<string, ActionState> = {};
        for (const action of Object.values(this.actions)) {
            var state = ActionState.INACTIVE;
            if (action.id == this.activeAction.id) {
                state = this.holdAction ? ActionState.IDLE : ActionState.ACTIVE;
            }else if (this.holdAction && action.id == this.holdAction.id) {
                state = ActionState.HOLD;
            }
            states[action.id] = state;
        }
        this.actionStatesChangedEvent(states);
    }

    private actionChanged() {
        this.actionChangedEvent(getActiveAction(this.activeAction, this.holdAction, this.holdXY.x, this.holdXY.y));
     }
}
