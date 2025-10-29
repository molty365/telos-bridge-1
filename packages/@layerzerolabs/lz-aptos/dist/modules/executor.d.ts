import { SDK } from '../index';
import * as aptos from 'aptos';
import { Packet } from '../types';
export interface Fee {
    airdropAmtCap: aptos.BCS.Uint64;
    priceRatio: aptos.BCS.Uint64;
    gasPrice: aptos.BCS.Uint64;
}
export declare class Executor {
    private sdk;
    readonly module: string;
    readonly moduleName: string;
    readonly type: string;
    constructor(sdk: SDK);
    setDefaultAdapterParamsPayload(dstChainId: aptos.BCS.Uint16, adapterParams: aptos.BCS.Bytes): aptos.Types.EntryFunctionPayload;
    setDefaultAdapterParams(signer: aptos.AptosAccount, dstChainId: aptos.BCS.Uint16, adapterParams: aptos.BCS.Bytes): Promise<aptos.Types.Transaction>;
    getDefaultAdapterParams(chainId: aptos.BCS.Uint16): Promise<aptos.BCS.Bytes>;
    isRegistered(address: aptos.MaybeHexString): Promise<boolean>;
    registerPayload(): aptos.Types.EntryFunctionPayload;
    register(signer: aptos.AptosAccount): Promise<aptos.Types.Transaction>;
    setFeePayload(dstChainId: aptos.BCS.Uint16, config: Fee): aptos.Types.EntryFunctionPayload;
    setFee(signer: aptos.AptosAccount, dstChainId: aptos.BCS.Uint16, config: Fee): Promise<aptos.Types.Transaction>;
    getFee(executor: aptos.MaybeHexString, chainId: aptos.BCS.Uint16): Promise<Fee>;
    airdropPayload(srcChainId: aptos.BCS.Uint16, guid: aptos.BCS.Bytes, receiver: aptos.MaybeHexString, amount: aptos.BCS.Uint64 | aptos.BCS.Uint32): aptos.Types.EntryFunctionPayload;
    airdrop(signer: aptos.AptosAccount, srcChainId: aptos.BCS.Uint16, guid: aptos.BCS.Bytes, receiver: aptos.MaybeHexString, amount: aptos.BCS.Uint64 | aptos.BCS.Uint32): Promise<aptos.Types.Transaction>;
    isAirdropped(guid: aptos.BCS.Bytes, receiver: aptos.MaybeHexString): Promise<boolean>;
    quoteFee(executor: aptos.MaybeHexString, dstChainId: aptos.BCS.Uint16, adapterParams: aptos.BCS.Bytes): Promise<aptos.BCS.Uint64>;
    buildDefaultAdapterParams(uaGas: aptos.BCS.Uint64 | aptos.BCS.Uint32): aptos.BCS.Bytes;
    buildAirdropAdapterParams(uaGas: aptos.BCS.Uint64 | aptos.BCS.Uint32, airdropAmount: aptos.BCS.Uint64 | aptos.BCS.Uint32, airdropAddress: string): aptos.BCS.Bytes;
    decodeAdapterParams(adapterParams: aptos.BCS.Bytes): [aptos.BCS.Uint16, aptos.BCS.Uint64, aptos.BCS.Uint64, string];
    getLzReceiveTypeArguments(packet: Packet): Promise<string[]>;
    getLzReceivePayload(type_arguments: string[], packet: Packet): Promise<aptos.Types.EntryFunctionPayload>;
    lzReceive(signer: aptos.AptosAccount, type_arguments: string[], packet: Packet): Promise<aptos.Types.Transaction>;
    getShortRequestEventType(): string;
}
