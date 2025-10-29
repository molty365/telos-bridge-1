import * as aptos from 'aptos';
import { SDK } from '../../index';
import { UlnConfigType } from '../../types';
export declare class Counter {
    private sdk;
    private lzApp;
    private readonly uaType;
    readonly address: aptos.MaybeHexString;
    SEND_PAYLOAD_LENGTH: number;
    constructor(sdk: SDK, counter: aptos.MaybeHexString, lzApp?: aptos.MaybeHexString);
    initialize(signer: aptos.AptosAccount): Promise<aptos.Types.Transaction>;
    getRemote(remoteChainId: aptos.BCS.Uint16): Promise<aptos.BCS.Bytes>;
    getCount(): Promise<aptos.BCS.Uint64>;
    createCounter(signer: aptos.AptosAccount, i: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    setRemote(signer: aptos.AptosAccount, remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    setAppConfig(signer: aptos.AptosAccount, majorVersion: aptos.BCS.Uint16, minorVersion: aptos.BCS.Uint8, remoteChainId: aptos.BCS.Uint16, configType: aptos.BCS.Uint8, configBytes: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    setAppConfigBundle(signer: aptos.AptosAccount, majorVersion: aptos.BCS.Uint16, minorVersion: aptos.BCS.Uint8, remoteChainId: aptos.BCS.Uint16, config: UlnConfigType): Promise<void>;
    sendToRemote(signer: aptos.AptosAccount, remoteChainId: aptos.BCS.Uint16, fee: aptos.BCS.Uint64 | aptos.BCS.Uint32, adapterParams: Uint8Array): Promise<aptos.Types.Transaction>;
    lzReceive(signer: aptos.AptosAccount, remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes, payload: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    isCounterCreated(address: aptos.MaybeHexString): Promise<boolean>;
}
