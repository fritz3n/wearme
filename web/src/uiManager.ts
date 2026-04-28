import type { Action } from "./action";
import { ActionManager, type XY } from "./actionManager";

export enum ActionState {
    INACTIVE = "inactive",
    IDLE = "idle",
    ACTIVE = "active",
    HOLD = "hold"
}

export class UIManager {
    private actionManager: ActionManager;
    private container: HTMLElement;
    private actionElements: Record<string, HTMLElement> = {};
    constructor(actionManager: ActionManager) {
        this.actionManager = actionManager;
        this.container = document.getElementById("container")!;
        actionManager.actionStatesChangedEvent = (states) => this.actionStatesChanged(states);
    }

    private actionStatesChanged(states: Record<string, ActionState>): void {
        for (const [id, state] of Object.entries(states)) {
            this.actionStateChanged(id, state);
        }
    }

    private actionStateChanged(id: string, state: ActionState): void {
        let cssClass = state.toLowerCase();
        let element = this.actionElements[id];
        if (element) {
            element.classList.remove("inactive", "idle", "active", "hold");
            element.classList.add(cssClass);
        }
    }

    construct() {
        for (const action of Object.values(this.actionManager.actions)) {
            let element = document.createElement("button");
            element.classList.add("action");
            element.innerText = `${action.command}`;
            element.style.gridColumn = action.x.toString();
            element.style.gridRow = action.y.toString();
            element.addEventListener("touchstart", e => this.touchStart(action, e))
            element.addEventListener("touchmove", e => this.touchMove(e))
            element.addEventListener("touchend", e => this.touchEnd(action, e))
            element.addEventListener("touchcancel", e => this.touchEnd(action, e))
            element.addEventListener("mousedown", () => this.actionManager.actionEvent(action.id, false));
            element.addEventListener("mouseup", () => this.actionManager.actionEvent(action.id, true));
            this.container.appendChild(element);
            this.actionElements[action.id] = element;
        }
    }
    touchEnd(action: Action, event: TouchEvent): any {
        event.preventDefault();
        event.stopPropagation();
        this.actionManager.actionEvent(action.id, true);
    }
    touchMove(event: TouchEvent): any {
        event.preventDefault();
        event.stopPropagation();
        this.actionManager.holdCoordinates(this.getTouchXY(event.touches[0]));
    }
    touchStart(action: Action, event: TouchEvent) {
        this.touchMove(event);
        this.actionManager.actionEvent(action.id, false);
    }

    private getTouchXY(touch: Touch): XY {
        let vw = Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0)
        let vh = Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)

        return {
            x: touch.clientX / vw * 1000,
            y: touch.clientY / vh * 1000
        }
    }

}
