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
exports.UlnReceive = void 0;
const aptos = __importStar(require("aptos"));
const aptos_1 = require("aptos");
class UlnReceive {
    constructor(sdk) {
        this.sdk = sdk;
        this.module = `${sdk.accounts.layerzero}::uln_receive`;
    }
    async initialize(signer) {
        const transaction = {
            function: `${this.module}::init`,
            type_arguments: [],
            arguments: [],
        };
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getOracleProposePayload(hash, confirmations) {
        const transaction = {
            function: `${this.module}::oracle_propose`,
            type_arguments: [],
            arguments: [Array.from(hash), confirmations],
        };
        return transaction;
    }
    async oraclePropose(signer, hash, confirmations) {
        const transaction = await this.getOracleProposePayload(aptos_1.HexString.ensure(hash).toUint8Array(), confirmations);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async getProposal(oracle, hash) {
        const resource = await this.sdk.client.getAccountResource(this.sdk.accounts.layerzero, `${this.module}::ProposalStore`);
        const { proposals } = resource.data;
        const response = await this.sdk.client.getTableItem(proposals.handle, {
            key_type: `${this.module}::ProposalKey`,
            value_type: 'u64',
            key: {
                oracle,
                hash,
            },
        });
        return BigInt(response);
    }
    async getRelayerVerifyPayload(dstAddress, packetBytes, confirmations) {
        const uaTypeInfo = await this.sdk.LayerzeroModule.Endpoint.getUATypeInfo(Buffer.from(dstAddress).toString('hex'));
        const transaction = {
            function: `${this.module}::relayer_verify`,
            type_arguments: [uaTypeInfo.type],
            arguments: [Array.from(packetBytes), confirmations],
        };
        return transaction;
    }
    async relayerVerify(signer, dstAddress, packetBytes, confirmations) {
        const transaction = await this.getRelayerVerifyPayload(dstAddress, packetBytes, confirmations);
        return this.sdk.sendAndConfirmTransaction(signer, transaction);
    }
    async oracleProposePayloadMS(multisigAccountAddress, hash, confirmations) {
        const serializer = new aptos.BCS.Serializer();
        serializer.serializeBytes(Uint8Array.from(hash));
        const payloadEntryFunction = new aptos.TxnBuilderTypes.TransactionPayloadEntryFunction(aptos.TxnBuilderTypes.EntryFunction.natural(`${this.module}`, 'oracle_propose', [], [serializer.getBytes(), aptos.BCS.bcsSerializeUint64(confirmations)]));
        return payloadEntryFunction;
    }
    async oracleProposeTxn(multisigAccountAddress, hash, confirmations) {
        const payloadEntryFunction = await this.oracleProposePayloadMS(multisigAccountAddress, hash, confirmations);
        const [{ sequence_number: sequenceNumber }, chainId] = await Promise.all([
            this.sdk.client.getAccount(multisigAccountAddress),
            this.sdk.client.getChainId(),
        ]);
        return new aptos.TxnBuilderTypes.RawTransaction(aptos.TxnBuilderTypes.AccountAddress.fromHex(multisigAccountAddress), BigInt(sequenceNumber), payloadEntryFunction, BigInt(1000), BigInt(1), BigInt(Math.floor(Date.now() / 1000) + 10), new aptos.TxnBuilderTypes.ChainId(chainId));
    }
    getSubmitHashSigningMessage(txn) {
        return aptos.TransactionBuilderMultiEd25519.getSigningMessage(txn);
    }
    async oracleProposeMS(multisigAccountAddress, multisigAccountPubkey, signFunc, hash, confirmations) {
        const payload = await this.oracleProposePayloadMS(multisigAccountAddress, hash, confirmations);
        return await this.sdk.sendAndConfirmMultiSigTransaction(this.sdk.client, multisigAccountAddress, multisigAccountPubkey, payload, signFunc);
    }
}
exports.UlnReceive = UlnReceive;
