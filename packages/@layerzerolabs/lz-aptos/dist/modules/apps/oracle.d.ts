import { SDK } from '../../index';
import * as aptos from 'aptos';
export declare class Oracle {
    sdk: SDK;
    readonly address: aptos.MaybeHexString;
    readonly module: string;
    readonly moduleName: string;
    constructor(sdk: SDK, address: aptos.MaybeHexString);
    getThreshold(): Promise<aptos.BCS.Uint8>;
    setThresholdPayload(threshold: aptos.BCS.Uint8): aptos.Types.EntryFunctionPayload;
    setThreshold(signer: aptos.AptosAccount, threshold: aptos.BCS.Uint8): Promise<aptos.Types.Transaction>;
    isValidator(validator: aptos.MaybeHexString): Promise<boolean>;
    setValidatorPayload(validator: aptos.MaybeHexString, active: boolean): aptos.Types.EntryFunctionPayload;
    setValidator(signer: aptos.AptosAccount, validator: aptos.MaybeHexString, active: boolean): Promise<aptos.Types.Transaction>;
    setFeePayload(dstChainId: aptos.BCS.Uint16, baseFee: aptos.BCS.Uint64 | aptos.BCS.Uint32): aptos.Types.EntryFunctionPayload;
    setFee(signer: aptos.AptosAccount, dstChainId: aptos.BCS.Uint16, baseFee: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    getProposePayload(hash: Uint8Array, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): aptos.Types.EntryFunctionPayload;
    propose(signer: aptos.AptosAccount, hash: Uint8Array, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    isSubmitted(validator: aptos.MaybeHexString, hash: string, confirmations: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<boolean>;
    getResourceAddress(): Promise<string>;
    withdrawFee(signer: aptos.AptosAccount, receiver: aptos.MaybeHexString, amount: aptos.BCS.Uint64): Promise<aptos.Types.Transaction>;
}
