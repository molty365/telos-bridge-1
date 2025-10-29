import { SDK } from '../../index';
import * as aptos from 'aptos';
import { UlnConfigType } from '../../types';
export declare class UlnConfig {
    private sdk;
    TYPE_ORACLE: number;
    TYPE_RELAYER: number;
    TYPE_INBOUND_CONFIRMATIONS: number;
    TYPE_OUTBOUND_CONFIRMATIONS: number;
    readonly module: string;
    readonly moduleName: string;
    constructor(sdk: SDK);
    setDefaultAppConfigPayload(remoteChainId: aptos.BCS.Uint16, config: UlnConfigType): aptos.Types.EntryFunctionPayload;
    setDefaultAppConfig(signer: aptos.AptosAccount, remoteChainId: aptos.BCS.Uint16, config: UlnConfigType): Promise<aptos.Types.Transaction>;
    setChainAddressSizePayload(remoteChainId: aptos.BCS.Uint16, addressSize: aptos.BCS.Uint8): aptos.Types.EntryFunctionPayload;
    setChainAddressSize(signer: aptos.AptosAccount, remoteChainId: aptos.BCS.Uint16, addressSize: aptos.BCS.Uint8): Promise<aptos.Types.Transaction>;
    getChainAddressSize(remoteChainId: aptos.BCS.Uint16): Promise<aptos.BCS.Uint8>;
    getDefaultAppConfig(remoteChainId: aptos.BCS.Uint16): Promise<UlnConfigType>;
    getAppConfig(uaAddress: aptos.MaybeHexString, remoteChainId: aptos.BCS.Uint16): Promise<UlnConfigType>;
    private mergeConfig;
    quoteFee(uaAddress: aptos.MaybeHexString, dstChainId: aptos.BCS.Uint16, payloadSize: number): Promise<aptos.BCS.Uint64>;
}
