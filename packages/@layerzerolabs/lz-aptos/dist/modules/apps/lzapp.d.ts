import * as aptos from 'aptos';
import { SDK } from '../../index';
import { UlnConfigType } from '../../types';
export declare class LzApp {
    private sdk;
    private readonly lzApp;
    private readonly ua;
    constructor(sdk: SDK, lzApp: aptos.MaybeHexString, ua: aptos.MaybeHexString);
    getRemote(remoteChainId: aptos.BCS.Uint16): Promise<aptos.BCS.Bytes>;
    getMinDstGas(uaType: string, remoteChainId: aptos.BCS.Uint16, packetType: aptos.BCS.Uint64): Promise<aptos.BCS.Uint64>;
    setMinDstPayload(uaType: string, remoteChainId: aptos.BCS.Uint16, packetType: aptos.BCS.Uint64, minDstGas: aptos.BCS.Uint64): aptos.Types.EntryFunctionPayload;
    setMinDstGas(signer: aptos.AptosAccount, uaType: string, remoteChainId: aptos.BCS.Uint16, packetType: aptos.BCS.Uint64, minDstGas: aptos.BCS.Uint64): Promise<aptos.Types.Transaction>;
    setRemotePaylaod(remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes): aptos.Types.EntryFunctionPayload;
    setRemote(signer: aptos.AptosAccount, remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    setConfig(signer: aptos.AptosAccount, uaType: string, majorVersion: aptos.BCS.Uint16, minorVersion: aptos.BCS.Uint8, remoteChainId: aptos.BCS.Uint16, configType: aptos.BCS.Uint8, configBytes: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    setConfigBundle(signer: aptos.AptosAccount, uaType: string, majorVersion: aptos.BCS.Uint16, minorVersion: aptos.BCS.Uint8, remoteChainId: aptos.BCS.Uint16, config: UlnConfigType): Promise<void>;
}
