"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Layerzero = void 0;
const channel_1 = require("./channel");
const endpoint_1 = require("./endpoint");
const executor_1 = require("./executor");
const uln_1 = require("./uln");
const msglib_config_1 = require("./msglib_config");
const executor_config_1 = require("./executor_config");
const msglib_auth_1 = require("./msglib_auth");
class Layerzero {
    constructor(sdk) {
        this.Channel = new channel_1.Channel(sdk);
        this.Executor = new executor_1.Executor(sdk);
        this.Endpoint = new endpoint_1.Endpoint(sdk);
        this.MsgLibConfig = new msglib_config_1.MsgLibConfig(sdk);
        this.MsgLibAuth = new msglib_auth_1.MsgLibAuth(sdk);
        this.ExecutorConfig = new executor_config_1.ExecutorConfig(sdk);
        this.Uln = new uln_1.Uln(sdk);
    }
}
exports.Layerzero = Layerzero;
