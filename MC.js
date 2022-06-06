"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws = __importStar(require("websocket"));
const http = __importStar(require("http"));
// import * as Core from "./Core";
const uuid = __importStar(require("uuid"));
var HTTPServer = new http.Server();
var MCServer = new ws.server({
    httpServer: HTTPServer
});
MCServer.on("connect", (con) => {
    console.log("A New Connect Coming!");
    con.send(Buffer.from(JSON.stringify({
        body: {
            eventName: "PlayerMessage"
        },
        header: {
            requestId: uuid.v1(),
            messagePurpose: "unsubscribe",
            version: 1,
            messageType: "commandRequest"
        }
    })));
    con.send(Buffer.from(JSON.stringify({
        body: {
            origin: {
                type: "player",
            },
            commandLine: "say [ONLINEAI]CONNECTED!",
            version: 1,
        },
        header: {
            requestId: uuid.v1(),
            messagePurpose: "commandRequest",
            version: 1,
            messageType: "commandRequest"
        }
    })));
    con.on("message", (data) => {
        console.log(data.utf8Data);
    });
});
HTTPServer.listen(19131, "0.0.0.0", (() => {
    console.log("Server Start");
}));
MCServer.mount({
    httpServer: HTTPServer
});
