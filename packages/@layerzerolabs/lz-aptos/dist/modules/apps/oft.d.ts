import * as aptos from 'aptos';
import { SDK } from '../../index';
export interface FeeConfig {
    fee_owner: string;
    default_fee_bp: string;
    chain_id_to_fee_bp: {
        handle: string;
    };
}
export interface GlobalStore {
    proxy: boolean;
    ld2sd_rate: string;
    fee_config: FeeConfig;
    custom_adapter_params: boolean;
}
export declare enum PacketType {
    SEND = 0
}
export declare class OFT {
    readonly address: aptos.MaybeHexString;
    readonly module: string;
    SEND_PAYLOAD_LENGTH: number;
    private sdk;
    private lzApp;
    constructor(sdk: SDK);
    setAppConfig(signer: aptos.AptosAccount, oftType: string, major: aptos.BCS.Uint16, minor: aptos.BCS.Uint8, remoteChainId: aptos.BCS.Uint16, configType: aptos.BCS.Uint8, configBytes: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    getMinDstGas(oftType: string, dstChainId: aptos.BCS.Uint16, type: aptos.BCS.Uint64): Promise<bigint>;
    setMinDstGasPayload(oftType: string, dstChainId: aptos.BCS.Uint16, packetType: aptos.BCS.Uint64, minGas: aptos.BCS.Uint64): aptos.Types.EntryFunctionPayload;
    customAdapterParamsEnabled(oftType: string): Promise<boolean>;
    enableCustomAdapterParamsPayload(oftType: string, enable: boolean): aptos.Types.EntryFunctionPayload;
    setRemotePayload(oftType: string, remoteChainId: aptos.BCS.Uint16, remoteOftAddr: aptos.BCS.Bytes): aptos.Types.EntryFunctionPayload;
    setRemote(signer: aptos.AptosAccount, oftType: string, remoteChainId: aptos.BCS.Uint16, remoteOftAddr: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    getRemote(oftType: string, remoteChainId: aptos.BCS.Uint16): Promise<aptos.BCS.Bytes>;
    payloadOfSetDefaultFee(oftType: string, feeBp: aptos.BCS.Uint64): aptos.Types.EntryFunctionPayload;
    setDefaultFee(signer: aptos.AptosAccount, oftType: string, feeBp: aptos.BCS.Uint64): Promise<aptos.Types.Transaction>;
    getDefaultFee(oftType: string): Promise<string>;
    payloadOfSetFee(oftType: string, remoteChainId: aptos.BCS.Uint16, enabled: boolean, feeBp: aptos.BCS.Uint64): aptos.Types.EntryFunctionPayload;
    setFee(signer: aptos.AptosAccount, oftType: string, remoteChainId: aptos.BCS.Uint16, enabled: boolean, feeBp: aptos.BCS.Uint64): Promise<aptos.Types.Transaction>;
    getFee(oftType: string, remoteChainId: aptos.BCS.Uint16): Promise<string>;
    payloadOfSetFeeOwner(oftType: string, owner: aptos.MaybeHexString): aptos.Types.EntryFunctionPayload;
    setFeeOwner(signer: aptos.AptosAccount, oftType: string, owner: aptos.MaybeHexString): Promise<aptos.Types.Transaction>;
    getFeeOwner(oftType: string): Promise<aptos.HexString>;
    sendCoinPayload(oftType: string, dstChainId: aptos.BCS.Uint16, dstReceiver: aptos.BCS.Bytes, amount: aptos.BCS.Uint64 | aptos.BCS.Uint32, minAmount: aptos.BCS.Uint64 | aptos.BCS.Uint32, nativeFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, zroFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, adapterParams: aptos.BCS.Bytes, msglibPararms: aptos.BCS.Bytes): aptos.Types.EntryFunctionPayload;
    sendCoin(signer: aptos.AptosAccount, oftType: string, dstChainId: aptos.BCS.Uint16, dstReceiver: aptos.BCS.Bytes, amount: aptos.BCS.Uint64 | aptos.BCS.Uint32, minAmount: aptos.BCS.Uint64 | aptos.BCS.Uint32, nativeFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, zroFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, adapterParams: aptos.BCS.Bytes, msglibParams: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    payloadOfLzReceive(oftType: string, srcChainId: aptos.BCS.Uint16, srcAddress: aptos.BCS.Bytes, payload: aptos.BCS.Bytes): aptos.Types.EntryFunctionPayload;
    lzReceive(signer: aptos.AptosAccount, oftType: string, srcChainId: aptos.BCS.Uint16, srcAddress: aptos.BCS.Bytes, payload: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    payloadOfClaimCoin(oftType: string): aptos.Types.EntryFunctionPayload;
    claimCoin(signer: aptos.AptosAccount, oftType: string): Promise<aptos.Types.Transaction>;
    isInitialized(oftType: string): Promise<boolean>;
    getClaimableCoin(oftType: string, owner: aptos.MaybeHexString): Promise<aptos.BCS.Uint64>;
    getTotalValueLocked(oftType: string): Promise<aptos.BCS.Uint64>;
    getLd2SdRate(oftType: string): Promise<string>;
    convertAmountToLD(oftType: string, amountSD: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.BCS.Uint64>;
    convertAmountToSD(oftType: string, amountLD: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.BCS.Uint64>;
    payloadOfCoinRegister(oftType: string): aptos.Types.EntryFunctionPayload;
    coinRegister(signer: aptos.AptosAccount, oftType: string): Promise<aptos.Types.Transaction>;
    getTypeAddress(oftType: string): string;
    private getGlobalStore;
    private getCoinStore;
    transferPayload(oftType: string, to: aptos.MaybeHexString, amount: aptos.BCS.Uint64 | aptos.BCS.Uint32): aptos.Types.EntryFunctionPayload;
    transfer(signer: aptos.AptosAccount, oftType: string, to: aptos.MaybeHexString, amount: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    balance(oftType: string, owner: aptos.MaybeHexString): Promise<aptos.BCS.Uint64>;
    isAccountRegistered(oftType: string, accountAddr: aptos.MaybeHexString): Promise<boolean>;
    private getCurrentTimestamp;
    supply(oftType: string, oftOwner: aptos.MaybeHexString): Promise<aptos.BCS.Uint128>;
}
