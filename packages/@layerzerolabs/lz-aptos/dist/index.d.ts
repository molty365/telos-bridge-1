import * as aptos from 'aptos';
import { Layerzero } from './modules';
import { MultipleSignFunc } from './utils';
import { ChainStage } from '@layerzerolabs/lz-sdk';
export * as utils from './utils';
export * as types from './types';
export * as constants from './constants';
export declare type AccountsOption = {
    layerzero?: aptos.MaybeHexString;
    msglib_auth?: aptos.MaybeHexString;
    msglib_v1_1?: aptos.MaybeHexString;
    msglib_v2?: aptos.MaybeHexString;
    zro?: aptos.MaybeHexString;
    executor_auth?: aptos.MaybeHexString;
    executor_v2?: aptos.MaybeHexString;
    executor_pubkey?: aptos.MaybeHexString;
} & Record<string, aptos.MaybeHexString>;
export declare type SdkOptions = {
    provider: aptos.AptosClient;
    stage?: ChainStage;
    accounts?: AccountsOption;
};
export declare class SDK {
    stage: ChainStage;
    client: aptos.AptosClient;
    LayerzeroModule: Layerzero;
    accounts: AccountsOption;
    constructor(options: SdkOptions);
    sendAndConfirmBcsTransaction(bcsTransction: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    sendAndConfirmTransaction(signer: aptos.AptosAccount, payload: aptos.Types.EntryFunctionPayload): Promise<aptos.Types.Transaction>;
    estimateGas(signer: aptos.AptosAccount, payload: aptos.Types.EntryFunctionPayload): Promise<{
        max_gas_amount: string;
        gas_unit_price: string;
    }>;
    sendAndConfirmMultiSigTransaction(client: aptos.AptosClient, multisigAccountAddress: string, multisigAccountPubkey: aptos.TxnBuilderTypes.MultiEd25519PublicKey, payload: aptos.TxnBuilderTypes.TransactionPayload, signFunc: MultipleSignFunc): Promise<{
        type: string;
    } & aptos.Types.UserTransaction>;
    deploy(signer: aptos.AptosAccount, metadata: Uint8Array, modules: aptos.TxnBuilderTypes.Module[]): Promise<string>;
    private waitAndGetTransaction;
    private sendAndConfirmRawTransaction;
}
