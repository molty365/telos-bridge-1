import { SDK } from '../../index';
import * as aptos from 'aptos';
export declare class PacketEvent {
    private sdk;
    readonly module: string;
    constructor(sdk: SDK);
    getInboundEvents(start: bigint, limit: number): Promise<aptos.Types.Event[]>;
    getInboundEventCount(): Promise<number>;
    getOutboundEvents(start: bigint, limit: number): Promise<aptos.Types.Event[]>;
    getOutboundEventCount(): Promise<number>;
}
