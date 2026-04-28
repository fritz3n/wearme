import './style.css'
import { Command, Mode } from "./action";
import { ActionManager } from "./actionManager";
import { ServerConnection } from "./serverConnection";
import { UIManager } from "./uiManager";

let serverConnection = new ServerConnection();
let actionManager = new ActionManager();

actionManager.addAction({ command: Command.STROBE, mode: Mode.TOGGLE, x: 1, y: 1 });
actionManager.addAction({ command: Command.CALM, mode: Mode.HOLD_OVERLAY, x: 2, y: 1 });
actionManager.addAction({ command: Command.FFT, mode: Mode.HOLD_OVERRIDE, x: 3, y: 1 });
actionManager.addAction({ command: Command.STROBE, mode: Mode.NONE, x: 1, y: 2 });
actionManager.addAction({ command: Command.STROBE, mode: Mode.NONE, x: 2, y: 2 });
actionManager.addAction({ command: Command.STROBE, mode: Mode.NONE, x: 3, y: 2 });

let uiManager = new UIManager(actionManager);
uiManager.construct();
actionManager.actionChangedEvent = (action) => serverConnection.sendAction(action);
