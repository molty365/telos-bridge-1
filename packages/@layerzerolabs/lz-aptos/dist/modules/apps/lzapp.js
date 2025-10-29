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
exports.LzApp = void 0;
const aptos = __importStar(require("aptos"));
const utils_1 = require("../../utils");
// todo: refactor
class LzApp {
    constructor(sdk, lzApp, ua) {
        this.sdk = sdk;
        this.lzApp = lzApp;
        this.ua = ua;
    }
    async getRemote(remoteChainId) {
        const resource = await this.sdk.client.getAccountResource(this.ua, `${this.lzApp}::remote::Remotes`);
        const { peers } = resource.data;
        const trustedRemoteHandle = peers.handle;
        const response = await this.sdk.client.getTableItem(trustedRemoteHandle, {
            key_type: 'u64',
            value_type: 'vector<u8>',
            key: remoteChainId.toString(),
        });
        return Uint8Array.from(Buffer.from(aptos.HexString.ensure(response).noPrefix(), 'hex'));
    }
    async getMinDstGas(uaType, remoteChainId, packetType) {
        const resource = await this.sdk.client.getAccountResource(this.ua, `${this.lzApp}::lzapp::Config`);
        const { min_dst_gas_lookup } = resource.data;
        try {
            const response = await this.sdk.client.getTableItem(min_dst_gas_lookup.handle, {
                key_type: `${this.lzApp}::lzapp::Path`,
                value_type: 'u64',
                key: {
                    chain_id: remoteChainId.toString(),
                    packet_type: packetType.toString(),
                },
            });
            return response;
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return BigInt(0);
            }
            throw e;
        }
    }
    setMinDstPayload(uaType, remoteChainId, packetType, minDstGas) {
        return {
            function: `${this.lzApp}::lzapp::set_min_dst_gas`,
            type_arguments: [uaType],
            arguments: [remoteChainId, packetType.toString(), minDstGas.toString()],
        };
    }
    async setMinDstGas(signer, uaType, remoteChainId, packetType, minDstGas) {
        const transaction = this.setMinDstPayload(uaType, remoteChainId, packetType, minDstGas);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    setRemotePaylaod(remoteChainId, remoteAddress) {
        return {
            function: `${this.lzApp}::remote::set`,
            type_arguments: [],
            arguments: [remoteChainId, Array.from(remoteAddress)],
        };
    }
    async setRemote(signer, remoteChainId, remoteAddress) {
        const expectedAddressSize = await this.sdk.LayerzeroModule.Uln.Config.getChainAddressSize(remoteChainId);
        if (expectedAddressSize !== remoteAddress.length) {
            const address = Buffer.from(remoteAddress).toString('hex');
            throw new Error(`address(${address}) doesn't match expected size(${expectedAddressSize})`);
        }
        const transaction = this.setRemotePaylaod(remoteChainId, remoteAddress);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async setConfig(signer, uaType, majorVersion, minorVersion, remoteChainId, configType, configBytes) {
        console.log(`configType: ${configType}, configBytes: ${configBytes}`);
        const transaction = {
            function: `${this.lzApp}::lzapp::set_config`,
            type_arguments: [uaType],
            arguments: [majorVersion, minorVersion, remoteChainId, configType, Array.from(configBytes)],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async setConfigBundle(signer, uaType, majorVersion, minorVersion, remoteChainId, config) {
        await this.setConfig(signer, uaType, majorVersion, minorVersion, remoteChainId, this.sdk.LayerzeroModule.Uln.Config.TYPE_ORACLE, Buffer.from(aptos.HexString.ensure(config.oracle).noPrefix(), 'hex'));
        await this.setConfig(signer, uaType, majorVersion, minorVersion, remoteChainId, this.sdk.LayerzeroModule.Uln.Config.TYPE_RELAYER, Buffer.from(aptos.HexString.ensure(config.relayer).noPrefix(), 'hex'));
        console.log(`setAppConfig inbound_confirmations: ${config.inbound_confirmations}`);
        await this.setConfig(signer, uaType, majorVersion, minorVersion, remoteChainId, this.sdk.LayerzeroModule.Uln.Config.TYPE_INBOUND_CONFIRMATIONS, aptos.BCS.bcsSerializeUint64(config.inbound_confirmations).reverse() // BCS is little endian, but we want big endian
        );
        await this.setConfig(signer, uaType, majorVersion, minorVersion, remoteChainId, this.sdk.LayerzeroModule.Uln.Config.TYPE_OUTBOUND_CONFIRMATIONS, aptos.BCS.bcsSerializeUint64(config.outbound_confirmations).reverse() // BCS is little endian, but we want big endian
        );
    }
}
exports.LzApp = LzApp;
