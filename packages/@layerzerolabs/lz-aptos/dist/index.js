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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SDK = exports.constants = exports.types = exports.utils = void 0;
const aptos = __importStar(require("aptos"));
const tiny_invariant_1 = __importDefault(require("tiny-invariant"));
const modules_1 = require("./modules");
const utils_1 = require("./utils");
const constants_1 = require("./constants");
const lz_sdk_1 = require("@layerzerolabs/lz-sdk");
exports.utils = __importStar(require("./utils"));
exports.types = __importStar(require("./types"));
exports.constants = __importStar(require("./constants"));
class SDK {
    constructor(options) {
        this.stage = options.stage ?? lz_sdk_1.ChainStage.TESTNET_SANDBOX;
        this.accounts = options.accounts ?? {
            layerzero: constants_1.LAYERZERO_ADDRESS[this.stage],
            msglib_auth: constants_1.LAYERZERO_ADDRESS[this.stage],
            msglib_v1_1: constants_1.LAYERZERO_ADDRESS[this.stage],
            msglib_v2: constants_1.LAYERZERO_ADDRESS[this.stage],
            zro: constants_1.LAYERZERO_ADDRESS[this.stage],
            executor_auth: constants_1.LAYERZERO_ADDRESS[this.stage],
            executor_v2: constants_1.LAYERZERO_ADDRESS[this.stage],
            executor_pubkey: constants_1.EXECUTOR_PUBKEY[this.stage],
            layerzero_apps: constants_1.LAYERZERO_APPS_ADDRESS[this.stage],
        };
        this.client = options.provider;
        this.LayerzeroModule = new modules_1.Layerzero(this);
    }
    async sendAndConfirmBcsTransaction(bcsTransction) {
        const res = await this.client.submitSignedBCSTransaction(bcsTransction);
        return this.waitAndGetTransaction(res.hash);
    }
    async sendAndConfirmTransaction(signer, payload) {
        const options = await this.estimateGas(signer, payload);
        const txnRequest = await this.client.generateTransaction(signer.address(), payload, options);
        const signedTxn = await this.client.signTransaction(signer, txnRequest);
        return this.sendAndConfirmRawTransaction(signedTxn);
    }
    async estimateGas(signer, payload) {
        const txnRequest = await this.client.generateTransaction(signer.address(), payload);
        const sim = await this.client.simulateTransaction(signer, txnRequest, {
            estimateGasUnitPrice: true,
            estimateMaxGasAmount: true,
            estimatePrioritizedGasUnitPrice: true,
        });
        const tx = sim[0];
        (0, tiny_invariant_1.default)(tx.success, `Transaction failed: ${tx.vm_status}}`);
        const max_gas_amount = (0, utils_1.applyGasLimitSafety)(tx.gas_used).toString();
        return {
            max_gas_amount,
            gas_unit_price: tx.gas_unit_price,
        };
    }
    async sendAndConfirmMultiSigTransaction(client, multisigAccountAddress, multisigAccountPubkey, payload, signFunc) {
        const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
            client.getAccount(multisigAccountAddress),
            client.getChainId(),
        ]);
        const rawTxn = new aptos.TxnBuilderTypes.RawTransaction(aptos.TxnBuilderTypes.AccountAddress.fromHex(multisigAccountAddress), BigInt(sequenceNumber), payload, BigInt(10000), //todo: estimate gas, payload
        BigInt(100), //todo: get gas price
        BigInt(Math.floor(Date.now() / 1000) + 10), new aptos.TxnBuilderTypes.ChainId(chainId));
        const signingMessage = aptos.TransactionBuilderMultiEd25519.getSigningMessage(rawTxn);
        const items = await signFunc(signingMessage);
        const signatures = items.map((item) => item.signature);
        const bitmap = items.map((item) => item.bitmap);
        const signedBCSTxn = (0, utils_1.multiSigSignedBCSTxn)(multisigAccountPubkey, rawTxn, signatures, bitmap);
        const pendingTransaction = await client.submitSignedBCSTransaction(signedBCSTxn);
        const txnHash = pendingTransaction.hash;
        await client.waitForTransaction(pendingTransaction.hash);
        const txn = (await client.getTransactionByHash(txnHash));
        (0, tiny_invariant_1.default)(txn.type == 'user_transaction', `Invalid response type: ${txn.type}`);
        (0, tiny_invariant_1.default)(txn.success, `Transaction failed: ${txn.vm_status}`);
        return txn;
    }
    async deploy(signer, metadata, modules) {
        const gasUnitPrice = BigInt((await this.client.estimateGasPrice()).gas_estimate);
        const txnHash = await this.client.publishPackage(signer, metadata, modules, {
            maxGasAmount: BigInt(20000 * modules.length),
            gasUnitPrice,
        });
        const txn = (await this.client.waitForTransactionWithResult(txnHash));
        if (!txn.success) {
            throw new Error(txn.vm_status);
        }
        return txnHash;
    }
    async waitAndGetTransaction(txnHash) {
        await this.client.waitForTransaction(txnHash);
        const tx = await this.client.getTransactionByHash(txnHash);
        (0, tiny_invariant_1.default)(tx.type == 'user_transaction', `Invalid response type: ${tx.type}`);
        const txn = tx;
        (0, tiny_invariant_1.default)(txn.success, `Transaction failed: ${txn.vm_status}`);
        return tx;
    }
    async sendAndConfirmRawTransaction(signedTransaction) {
        const res = await this.client.submitTransaction(signedTransaction);
        return this.waitAndGetTransaction(res.hash);
    }
}
exports.SDK = SDK;
