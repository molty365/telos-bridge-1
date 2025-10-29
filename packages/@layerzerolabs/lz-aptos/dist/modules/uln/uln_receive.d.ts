/// <reference types="node" />
import { SDK } from '../../index';
import * as aptos from 'aptos';
import { MultipleSignFunc } from '../../utils';
export declare class UlnReceive {
    private sdk;
    readonly module: string;
    constructor(sdk: SDK);
    initialize(signer: aptos.AptosAccount): Promise<aptos.Types.Transaction>;
    getOracleProposePayload(hash: Uint8Array, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.EntryFunctionPayload>;
    oraclePropose(signer: aptos.AptosAccount, hash: string, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    getProposal(oracle: aptos.MaybeHexString, hash: string): Promise<aptos.BCS.Uint64>;
    getRelayerVerifyPayload(dstAddress: Uint8Array, packetBytes: Uint8Array, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.EntryFunctionPayload>;
    relayerVerify(signer: aptos.AptosAccount, dstAddress: Uint8Array, packetBytes: Uint8Array, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    oracleProposePayloadMS(multisigAccountAddress: string, hash: Buffer, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.TxnBuilderTypes.TransactionPayload>;
    oracleProposeTxn(multisigAccountAddress: string, hash: Buffer, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.TxnBuilderTypes.RawTransaction>;
    getSubmitHashSigningMessage(txn: aptos.TxnBuilderTypes.RawTransaction): aptos.TxnBuilderTypes.SigningMessage;
    oracleProposeMS(multisigAccountAddress: string, multisigAccountPubkey: aptos.TxnBuilderTypes.MultiEd25519PublicKey, signFunc: MultipleSignFunc, hash: Buffer, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
}
