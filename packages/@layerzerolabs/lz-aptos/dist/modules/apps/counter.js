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
exports.Counter = void 0;
const aptos = __importStar(require("aptos"));
const lzapp_1 = require("./lzapp");
const utils_1 = require("../../utils");
class Counter {
    constructor(sdk, counter, lzApp) {
        this.SEND_PAYLOAD_LENGTH = 4;
        this.sdk = sdk;
        this.address = counter;
        this.lzApp = new lzapp_1.LzApp(sdk, lzApp || sdk.accounts.layerzero, counter);
        this.uaType = `${this.address}::counter::CounterUA`;
    }
    async initialize(signer) {
        const transaction = {
            function: `${this.address}::counter::init`,
            type_arguments: [],
            arguments: [],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getRemote(remoteChainId) {
        return this.lzApp.getRemote(remoteChainId);
    }
    async getCount() {
        const resource = await this.sdk.client.getAccountResource(this.address, `${this.address}::counter::Counter`);
        const { i } = resource.data;
        return BigInt(i);
    }
    async createCounter(signer, i) {
        const transaction = {
            function: `${this.address}::counter::create_counter`,
            type_arguments: [],
            arguments: [i],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async setRemote(signer, remoteChainId, remoteAddress) {
        return this.lzApp.setRemote(signer, remoteChainId, remoteAddress);
    }
    async setAppConfig(signer, majorVersion, minorVersion, remoteChainId, configType, configBytes) {
        console.log(`configType: ${configType}, configBytes: ${configBytes}`);
        return this.lzApp.setConfig(signer, this.uaType, majorVersion, minorVersion, remoteChainId, configType, configBytes);
    }
    async setAppConfigBundle(signer, majorVersion, minorVersion, remoteChainId, config) {
        await this.lzApp.setConfigBundle(signer, this.uaType, majorVersion, minorVersion, remoteChainId, config);
    }
    async sendToRemote(signer, remoteChainId, fee, adapterParams) {
        const transaction = {
            function: `${this.address}::counter::send_to_remote`,
            type_arguments: [],
            arguments: [remoteChainId, fee, Array.from(adapterParams)],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async lzReceive(signer, remoteChainId, remoteAddress, payload) {
        const transaction = {
            function: `${this.address}::counter::lz_receive`,
            type_arguments: [],
            arguments: [remoteChainId, Array.from(remoteAddress), Array.from(payload)],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async isCounterCreated(address) {
        try {
            const owner = aptos.HexString.ensure(address).toString();
            await this.sdk.client.getAccountResource(this.address, `${owner}::counter::Counter`);
            return true;
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return false;
            }
            throw e;
        }
    }
}
exports.Counter = Counter;
