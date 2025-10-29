import * as aptos from 'aptos';
import { SDK } from '../../index';
import { BridgeCoinType, Coin } from './coin';
import { Packet, TypeInfoEx } from '../../types';
export declare const DEFAULT_LIMITER_CAP_SD = 1000000000000;
export declare const DEFAULT_LIMITER_WINDOW_SEC: number;
export interface RemoteCoin {
    address: aptos.BCS.Bytes;
    tvlSD: aptos.BCS.Uint64;
    unwrappable: boolean;
}
export declare enum PacketType {
    RECIEVE = 0,
    SEND = 1
}
export declare class Bridge {
    private sdk;
    private coin;
    private lzApp;
    private readonly uaType;
    readonly address: aptos.MaybeHexString;
    readonly module: string;
    readonly moduleName: string;
    SEND_PAYLOAD_LENGTH: number;
    constructor(sdk: SDK, coin: Coin, bridge?: aptos.MaybeHexString, lzApp?: aptos.MaybeHexString);
    setAppConfig(signer: aptos.AptosAccount, major: aptos.BCS.Uint16, minor: aptos.BCS.Uint8, remoteChainId: aptos.BCS.Uint16, configType: aptos.BCS.Uint8, configBytes: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    getMinDstGas(dstChainId: aptos.BCS.Uint16, type: aptos.BCS.Uint64): Promise<bigint>;
    setMinDstGasPayload(dstChainId: aptos.BCS.Uint16, packetType: aptos.BCS.Uint64, minGas: aptos.BCS.Uint64): aptos.Types.EntryFunctionPayload;
    customAdapterParamsEnabled(): Promise<boolean>;
    enableCustomAdapterParamsPayload(enable: boolean): aptos.Types.EntryFunctionPayload;
    setRemoteBridgePayload(remoteChainId: aptos.BCS.Uint16, remoteBridgeAddr: aptos.BCS.Bytes): aptos.Types.EntryFunctionPayload;
    setRemoteBridge(signer: aptos.AptosAccount, remoteChainId: aptos.BCS.Uint16, remoteBridgeAddr: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    registerCoinPayload(coin: BridgeCoinType, name: string, symbol: string, decimals: aptos.BCS.Uint8, limiterCapSD: aptos.BCS.Uint32 | aptos.BCS.Uint64): aptos.Types.EntryFunctionPayload;
    registerCoin(signer: aptos.AptosAccount, coin: BridgeCoinType, name: string, symbol: string, decimals: aptos.BCS.Uint8, limiterCapSD: aptos.BCS.Uint32 | aptos.BCS.Uint64): Promise<aptos.Types.Transaction>;
    setRemoteCoinPayload(coin: BridgeCoinType, remoteChainId: aptos.BCS.Uint16, remoteCoinAddr: aptos.MaybeHexString, unwrappable: boolean): aptos.Types.EntryFunctionPayload;
    setRemoteCoin(signer: aptos.AptosAccount, coin: BridgeCoinType, remoteChainId: aptos.BCS.Uint16, remoteCoinAddr: aptos.MaybeHexString, unwrappable: boolean): Promise<aptos.Types.Transaction>;
    forceResumePayload(srcChainId: aptos.BCS.Uint16): aptos.Types.EntryFunctionPayload;
    forceResume(signer: aptos.AptosAccount, srcChainId: aptos.BCS.Uint16): Promise<aptos.Types.Transaction>;
    setPause(signer: aptos.AptosAccount, coin: BridgeCoinType, paused: boolean): Promise<aptos.Types.Transaction>;
    sendCoinPayload(coin: BridgeCoinType, dstChainId: aptos.BCS.Uint16, dstReceiver: aptos.BCS.Bytes, amountLD: aptos.BCS.Uint64 | aptos.BCS.Uint32, nativeFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, zroFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, unwrap: boolean, adapterParams: aptos.BCS.Bytes, msglibPararms: aptos.BCS.Bytes): aptos.Types.EntryFunctionPayload;
    sendCoin(signer: aptos.AptosAccount, coin: BridgeCoinType, dstChainId: aptos.BCS.Uint16, dstReceiver: aptos.BCS.Bytes, amountLD: aptos.BCS.Uint64 | aptos.BCS.Uint32, nativeFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, zroFee: aptos.BCS.Uint64 | aptos.BCS.Uint32, unwrap: boolean, adapterParams: aptos.BCS.Bytes, msglibParams: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    lzReceivePayload(coin: BridgeCoinType, srcChainId: aptos.BCS.Uint16, srcAddress: aptos.BCS.Bytes, payload: aptos.BCS.Bytes): aptos.Types.EntryFunctionPayload;
    lzReceive(signer: aptos.AptosAccount, coin: BridgeCoinType, srcChainId: aptos.BCS.Uint16, srcAddress: aptos.BCS.Bytes, payload: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    getTypesFromPacket(packet: Packet): Promise<string[]>;
    claimCoinPayload(coin: BridgeCoinType): aptos.Types.EntryFunctionPayload;
    claimCoin(signer: aptos.AptosAccount, coin: BridgeCoinType): Promise<aptos.Types.Transaction>;
    globalPaused(): Promise<boolean>;
    getRemoteBridge(remoteChainId: aptos.BCS.Uint16): Promise<aptos.BCS.Bytes>;
    getCoinTypeByRemoteCoin(remoteChainId: string | aptos.BCS.Uint16, remoteCoinAddr: aptos.BCS.Bytes): Promise<TypeInfoEx>;
    getRemoteCoin(coin: BridgeCoinType, remoteChainId: aptos.BCS.Uint16): Promise<RemoteCoin>;
    private getCoinStore;
    getRemoteCoins(coin: BridgeCoinType): Promise<RemoteCoin[]>;
    hasRemoteCoin(coin: BridgeCoinType, remoteChainId: aptos.BCS.Uint16): Promise<boolean>;
    getClaimableCoin(coin: BridgeCoinType, owner: aptos.MaybeHexString): Promise<aptos.BCS.Uint64>;
    hasCoinRegistered(coin: BridgeCoinType): Promise<boolean>;
    getLd2SdRate(coin: BridgeCoinType): Promise<string>;
    convertAmountToLD(coin: BridgeCoinType, amountSD: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.BCS.Uint64>;
    convertAmountToSD(coin: BridgeCoinType, amountLD: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.BCS.Uint64>;
    registerPayload(coin: BridgeCoinType): aptos.Types.EntryFunctionPayload;
    coinRegister(signer: aptos.AptosAccount, coin: BridgeCoinType): Promise<aptos.Types.Transaction>;
    private getCoinTypeStore;
    getCoinTypes(): Promise<TypeInfoEx[]>;
    getLimitedAmount(coin: BridgeCoinType): Promise<{
        limited: boolean;
        amount: aptos.BCS.Uint64;
    }>;
    private getCurrentTimestamp;
    setLimiterCapPayload(coin: BridgeCoinType, enable: boolean, capSD: aptos.BCS.Uint32 | aptos.BCS.Uint64, windowSec: aptos.BCS.Uint32 | aptos.BCS.Uint64): aptos.Types.EntryFunctionPayload;
    setLimiterCap(signer: aptos.AptosAccount, coin: BridgeCoinType, enable: boolean, capSD: aptos.BCS.Uint32 | aptos.BCS.Uint64, windowSec: aptos.BCS.Uint32 | aptos.BCS.Uint64): Promise<aptos.Types.Transaction>;
    getLimitCap(coin: BridgeCoinType): Promise<{
        enabled: boolean;
        capSD: aptos.BCS.Uint64;
        windowSec: aptos.BCS.Uint64;
    }>;
    setGlobalPause(signer: aptos.AptosAccount, pause: boolean): Promise<aptos.Types.Transaction>;
}
