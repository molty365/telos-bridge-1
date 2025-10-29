import { SDK } from '../index';
import * as aptos from 'aptos';
export declare class MsgLibConfig {
    private sdk;
    readonly module: string;
    readonly moduleName: string;
    readonly semverModule: string;
    constructor(sdk: SDK);
    getDefaultSendMsgLib(remoteChainId: aptos.BCS.Uint16): Promise<{
        major: aptos.BCS.Uint64;
        minor: aptos.BCS.Uint8;
    }>;
    getDefaultReceiveMsgLib(remoteChainId: aptos.BCS.Uint16): Promise<{
        major: aptos.BCS.Uint64;
        minor: aptos.BCS.Uint8;
    }>;
    setDefaultSendMsgLibPayload(remoteChainId: aptos.BCS.Uint16, major: aptos.BCS.Uint64, minor: aptos.BCS.Uint8): aptos.Types.EntryFunctionPayload;
    setDefaultReceiveMsgLibPayload(remoteChainId: aptos.BCS.Uint16, major: aptos.BCS.Uint64, minor: aptos.BCS.Uint8): aptos.Types.EntryFunctionPayload;
}
