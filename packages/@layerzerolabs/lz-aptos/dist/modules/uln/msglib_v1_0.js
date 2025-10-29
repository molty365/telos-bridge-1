"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MsgLibV1_0 = void 0;
class MsgLibV1_0 {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::msglib_v1_0`;
    }
}
exports.MsgLibV1_0 = MsgLibV1_0;
