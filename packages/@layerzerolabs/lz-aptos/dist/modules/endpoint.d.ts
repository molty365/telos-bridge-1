import { SDK } from '../index';
import * as aptos from 'aptos';
import { TypeInfoEx } from '../types';
export declare class Endpoint {
    private sdk;
    readonly module: string;
    readonly moduleName: string;
    constructor(sdk: SDK);
    initialize(signer: aptos.AptosAccount, localChainId: aptos.BCS.Uint16): Promise<aptos.Types.Transaction>;
    getUATypeInfo(uaAddress: aptos.MaybeHexString): Promise<TypeInfoEx>;
    getOracleFee(oracleAddr: aptos.MaybeHexString, dstChainId: aptos.BCS.Uint16): Promise<aptos.BCS.Uint64>;
    getRegisterEvents(start: bigint, limit: number): Promise<aptos.Types.Event[]>;
    quoteFee(uaAddress: aptos.MaybeHexString, dstChainId: aptos.BCS.Uint16, adapterParams: aptos.BCS.Bytes, payloadSize: number): Promise<aptos.BCS.Uint64>;
    registerExecutorPayload(executorType: string): aptos.Types.EntryFunctionPayload;
    registerExecutor(signer: aptos.AptosAccount, executorType: string): Promise<aptos.Types.Transaction>;
}
