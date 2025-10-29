import { SDK } from '../../index';
import * as aptos from 'aptos';
import { MultipleSignFunc } from '../../utils';
import { UlnSignerFee } from '../../types';
export declare class UlnSigner {
    private sdk;
    readonly module: string;
    readonly moduleName: string;
    constructor(sdk: SDK);
    register_TransactionPayload(): Promise<aptos.TxnBuilderTypes.TransactionPayload>;
    registerMS(multisigAccountAddress: string, multisigAccountPubkey: aptos.TxnBuilderTypes.MultiEd25519PublicKey, signFunc: MultipleSignFunc): Promise<aptos.Types.Transaction>;
    isRegistered(address: aptos.MaybeHexString): Promise<boolean>;
    registerPayload(): aptos.Types.EntryFunctionPayload;
    register(signer: aptos.AptosAccount): Promise<aptos.Types.Transaction>;
    getSetFee_TransactionPayload(dstChainId: aptos.BCS.Uint16, baseFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, feePerByte: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.TxnBuilderTypes.TransactionPayload>;
    setFeePayload(dstChainId: aptos.BCS.Uint16, baseFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, feePerByte: aptos.BCS.Uint64 | aptos.BCS.Uint32): aptos.Types.EntryFunctionPayload;
    setFee(signer: aptos.AptosAccount, dstChainId: aptos.BCS.Uint16, baseFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, feePerByte: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    setFeeMS(multisigAccountAddress: string, multisigAccountPubkey: aptos.TxnBuilderTypes.MultiEd25519PublicKey, signFunc: MultipleSignFunc, dstChainId: aptos.BCS.Uint16, baseFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, feePerByte: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    getFee(address: aptos.MaybeHexString, dstChainId: aptos.BCS.Uint16): Promise<UlnSignerFee>;
}
