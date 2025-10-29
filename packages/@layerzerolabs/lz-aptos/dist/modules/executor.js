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
exports.Executor = void 0;
const aptos = __importStar(require("aptos"));
const utils_1 = require("../utils");
const utils_2 = require("../format/utils");
// todo: merge into endpoint
class Executor {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::executor_v1`;
        this.moduleName = 'layerzero::executor_v1';
        this.type = `${this.module}::Executor`;
    }
    setDefaultAdapterParamsPayload(dstChainId, adapterParams) {
        return {
            function: `${this.module}::set_default_adapter_params`,
            type_arguments: [],
            arguments: [dstChainId, Array.from(adapterParams)],
        };
    }
    async setDefaultAdapterParams(signer, dstChainId, adapterParams) {
        const transaction = this.setDefaultAdapterParamsPayload(dstChainId, adapterParams);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getDefaultAdapterParams(chainId) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::AdapterParamsConfig`);
        const { params } = resource.data;
        try {
            const response = await this.sdk.client.getTableItem(params.handle, {
                key_type: 'u64',
                value_type: 'vector<u8>',
                key: chainId.toString(),
            });
            return Buffer.from(aptos.HexString.ensure(response).noPrefix(), 'hex');
        }
        catch (e) {
            return this.buildDefaultAdapterParams(0);
        }
    }
    async isRegistered(address) {
        try {
            await this.sdk.client.getAccountResource(address, `${this.module}::ExecutorConfig`);
            return true;
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return false;
            }
            throw e;
        }
    }
    registerPayload() {
        return {
            function: `${this.module}::register`,
            type_arguments: [],
            arguments: [],
        };
    }
    async register(signer) {
        const transaction = this.registerPayload();
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    setFeePayload(dstChainId, config) {
        return {
            function: `${this.module}::set_fee`,
            type_arguments: [],
            arguments: [dstChainId, config.airdropAmtCap, config.priceRatio, config.gasPrice],
        };
    }
    async setFee(signer, dstChainId, config) {
        const transaction = this.setFeePayload(dstChainId, config);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getFee(executor, chainId) {
        try {
            const resource = await this.sdk.client.getAccountResource(executor, `${this.module}::ExecutorConfig`);
            const { fee } = resource.data;
            const response = await this.sdk.client.getTableItem(fee.handle, {
                key_type: 'u64',
                value_type: `${this.module}::Fee`,
                key: chainId.toString(),
            });
            return {
                airdropAmtCap: BigInt(response.airdrop_amt_cap),
                priceRatio: BigInt(response.price_ratio),
                gasPrice: BigInt(response.gas_price),
            };
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return {
                    airdropAmtCap: 0n,
                    priceRatio: 0n,
                    gasPrice: 0n,
                };
            }
            throw e;
        }
    }
    airdropPayload(srcChainId, guid, receiver, amount) {
        return {
            function: `${this.module}::airdrop`,
            type_arguments: [],
            arguments: [srcChainId, Array.from(guid), receiver, amount.toString()],
        };
    }
    async airdrop(signer, srcChainId, guid, receiver, amount) {
        const transaction = this.airdropPayload(srcChainId, guid, receiver, amount);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async isAirdropped(guid, receiver) {
        try {
            const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::JobStore`);
            const { done } = resource.data;
            const response = await this.sdk.client.getTableItem(done.handle, {
                key_type: `${this.module}::JobKey`,
                value_type: 'bool',
                key: {
                    guid: Buffer.from(guid).toString('hex'),
                    executor: receiver.toString(),
                },
            });
            return response;
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return false;
            }
            throw e;
        }
    }
    async quoteFee(executor, dstChainId, adapterParams) {
        if (adapterParams === undefined || adapterParams.length === 0) {
            adapterParams = await this.getDefaultAdapterParams(dstChainId);
        }
        const fee = await this.getFee(executor, dstChainId);
        const [, uaGas, airdropAmount] = this.decodeAdapterParams(adapterParams);
        return ((uaGas * fee.gasPrice + airdropAmount) * fee.priceRatio) / 10000000000n;
    }
    buildDefaultAdapterParams(uaGas) {
        const params = [0, 1].concat(Array.from((0, utils_1.convertUint64ToBytes)(uaGas)));
        return Uint8Array.from(Buffer.from(params));
    }
    buildAirdropAdapterParams(uaGas, airdropAmount, airdropAddress) {
        if (airdropAmount === 0n) {
            return this.buildDefaultAdapterParams(uaGas);
        }
        const params = [0, 2]
            .concat(Array.from((0, utils_1.convertUint64ToBytes)(uaGas)))
            .concat(Array.from((0, utils_1.convertUint64ToBytes)(airdropAmount)))
            .concat(Array.from(aptos.HexString.ensure(airdropAddress).toUint8Array()));
        return Buffer.from(params);
    }
    // txType 1
    // bytes  [2       8       ]
    // fields [txType  extraGas]
    // txType 2
    // bytes  [2       8         8           unfixed       ]
    // fields [txType  extraGas  airdropAmt  airdropAddress]
    decodeAdapterParams(adapterParams) {
        const type = adapterParams[0] * 256 + adapterParams[1];
        if (type === 1) {
            // default
            if (adapterParams.length !== 10)
                throw new Error('invalid adapter params');
            const uaGas = adapterParams.slice(2, 10);
            return [type, (0, utils_1.convertBytesToUint64)(uaGas), 0n, ''];
        }
        else if (type === 2) {
            // airdrop
            if (adapterParams.length <= 18)
                throw new Error('invalid adapter params');
            const uaGas = adapterParams.slice(2, 10);
            const airdropAmount = adapterParams.slice(10, 18);
            const airdropAddressBytes = adapterParams.slice(18);
            return [
                type,
                (0, utils_1.convertBytesToUint64)(uaGas),
                (0, utils_1.convertBytesToUint64)(airdropAmount),
                aptos.HexString.fromUint8Array(airdropAddressBytes).toString(),
            ];
        }
        else {
            throw new Error('invalid adapter params');
        }
    }
    async getLzReceiveTypeArguments(packet) {
        // NOTE: `make compile-script-template` to get SCRIPT_BYTECODE
        const SCRIPT_BYTECODE = 'a11ceb0b0500000006010006020604030a0a051419072d4c087960000001010202000307000104030100020504020004060c030a020a02010a08000003030a020a0202060c0a080009747970655f696e666f07636f756e74657208656e64706f696e740854797065496e666f106c7a5f726563656976655f7479706573166275696c645f6c7a5f726563656976655f74797065730000000000000000000000000000000000000000000000000000000000000001000000000000000000000000000000000000000000000000000000000000cafe000000000000000000000000000000000000000000000000000000000000face000001090b010b020b0311000c040b000b04110102';
        const uaTypeInfo = await this.sdk.LayerzeroModule.Endpoint.getUATypeInfo(aptos.HexString.fromBuffer(packet.dst_address));
        const bytecode = (0, utils_2.rebuildCompileScriptBytecode)(SCRIPT_BYTECODE, [
            {
                oldValue: aptos.HexString.ensure('0x000000000000000000000000000000000000000000000000000000000000face').toUint8Array(),
                newValue: aptos.HexString.ensure(this.sdk.accounts.layerzero).toUint8Array(),
            },
            {
                oldValue: aptos.HexString.ensure('0x000000000000000000000000000000000000000000000000000000000000cafe').toUint8Array(),
                newValue: aptos.HexString.ensure(uaTypeInfo.account_address).toUint8Array(),
            },
        ], [
            {
                oldValue: 'counter',
                newValue: uaTypeInfo.module_name,
            },
        ]);
        const typeInfos = await (0, utils_1.getLzReceiveTypeArguments)(new aptos.HexString(bytecode).toUint8Array(), this.sdk, new aptos.TxnBuilderTypes.Ed25519PublicKey((0, utils_1.stringToUint8Array)(this.sdk.accounts.executor_pubkey.toString())), packet.dst_address, parseInt(packet.src_chain_id.toString()), packet.src_address, Buffer.from(packet.payload));
        return typeInfos;
    }
    async getLzReceivePayload(type_arguments, packet) {
        const uaTypeInfo = await this.sdk.LayerzeroModule.Endpoint.getUATypeInfo(aptos.HexString.fromBuffer(packet.dst_address));
        const transaction = {
            function: `${uaTypeInfo.account_address}::${uaTypeInfo.module_name}::lz_receive`,
            type_arguments,
            arguments: [
                packet.src_chain_id,
                Array.from(Uint8Array.from(packet.src_address)),
                Array.from(Uint8Array.from(packet.payload)),
            ],
        };
        return transaction;
    }
    async lzReceive(signer, type_arguments, packet) {
        const transaction = await this.getLzReceivePayload(type_arguments, packet);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    getShortRequestEventType() {
        return `${this.module}::RequestEvent`.replace(/^(0x)0*/i, '$1');
    }
}
exports.Executor = Executor;
