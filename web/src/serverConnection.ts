import type { ActiveAction } from "./action";

export class ServerConnection {
    ws: WebSocket;

    constructor() {
        this.ws = new WebSocket("/ws");
    }
    

    sendAction(action: ActiveAction) {
        let message = `${action.active},${action.hold},${action.holdMode},${action.holdX},${action.holdY}`;
        console.log("actions", message);
        try {
            this.ws.send(message);
        } catch (error) {
            //console.error("Failed to send message:", error);
        }
    }
}
