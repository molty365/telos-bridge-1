import { SDK } from '../index';
import * as aptos from 'aptos';
export declare class ExecutorConfig {
    private sdk;
    readonly module: string;
    constructor(sdk: SDK);
    getDefaultExecutor(remoteChainId: aptos.BCS.Uint16): Promise<[string, aptos.BCS.Uint64]>;
    getExecutor(uaAddress: aptos.MaybeHexString, remoteChainId: aptos.BCS.Uint16): Promise<[string, aptos.BCS.Uint64]>;
    setDefaultExecutorPayload(remoteChainId: aptos.BCS.Uint16, version: aptos.BCS.Uint8, executor: aptos.MaybeHexString): aptos.Types.EntryFunctionPayload;
}
