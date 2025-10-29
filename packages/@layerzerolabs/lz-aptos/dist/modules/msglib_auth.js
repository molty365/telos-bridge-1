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
exports.MsgLibAuth = void 0;
const aptos = __importStar(require("aptos"));
class MsgLibAuth {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.msglib_auth}::msglib_cap`;
        this.moduleName = 'msglib_auth::msglib_cap';
    }
    async isAllowed(msglibReceive) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.msglib_auth, `${this.module}::GlobalStore`);
        const msglibAcl = resource.data.msglib_acl.list;
        const lib = aptos.HexString.ensure(msglibReceive).toShortString();
        return msglibAcl.includes(lib);
    }
    denyPayload(msglibReceive) {
        return {
            function: `${this.module}::deny`,
            type_arguments: [],
            arguments: [msglibReceive],
        };
    }
    allowPayload(msglibReceive) {
        return {
            function: `${this.module}::allow`,
            type_arguments: [],
            arguments: [msglibReceive],
        };
    }
    async allow(signer, msglibReceive) {
        const transaction = this.allowPayload(msglibReceive);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
}
exports.MsgLibAuth = MsgLibAuth;
