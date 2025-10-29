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
exports.UlnSigner = void 0;
const aptos = __importStar(require("aptos"));
const utils_1 = require("../../utils");
class UlnSigner {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::uln_signer`;
        this.moduleName = 'layerzero::uln_signer';
    }
    async register_TransactionPayload() {
        return new aptos.TxnBuilderTypes.TransactionPayloadEntryFunction(aptos.TxnBuilderTypes.EntryFunction.natural(`${this.module}`, 'register', [], []));
    }
    async registerMS(multisigAccountAddress, multisigAccountPubkey, signFunc) {
        const payload = await this.register_TransactionPayload();
        return await this.sdk.sendAndConfirmMultiSigTransaction(this.sdk.client, multisigAccountAddress, multisigAccountPubkey, payload, signFunc);
    }
    async isRegistered(address) {
        try {
            await this.sdk.client.getAccountResource(address, `${this.module}::Config`);
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
    async getSetFee_TransactionPayload(dstChainId, baseFee, feePerByte) {
        return new aptos.TxnBuilderTypes.TransactionPayloadEntryFunction(aptos.TxnBuilderTypes.EntryFunction.natural(`${this.module}`, 'set_fee', [], [
            aptos.BCS.bcsSerializeUint64(dstChainId),
            aptos.BCS.bcsSerializeUint64(baseFee),
            aptos.BCS.bcsSerializeUint64(feePerByte),
        ]));
    }
    setFeePayload(dstChainId, baseFee, feePerByte) {
        return {
            function: `${this.module}::set_fee`,
            type_arguments: [],
            arguments: [dstChainId, baseFee, feePerByte],
        };
    }
    async setFee(signer, dstChainId, baseFee, feePerByte) {
        const transaction = this.setFeePayload(dstChainId, baseFee, feePerByte);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async setFeeMS(multisigAccountAddress, multisigAccountPubkey, signFunc, dstChainId, baseFee, feePerByte) {
        const payload = await this.getSetFee_TransactionPayload(dstChainId, baseFee, feePerByte);
        return await this.sdk.sendAndConfirmMultiSigTransaction(this.sdk.client, multisigAccountAddress, multisigAccountPubkey, payload, signFunc);
    }
    async getFee(address, dstChainId) {
        try {
            const resource = await this.sdk.client.getAccountResource(address, `${this.module}::Config`);
            const { fees } = resource.data;
            const response = await this.sdk.client.getTableItem(fees.handle, {
                key_type: `u64`,
                value_type: `${this.module}::Fee`,
                key: dstChainId.toString(),
            });
            return {
                base_fee: BigInt(response.base_fee),
                fee_per_byte: BigInt(response.fee_per_byte),
            };
        }
        catch (e) {
            if ((0, utils_1.isErrorOfApiError)(e, 404)) {
                return {
                    base_fee: BigInt(0),
                    fee_per_byte: BigInt(0),
                };
            }
            throw e;
        }
    }
}
exports.UlnSigner = UlnSigner;
