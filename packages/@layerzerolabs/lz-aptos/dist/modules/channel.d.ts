import { SDK } from '../index';
import * as aptos from 'aptos';
export interface ChannelType {
    outbound_nonce: string;
    inbound_nonce: string;
    payload_hashs: {
        handle: string;
    };
}
export declare class Channel {
    private sdk;
    readonly module: string;
    constructor(sdk: SDK);
    getOutboundEvents(start: bigint, limit: number): Promise<aptos.Types.Event[]>;
    getInboundEvents(start: bigint, limit: number): Promise<aptos.Types.Event[]>;
    getReceiveEvents(start: bigint, limit: number): Promise<aptos.Types.Event[]>;
    getChannelState(uaAddress: aptos.MaybeHexString, remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes): Promise<ChannelType>;
    getOutboundNonce(uaAddress: aptos.MaybeHexString, remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes): Promise<aptos.BCS.Uint64>;
    getInboundNonce(uaAddress: aptos.MaybeHexString, remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes): Promise<aptos.BCS.Uint64>;
    getPayloadHash(uaAddress: aptos.MaybeHexString, remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes, nonce: aptos.BCS.Uint64): Promise<string>;
    isProofDelivered(uaAddress: aptos.MaybeHexString, remoteChainId: aptos.BCS.Uint16, remoteAddress: aptos.BCS.Bytes, nonce: aptos.BCS.Uint64): Promise<boolean>;
}
